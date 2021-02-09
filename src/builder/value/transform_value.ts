import { SourceColumn } from "../source_column";
import { ValueSurface } from "../value_surface";
import { TransformPattern } from "../transform_pattern";
import { Value } from "./value";

export class TransformValue extends Value implements SourceColumn {
  source?: string;
  sourceColumnName: string;
  output: ValueSurface;
  pattern: TransformPattern;

  constructor({
    source,
    sourceColumnName,
    output,
    pattern,
  }: SourceColumn & { output: ValueSurface; pattern: TransformPattern }) {
    super({ type: "transform" });
    this.source = source;
    this.sourceColumnName = sourceColumnName;
    this.output = output;
    this.pattern = pattern;
  }

  toSQL(): string {
    throw new Error("Method not implemented.");
  }
}
