import { SelectColumn } from "../select_column";
import { Group } from "../group";
import { OrdinaryJoin } from "../join/ordinary_join";
import { ViewResolutionContext } from "../view_resolution_context";
import { PublicColumnReference } from "../public_column_reference";
import { ResolvedQuery } from "../resolved_query";
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
    context: ViewResolutionContext
  ): SelectColumn[] {
    const columns: SelectColumn[] = [];
    this.columns.forEach((column) => {
      columns.push(
        new SelectColumn({
          publicName: column.name,
          physicalName: column.alphabetName,
          selectSQL: `${column.value.toSQL(context)} AS ${column.alphabetName}`,
        })
      );
    });
    if (this.columnsInheritanceEnabled) {
      columns.push(...dependentView.asInheritedExtractedColumns());
    }
    return columns;
  }

  private buildResolvedReference(resolver: ViewResolver): ResolvedQuery {
    const jointConditions = [...this.conditions];
    const jointJoins = [...this.joins];
    this.mixinUsages.forEach((mixinUsage) => {
      const mixin = resolver.findMixin(mixinUsage.name);
      jointConditions.push(...mixin.conditions);
      jointJoins.push(...mixin.joins);
    });

    const dependentView = resolver.resolve(this.source);
    const availableColumns: PublicColumnReference[] = [
      ...dependentView.asResolvedColumns(),
    ];
    jointJoins.forEach((join) => {
      if (join instanceof OrdinaryJoin) {
        const joinDependentView = resolver.resolve(join.target);
        availableColumns.push(...joinDependentView.asResolvedColumns());
      }
    });
    const context = new ViewResolutionContext({
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

    return new ResolvedQuery({
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
