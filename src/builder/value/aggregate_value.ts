import { AggregatePattern } from "../aggregate_pattern";
import { SourceColumn } from "../source_column";
import { ViewResolutionContext } from "../view_resolution_context";
import { Value } from "./value";

export class AggregateValue extends Value {
  source?: string;
  sourceColumnName: string;
  pattern: AggregatePattern;

  constructor({
    source,
    sourceColumnName,
    pattern,
  }: SourceColumn & { pattern: AggregatePattern }) {
    super({ type: "transform" });
    this.source = source;
    this.sourceColumnName = sourceColumnName;
    this.pattern = pattern;
  }

  toSQL(context: ViewResolutionContext): string {
    const resolvedColumn = context.findColumnByName(
      this.sourceColumnName,
      this.source
    );
    if (this.pattern.name === "COUNT") {
      return `COUNT(${resolvedColumn.fullPhysicalName})`;
    } else if (this.pattern.name === "COUNT_DISTINCT") {
      return `COUNT(DISTINCT ${resolvedColumn.fullPhysicalName})`;
    } else {
      throw new Error(`${this.pattern.name}は未実装`);
    }
  }

  toSQLForRoot(context: ViewResolutionContext): string {
    throw new Error("Method not implemented.");
  }
}
