import { SourceColumn } from "./source_column";

// クラス名はlodashのインタフェースを参考にした
// TOOD: rawの場合とqueryの場合の対応が必要そう
// abstractにしたほうがいい
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
