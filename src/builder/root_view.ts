import { ReferenceView, ReferenceViewArgs } from "./reference_view";

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
}
