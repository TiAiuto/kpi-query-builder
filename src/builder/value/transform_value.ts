import { SourceColumn } from "../source_column";
import { TransformPattern } from "../transform_pattern";
import { Value } from "./value";

export class TransformValue extends Value implements SourceColumn {
  source?: string;
  sourceColumnName: string;
  pattern: TransformPattern;

  constructor({
    source,
    sourceColumnName,
    pattern,
  }: SourceColumn & { pattern: TransformPattern }) {
    super({ type: "transform" });
    this.source = source;
    this.sourceColumnName = sourceColumnName;
    this.pattern = pattern;
  }

  toSQL(): string {
    throw new Error("Method not implemented.");
  }
}
