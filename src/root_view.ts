import { Condition } from "./condition";
import { Filter } from "./filter";
import { Order } from "./order";
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
    orders,
    physicalSource,
    physicalSourceAlias,
    dateSuffixEnabled,
  }: {
    name: string;
    alphabetName: string;
    columns: ViewColumn[];
    filters?: Filter[];
    conditions?: Condition[];
    orders?: Order[];
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
      orders: orders || [],
    });
    this.physicalSource = physicalSource;
    this.physicalSourceAlias = physicalSourceAlias;
    this.dateSuffixEnabled = dateSuffixEnabled;
  }
}
