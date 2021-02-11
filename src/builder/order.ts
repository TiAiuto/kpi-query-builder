import { PhraseResolutionContext } from "./phrase_resolution_context";
import { Value } from "./value/value";

// クラス名はlodashのインタフェースを参考にした
export class Order {
  value: Value;
  sortOrder: string;

  constructor({
    value,
    sortOrder = 'asc',
  }: {
    value: Value,
    sortOrder?: string;
  }) {
    this.value = value;
    this.sortOrder = sortOrder;
  }

  toSQL(context: PhraseResolutionContext): string {
    return `${this.value.toSQL(context)} ${this.sortOrder}`;
  }
}
