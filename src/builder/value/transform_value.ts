import { ViewResolutionContext } from "../view_resolution_context";
import { TransformPattern } from "../transform_pattern";
import { Value } from "./value";

export class TransformValue extends Value {
  value: Value;
  pattern: TransformPattern;

  constructor({
    value,
    pattern,
  }: { value: Value; pattern: TransformPattern }) {
    super({ type: "transform" });
    this.value = value;
    this.pattern = pattern;
  }

  toSQL(context: ViewResolutionContext): string {
    const valueSql = this.value.toSQL(context);
    if (this.pattern.name === "タイムスタンプ_月抽出") {
      return `FORMAT_TIMESTAMP('%Y-%m', ${valueSql}, 'Asia/Tokyo')`;
    } else if (this.pattern.name === "タイムスタンプ_週抽出") {
      return `CONCAT(FORMAT_TIMESTAMP('%Y-%m-%d', TIMESTAMP_TRUNC(${valueSql}, WEEK(MONDAY), 'Asia/Tokyo'), 'Asia/Tokyo'), ', ', FORMAT_TIMESTAMP('%Y-%m-%d', TIMESTAMP_ADD(TIMESTAMP_TRUNC(${valueSql}, WEEK(MONDAY), 'Asia/Tokyo'), INTERVAL 6 DAY), 'Asia/Tokyo'))`;
    } else if (this.pattern.name === "タイムスタンプ_日抽出") {
      return `FORMAT_TIMESTAMP('%Y-%m-%d', ${valueSql}, 'Asia/Tokyo')`;
    } else if (this.pattern.name === "空白変換") {
      return `IF(${valueSql} IS NULL OR ${valueSql} = '', '${this.pattern.args[0]}', ${valueSql})`; // TODO: 本当はこういうところエスケープしないといけない
    } else if (this.pattern.name === "変換_文字列") {
      return `CAST(${valueSql} AS STRING)`;
    } else {
      throw new Error(`${this.pattern.name}は未実装`);
    }
  }

  toSQLForRoot(context: ViewResolutionContext): string {
    throw new Error("Method not implemented.");
  }
}
