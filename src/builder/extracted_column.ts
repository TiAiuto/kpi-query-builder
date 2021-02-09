import { PublicColumnInterface } from "./public_column_interface";

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
}
