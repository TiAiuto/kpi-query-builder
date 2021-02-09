import { Condition } from "../condition/condition";
import { ExtractedColumn } from "../extracted_column";
import { FilterUsage } from "../filter_usage";
import { Join } from "../join/join";
import { ResolvedReference } from "../resolved_reference";
import { ResolvedView } from "../resolved_view";
import { RawValue } from "../value/raw_value";
import { ValueSurface } from "../value_surface";
import { ViewResolver } from "../view_resolver";
import { View, ViewArgs } from "./view";

export class RootView extends View {
  filterUsages: FilterUsage[];
  conditions: Condition[];
  joins: Join[];
  physicalSource: string;
  physicalSourceAlias: string;
  dateSuffixEnabled: boolean;
  columns: ValueSurface[];

  constructor({
    filterUsages,
    conditions,
    joins,
    physicalSource,
    physicalSourceAlias,
    dateSuffixEnabled,
    columns,
    ...args
  }: ViewArgs & {
    filterUsages?: FilterUsage[];
    conditions?: Condition[];
    joins?: Join[];
    physicalSource: string;
    physicalSourceAlias: string;
    dateSuffixEnabled: boolean;
    columns: ValueSurface[];
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
    this.columns = columns;
  }

  private buildColumns(): ExtractedColumn[] {
    return this.columns.map((column) => {
      if (column.value instanceof RawValue) {
        return new ExtractedColumn({
          publicName: column.name,
          physicalName: column.alphabetName,
          selectSQL: column.value.toSQL(), // RawValueはselectを想定しているがWHEREなどでも動くはず
        });
      } else {
        throw new Error("Raw Value以外のcolumn指定は未対応");
      }
    });
  }

  private buildResolvedReference(resolver: ViewResolver): ResolvedReference {
    const jointConditions = [...this.conditions];
    const jointJoins = [...this.joins];
    this.filterUsages.forEach((filterUsage) => {
      const filter = resolver.findFilter(filterUsage.name);
      jointConditions.push(...filter.conditions);
      jointJoins.push(...filter.joins);
    });

    // rootではraw以外のjoin, conditionは使わない想定
    const joinPhrases = jointJoins.map((join) => join.toSQLForRoot());
    const conditionPhrases = jointConditions.map((condition) =>
      condition.toSQLForRoot()
    );

    return new ResolvedReference({
      columns: this.buildColumns(),
      physicalSource: this.physicalSource,
      physicalSourceAlias: this.physicalSourceAlias,
      joinPhrases,
      conditionPhrases,
      groupPhrases: [],
      orderPhrases: [],
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
