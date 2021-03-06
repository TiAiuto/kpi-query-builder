import { Condition } from "../condition/condition";
import { SelectColumn } from "../select_column";
import { Join } from "../join/join";
import { MixinUsage } from "../mixin_usage";
import { ViewResolutionContext } from "../view_resolution_context";
import { ResolvedQuery } from "../resolved_query";
import { ResolvedView } from "../resolved_view";
import { RawValue } from "../value/raw_value";
import { ValueSurface } from "../value_surface";
import { ViewResolver } from "../view_resolver";
import { View, ViewArgs } from "./view";

export class RootView extends View {
  mixinUsages: MixinUsage[];
  conditions: Condition[];
  joins: Join[];
  physicalSource: string;
  physicalSourceAlias: string;
  dateSuffixEnabled: boolean;
  columns: ValueSurface[];
  distinct: boolean;

  constructor({
    mixinUsages = [],
    conditions = [],
    joins = [],
    physicalSource,
    physicalSourceAlias,
    dateSuffixEnabled,
    columns,
    distinct = false,
    ...args
  }: ViewArgs & {
    mixinUsages?: MixinUsage[];
    conditions?: Condition[];
    joins?: Join[];
    physicalSource: string;
    physicalSourceAlias: string;
    dateSuffixEnabled: boolean;
    columns: ValueSurface[];
    distinct?: boolean;
  }) {
    super({
      ...args,
      type: "root",
    });
    this.mixinUsages = mixinUsages;
    this.conditions = conditions;
    this.joins = joins;
    this.physicalSource = physicalSource;
    this.physicalSourceAlias = physicalSourceAlias;
    this.dateSuffixEnabled = dateSuffixEnabled;
    this.columns = columns;
    this.distinct = distinct;
  }

  private buildColumns(joinsColumns: ValueSurface[], context: ViewResolutionContext): SelectColumn[] {
    return joinsColumns.map((column) => {
      if (column.value instanceof RawValue) {
        return new SelectColumn({
          publicName: column.name,
          physicalName: column.alphabetName,
          selectSQL: `${column.value.toSQLForRoot(context)} AS ${column.alphabetName}`, // RawValueはselectを想定しているがWHEREなどでも動くはず
        });
      } else {
        throw new Error("Raw Value以外のcolumn指定はRoot Viewでは未対応");
      }
    });
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

    // rootではraw以外のjoin, conditionは使わない想定
    const joinPhrases = jointJoins.map((join) => join.toSQLForRoot());
    const conditionPhrases = jointConditions.map((condition) =>
      condition.toSQLForRoot()
    );

    const phraseResolutionContext = new ViewResolutionContext({
      currentView: this,
      resolver,
      availableColumns: [], // Root Viewでは特になし＆rawを使う想定
    });

    return new ResolvedQuery({
      columns: this.buildColumns(jointColumns, phraseResolutionContext),
      physicalSource: this.physicalSource,
      physicalSourceAlias: this.physicalSourceAlias,
      joinPhrases,
      conditionPhrases,
      groupPhrases: [],
      orderPhrases: [],
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
