import { AggregatePattern } from "../aggregate_pattern";
import { SourceColumn } from "../source_column";
import { ViewResolutionContext } from "../view_resolution_context";
import { Value } from "./value";

export class AggregateValue extends Value {
  value: Value;
  pattern: AggregatePattern;

  constructor({
    value,
    pattern,
  }: { value: Value; pattern: AggregatePattern }) {
    super({ type: "transform" });
    this.value = value;
    this.pattern = pattern;
  }

  toSQL(context: ViewResolutionContext): string {
    const valueSql = this.value.toSQL(context);
    if (this.pattern.name === "COUNT") {
      return `COUNT(${valueSql})`;
    } else if (this.pattern.name === "COUNT_DISTINCT") {
      return `COUNT(DISTINCT ${valueSql})`;
    } else if (this.pattern.name === "MAX") {
      return `MAX(${valueSql})`;
    } else {
      throw new Error(`${this.pattern.name}は未実装`);
    }
  }

  toSQLForRoot(context: ViewResolutionContext): string {
    throw new Error("Method not implemented.");
  }
}
