import { RawCondition } from "./raw_condition";
import { RawJoin } from "./raw_join";
import { RawResoledColumn } from "./raw_resolved_column";
import { ReferenceView, ReferenceViewArgs } from "./reference_view";
import { ResolvedColumn } from "./resolved_column";
import { ResoledReference } from "./resolved_reference";
import { ResolvedView } from "./resolved_view";
import { SelectValue } from "./select_value";
import { ViewResolver } from "./view_resolver";

export class RootView extends ReferenceView {
  physicalSource: string;
  physicalSourceAlias: string;
  dateSuffixEnabled: boolean;

  constructor({
    physicalSource,
    physicalSourceAlias,
    dateSuffixEnabled,
    ...args
  }: Exclude<ReferenceViewArgs, "orders"> & {
    physicalSource: string;
    physicalSourceAlias: string;
    dateSuffixEnabled: boolean;
  }) {
    super({
      ...args,
      type: "root",
      orders: [], // root viewに並び順を指定する用途は想定していない
    });
    this.physicalSource = physicalSource;
    this.physicalSourceAlias = physicalSourceAlias;
    this.dateSuffixEnabled = dateSuffixEnabled;
  }

  resolve(resolver: ViewResolver): ResolvedView {
    const jointConditions = [...this.conditions];
    const jointJoins = [...this.joins];
    this.filters.forEach((filter) => {
      jointConditions.push(...filter.conditions);
      jointJoins.push(...filter.joins);
    });

    const resolvedColumns = this.columns.map((column) => {
      if (column.value instanceof SelectValue) {
        return new RawResoledColumn({
          publicName: column.name, 
          physicalName: column.alphabetName, 
          raw: column.value.toSQL()
        });  
      } else {
        throw new Error('Select Value以外のcolumn指定は未対応');
      }
    });

    const joinPhrases = jointJoins.map((join) => {
      if (join instanceof RawJoin) {
        return join.raw;
      } else {
        throw new Error('Root Viewではraw以外のJoinは未対応');
      }
    });

    const conditionPhrases = jointConditions.map((condition) => {
      if (condition instanceof RawCondition) {
        return condition.raw;
      } else {
        throw new Error('Root Viewではraw以外のConditionは未対応');
      }
    });

    if (this.orders) {
      throw new Error('Root Viewではordersは未対応');
    }

    const resolvedReference = new ResoledReference({
      resolvedColumns: resolvedColumns, 
      physicalSource: this.physicalSource, 
      physicalSourceAlias: this.physicalSourceAlias, 
      joinPhrases, 
      conditionPhrases, 
      groupPhrases: [],
      orderPhrases: []
    });

    return new ResolvedView({
      publicName: this.name,
      physicalName: this.alphabetName,
      columns: resolvedColumns,
      sql: resolvedReference.toSQL()
    });
  }
}
