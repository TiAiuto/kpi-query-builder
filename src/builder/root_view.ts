import { Condition } from "./condition";
import { FilterUsage } from "./filter_usage";
import { Join } from "./join/join";
import { RawResoledColumn } from "./raw_resolved_column";
import { RawValue } from "./raw_value";
import { ResolvedColumn } from "./resolved_column";
import { ResoledReference } from "./resolved_reference";
import { ResolvedView } from "./resolved_view";
import { View, ViewArgs } from "./view";
import { ViewResolver } from "./view_resolver";

export class RootView extends View {
  filterUsages: FilterUsage[];
  conditions: Condition[];
  joins: Join[];
  physicalSource: string;
  physicalSourceAlias: string;
  dateSuffixEnabled: boolean;

  constructor({
    filterUsages,
    conditions,
    joins,
    physicalSource,
    physicalSourceAlias,
    dateSuffixEnabled,
    ...args
  }: ViewArgs & {
    filterUsages?: FilterUsage[];
    conditions?: Condition[];
    joins?: Join[];
    physicalSource: string;
    physicalSourceAlias: string;
    dateSuffixEnabled: boolean;
  }) {
    super({
      ...args,
      type: "root",
    });
    this.filterUsages = filterUsages || [];
    this.conditions = conditions || [];
    this.joins = joins || [];
    this.physicalSource = physicalSource;
    this.physicalSourceAlias = physicalSourceAlias;
    this.dateSuffixEnabled = dateSuffixEnabled;
  }

  private buildResolvedColumns(): ResolvedColumn[] {
    return this.columns.map((column) => {
      if (column.value instanceof RawValue) {
        return new RawResoledColumn({
          publicName: column.name,
          physicalName: column.alphabetName,
          raw: column.value.toSQL()
        });
      } else {
        throw new Error('Raw Value以外のcolumn指定は未対応');
      }
    })
  }

  private buildResolvedReference(resolver: ViewResolver): ResoledReference {
    const jointConditions = [...this.conditions];
    const jointJoins = [...this.joins];
    this.filterUsages.forEach((filterUsage) => {
      const filter = resolver.findFilter(filterUsage.name);
      jointConditions.push(...filter.conditions);
      jointJoins.push(...filter.joins);
    });

    const joinPhrases = jointJoins.map((join) => join.toSQL(resolver));
    const conditionPhrases = jointConditions.map((condition) => condition.toSQL(resolver));

    return new ResoledReference({
      resolvedColumns: this.buildResolvedColumns(),
      physicalSource: this.physicalSource,
      physicalSourceAlias: this.physicalSourceAlias,
      joinPhrases,
      conditionPhrases,
      groupPhrases: [],
      orderPhrases: []
    });
  }

  resolve(resolver: ViewResolver): ResolvedView {
    const resolvedReference = this.buildResolvedReference(resolver);

    return new ResolvedView({
      publicName: this.name,
      physicalName: this.alphabetName,
      columns: resolvedReference.resolvedColumns,
      sql: resolvedReference.toSQL()
    });
  }
}
