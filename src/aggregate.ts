import { AggregatePattern } from "./aggregate_pattern";
import { Group } from "./group";
import { SourceColumn } from "./source_column";
import { TransformedColumn } from "./transformed_column";

export class Aggregate implements SourceColumn {
  pattern: AggregatePattern;
  source?: string;
  sourceColumnName: string;
  output: TransformedColumn;
  groups: Group[];

  constructor({
    pattern,
    source,
    sourceColumnName,
    output,
    groups,
  }: SourceColumn & {
    pattern: AggregatePattern;
    output: TransformedColumn;
    groups: Group[];
  }) {
    this.pattern = pattern;
    this.source = source;
    this.sourceColumnName = sourceColumnName;
    this.output = output;
    this.groups = groups;
  }
}
