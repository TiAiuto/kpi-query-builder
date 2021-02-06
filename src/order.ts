import { SourceColumn } from "./source_column";

// クラス名はlodashのインタフェースを参考にした
export class Order implements SourceColumn {
  source?: string | null;
  sourceColumnName: string;
  sortOrder: string;

  constructor({
    source,
    sourceColumnName,
    sortOrder,
  }: {
    source?: string | null;
    sourceColumnName: string;
    sortOrder?: string | null;
  }) {
    this.source = source;
    this.sourceColumnName = sourceColumnName;
    this.sortOrder = sortOrder || "asc";
  }
}
