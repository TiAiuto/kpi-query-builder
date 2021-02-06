import { Condition } from "./condition";
import { Filter } from "./filter";
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
    physicalSource,
    physicalSourceAlias,
    dateSuffixEnabled,
  }: {
    name: string;
    alphabetName: string;
    columns: ViewColumn[];
    filters?: Filter[];
    conditions?: Condition[];
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
    });
    this.physicalSource = physicalSource;
    this.physicalSourceAlias = physicalSourceAlias;
    this.dateSuffixEnabled = dateSuffixEnabled;
  }
}
