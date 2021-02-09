export class ExtractedColumn {
  selectSQL: string;

  constructor({
    selectSQL,
  }: {
    selectSQL: string;
  }) {
    this.selectSQL = selectSQL;
  }
}
