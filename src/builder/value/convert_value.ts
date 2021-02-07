import { SourceColumn } from "../source_column";
import { ValueWrapper } from "../value_wrapper";
import { TransformPattern } from "../transform_pattern";
import { Value } from "./value";

export class ConvertValue extends Value implements SourceColumn {
  source?: string;
  sourceColumnName: string;
  output: ValueWrapper;
  pattern: TransformPattern;

  constructor({
    source,
    sourceColumnName,
    output,
    pattern,
  }: SourceColumn & { output: ValueWrapper; pattern: TransformPattern }) {
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
