import { Condition } from "./condition";
import { Filter } from "./filter";
import { Join } from "./join";
import { View } from "./view";
import { ViewColumn } from "./view_column";

export class RootView extends View {
  physicalSource: string;
  physicalSourceAlias: string;
  dateSuffixEnabled: boolean;

  constructor({
    name,
    alphabetName,
    columns,
    filters,
    conditions,
    joins,
    physicalSource,
    physicalSourceAlias,
    dateSuffixEnabled,
  }: {
    name: string;
    alphabetName: string;
    columns: ViewColumn[];
    filters?: Filter[];
    conditions?: Condition[];
    joins?: Join[];
    physicalSource: string;
    physicalSourceAlias: string;
    dateSuffixEnabled: boolean;
  }) {
    super({
      type: "root",
      name,
      alphabetName,
      columns,
      filters: filters || [],
      conditions: conditions || [],
      joins: joins || [],
      orders: [], // root viewに並び順を指定する用途は想定していない
    });
    this.physicalSource = physicalSource;
    this.physicalSourceAlias = physicalSourceAlias;
    this.dateSuffixEnabled = dateSuffixEnabled;
  }
}
