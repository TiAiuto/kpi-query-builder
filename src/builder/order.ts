import { Value } from "./value/value";

// クラス名はlodashのインタフェースを参考にした
export class Order {
  value: Value;
  sortOrder: string;

  constructor({
    value,
    sortOrder,
  }: {
    value: Value,
    sortOrder?: string;
  }) {
    this.value = value;
    this.sortOrder = sortOrder || "asc";
  }
}
