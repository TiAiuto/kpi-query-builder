import { SelectColumn } from "../select_column";
import { Group } from "../group";
import { OrdinaryJoin } from "../join/ordinary_join";
import { ViewResolutionContext } from "../view_resolution_context";
import { PublicColumnReference } from "../public_column_reference";
import { ResolvedQuery } from "../resolved_query";
import { ResolvedView } from "../resolved_view";
import { ViewResolver } from "../view_resolver";
import { ReferenceView, ReferenceViewArgs } from "./reference_view";
import { ValueSurface } from "../value_surface";

export class QueryView extends ReferenceView {
  groups: Group[];
  inheritAllColumnsEnabled: boolean;
  inheritColumns: string[];
  distinct: boolean;

  // TODO: ここでsource指定かsourceView指定か切り替えれるようにしたい

  constructor({
    inheritAllColumnsEnabled = false,
    groups = [],
    inheritColumns = [],
    distinct = false,
    ...args
  }: ReferenceViewArgs & {
    inheritAllColumnsEnabled?: boolean;
    inheritColumns?: string[];
    groups?: Group[];
    distinct?: boolean;
  }) {
    super({ type: "query", ...args });
    this.inheritAllColumnsEnabled = inheritAllColumnsEnabled;
    this.inheritColumns = inheritColumns;
    this.groups = groups;
    this.distinct = distinct;
  }

  private buildColumns(
    joinColumns: ValueSurface[],
    dependentView: ResolvedView,
    context: ViewResolutionContext
  ): SelectColumn[] {
    const columns: SelectColumn[] = [];
    if (this.inheritAllColumnsEnabled) {
      // TODO: 本当はJoinしたテーブルの分もとりにいったほうが正しそう
      columns.push(...dependentView.asInheritedExtractedColumns());
    } else {
      this.inheritColumns.forEach((inheritColumn) => {
        const columnRef = context.findColumnByName(inheritColumn, dependentView.publicName);
        columns.push(
          new SelectColumn({
            publicName: columnRef.publicName,
            physicalName: columnRef.physicalName,
            selectSQL: `${columnRef.physicalName}`,
          })
        );
      });
    }
    joinColumns.forEach((column) => {
      columns.push(
        new SelectColumn({
          publicName: column.name,
          physicalName: column.alphabetName,
          selectSQL: `${column.value.toSQL(context)} AS ${column.alphabetName}`,
        })
      );
    });
    return columns;
  }

  private buildResolvedReference(resolver: ViewResolver): ResolvedQuery {
    const jointColumns = [...this.columns];
    const jointConditions = [...this.conditions];
    const jointJoins = [...this.joins];
    this.mixinUsages.forEach((mixinUsage) => {
      const mixin = resolver.findMixin(mixinUsage.name);
      jointConditions.push(...mixin.conditions);
      jointJoins.push(...mixin.joins);
      jointColumns.push(...mixin.columns);
    });

    const dependentView = resolver.resolve(this.source);
    const availableColumns: PublicColumnReference[] = [
      ...dependentView.asResolvedColumns(),
    ];
    jointJoins.forEach((join) => {
      if (join instanceof OrdinaryJoin) {
        const joinDependentView = resolver.resolve(join.target);
        availableColumns.push(
          ...joinDependentView.asResolvedColumns({
            publicNameAlias: join.publicNameAlias,
            physicalNameAlias: join.physicalNameAlias,
          })
        );
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
      columns: this.buildColumns(jointColumns, dependentView, context),
      physicalSource: dependentView.physicalName,
      joinPhrases,
      conditionPhrases,
      groupPhrases,
      orderPhrases,
      distinct: this.distinct
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
