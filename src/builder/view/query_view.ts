import { ExtractedColumn } from "../extracted_column";
import { OrdinaryJoin } from "../join/ordinary_join";
import { PhraseResolutionContext } from "../phrase_resolution_context";
import { ReferenceResolvedColumn } from "../reference_resolved_column";
import { ResolvedColumn } from "../resolved_column";
import { ResolvedReference } from "../resolved_reference";
import { ResolvedView } from "../resolved_view";
import { ViewResolver } from "../view_resolver";
import { ReferenceView, ReferenceViewArgs } from "./reference_view";

export class QueryView extends ReferenceView {
  columnsInheritanceEnabled: boolean;

  constructor({
    columnsInheritanceEnabled,
    ...args
  }: ReferenceViewArgs & { columnsInheritanceEnabled: boolean }) {
    super({ type: "query", ...args });
    this.columnsInheritanceEnabled = columnsInheritanceEnabled;
  }

  private resolveInheritedAsOwnColumn(
    dependentView: ResolvedView
  ): ResolvedColumn[] {
    return dependentView.resolvedColumns.map((dependentResolvedColumn) => {
      return new ReferenceResolvedColumn({
        publicSource: this.name,
        publicName: dependentResolvedColumn.publicName,
        physicalName: dependentResolvedColumn.physicalName,
        physicalSource: dependentView.physicalName,
        physicalSourceValue: dependentResolvedColumn.physicalName,
      });
    });
  }

  private resolveAvailableColumns(
    dependentQuery: ResolvedView
  ): ResolvedColumn[] {
    return dependentQuery.resolvedColumns.map(
      (column) =>
        new ReferenceResolvedColumn({
          publicSource: dependentQuery.publicName,
          publicName: column.publicName,
          physicalName: column.physicalName, // この値は使われない想定だが正しい値を入れておく
          physicalSource: dependentQuery.physicalName,
          physicalSourceValue: column.physicalName,
        })
    );
  }

  private buildColumns(
    dependentView: ResolvedView,
    context: PhraseResolutionContext
  ): ExtractedColumn[] {
    const resolvedColumns: ResolvedColumn[] = [];
    this.columns.forEach((column) => {
      const resolvedColumn = context.findColumnByValue(column.value);
      resolvedColumns.push(
        new ReferenceResolvedColumn({
          publicSource: this.name,
          publicName: column.name,
          physicalName: column.alphabetName,
          physicalSource: resolvedColumn.physicalSource,
          physicalSourceValue: resolvedColumn.physicalSourceValue,
        })
      );
    });
    if (this.columnsInheritanceEnabled) {
      resolvedColumns.push(...this.resolveInheritedAsOwnColumn(dependentView));
    }
    return resolvedColumns;
  }

  private buildResolvedReference(resolver: ViewResolver): ResolvedReference {
    const jointConditions = [...this.conditions];
    const jointJoins = [...this.joins];
    this.filterUsages.forEach((filterUsage) => {
      const filter = resolver.findFilter(filterUsage.name);
      jointConditions.push(...filter.conditions);
      jointJoins.push(...filter.joins);
    });

    const dependentView = resolver.resolve(this.source);
    const availableColumns: ResolvedColumn[] = [
      ...this.resolveAvailableColumns(dependentView),
    ];
    jointJoins.forEach((join) => {
      if (join instanceof OrdinaryJoin) {
        const joinDependentView = resolver.resolve(join.target);
        availableColumns.push(
          ...this.resolveAvailableColumns(joinDependentView)
        );
      }
    });
    const phraseResolutionContext = new PhraseResolutionContext({
      currentView: this,
      resolver,
      availableColumns,
    });

    const joinPhrases = jointJoins.map((join) =>
      join.toSQL(phraseResolutionContext)
    );
    const conditionPhrases = jointConditions.map((condition) =>
      condition.toSQL(phraseResolutionContext)
    );

    return new ResolvedReference({
      columns: this.buildColumns(
        dependentView,
        phraseResolutionContext
      ),
      physicalSource: dependentView.physicalName,
      joinPhrases,
      conditionPhrases,
      groupPhrases: [],
      orderPhrases: [], // TODO: orderは後で
    });
  }

  resolve(resolver: ViewResolver): ResolvedView {
    const resolvedReference = this.buildResolvedReference(resolver);

    return new ResolvedView({
      publicName: this.name,
      physicalName: this.alphabetName,
      columns: resolvedReference.columns,
      sql: resolvedReference.toSQL(),
    });
  }
}
