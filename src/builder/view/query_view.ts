import { ExtractedColumn } from "../extracted_column";
import { Group } from "../group";
import { OrdinaryJoin } from "../join/ordinary_join";
import { PhraseResolutionContext } from "../phrase_resolution_context";
import { ResolvedColumn } from "../resolved_column";
import { ResolvedReference } from "../resolved_reference";
import { ResolvedView } from "../resolved_view";
import { ViewResolver } from "../view_resolver";
import { ReferenceView, ReferenceViewArgs } from "./reference_view";

export class QueryView extends ReferenceView {
  groups: Group[];
  columnsInheritanceEnabled: boolean;

  constructor({
    columnsInheritanceEnabled,
    groups = [],
    ...args
  }: ReferenceViewArgs & {
    columnsInheritanceEnabled: boolean;
    groups?: Group[];
  }) {
    super({ type: "query", ...args });
    this.columnsInheritanceEnabled = columnsInheritanceEnabled;
    this.groups = groups;
  }

  private buildColumns(
    dependentView: ResolvedView,
    context: PhraseResolutionContext
  ): ExtractedColumn[] {
    const columns: ExtractedColumn[] = [];
    this.columns.forEach((column) => {
      columns.push(
        new ExtractedColumn({
          publicName: column.name,
          physicalName: column.alphabetName,
          selectSQL: column.value.toSQL(context),
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
    this.mixinUsages.forEach((mixinUsage) => {
      const mixin = resolver.findMixin(mixinUsage.name);
      jointConditions.push(...mixin.conditions);
      jointJoins.push(...mixin.joins);
    });

    const dependentView = resolver.resolve(this.source);
    const availableColumns: ResolvedColumn[] = [
      ...dependentView.asResolvedColumns(),
    ];
    jointJoins.forEach((join) => {
      if (join instanceof OrdinaryJoin) {
        const joinDependentView = resolver.resolve(join.target);
        availableColumns.push(...joinDependentView.asResolvedColumns());
      }
    });
    const context = new PhraseResolutionContext({
      currentView: this,
      resolver,
      availableColumns,
    });

    const joinPhrases = jointJoins.map((join) => join.toSQL(context));
    const conditionPhrases = jointConditions.map((condition) =>
      condition.toSQL(context)
    );
    const groupPhrases = this.groups.map((group) => group.toSQL(context));
    const orderPhrases = this.orders.map((order) => order.toSQL(context));

    return new ResolvedReference({
      columns: this.buildColumns(dependentView, context),
      physicalSource: dependentView.physicalName,
      joinPhrases,
      conditionPhrases,
      groupPhrases,
      orderPhrases,
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
