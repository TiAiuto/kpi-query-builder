import { SourceColumn } from "./source_column";

// クラス名はlodashのインタフェースを参考にした
export class Order implements SourceColumn {
  source?: string;
  sourceColumnName: string;
  sortOrder: string;

  constructor({
    source,
    sourceColumnName,
    sortOrder,
  }: SourceColumn & {
    sortOrder?: string;
  }) {
    this.source = source;
    this.sourceColumnName = sourceColumnName;
    this.sortOrder = sortOrder || "asc";
  }
}
