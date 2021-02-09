export class ExtractedColumn {
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
