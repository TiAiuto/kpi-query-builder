import { ExtractedColumn } from "../extracted_column";
import { OrdinaryJoin } from "../join/ordinary_join";
import { PhraseResolutionContext } from "../phrase_resolution_context";
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

  private buildColumns(
    dependentView: ResolvedView,
    context: PhraseResolutionContext
  ): ExtractedColumn[] {
    const columns: ExtractedColumn[] = [];
    this.columns.forEach((column) => {
      const resolvedColumn = context.findColumnByValue(column.value);
      columns.push(
        resolvedColumn.toExtractedColumn({
          newPublicName: column.name, 
          newPhysicalName: column.alphabetName
        })
      );
    });
    if (this.columnsInheritanceEnabled) {
      columns.push(...dependentView.asInheritedExtractedColumns());
    }
    return columns;
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
      ...dependentView.asResolvedColumns(),
    ];
    jointJoins.forEach((join) => {
      if (join instanceof OrdinaryJoin) {
        const joinDependentView = resolver.resolve(join.target);
        availableColumns.push(
          ...joinDependentView.asResolvedColumns()
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
      columns: this.buildColumns(dependentView, phraseResolutionContext),
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
