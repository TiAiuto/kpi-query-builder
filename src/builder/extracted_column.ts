import { PublicColumnInterface } from "./public_column_interface";
import { ResolvedColumn } from "./resolved_column";
import { ResolvedView } from "./resolved_view";

export class ExtractedColumn implements PublicColumnInterface {
  selectSQL: string;
  publicName: string;
  physicalName: string;

  constructor({
    selectSQL,
    publicName,
    physicalName,
  }: {
    selectSQL: string;
    publicName: string;
    physicalName: string;
  }) {
    this.selectSQL = selectSQL;
    this.publicName = publicName;
    this.physicalName = physicalName;
  }

  toResolvedColumn(resolvedView: ResolvedView): ResolvedColumn {
    return new ResolvedColumn({
      publicName: this.publicName,
      physicalName: this.physicalName,
      resolvedView,
    });
  }
}
