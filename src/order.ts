// クラス名はlodashのインタフェースを参考にした
export class Order {
  source?: string | null;
  columnName: string;
  sortOrder: string;

  constructor({
    source,
    columnName,
    sortOrder,
  }: {
    source?: string | null;
    columnName: string;
    sortOrder?: string | null;
  }) {
    this.source = source;
    this.columnName = columnName;
    this.sortOrder = sortOrder || "asc";
  }
}
