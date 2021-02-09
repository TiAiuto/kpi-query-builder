import { AggregatePattern } from "./aggregate_pattern";
import { Group } from "./group";
import { SourceColumn } from "./source_column";

export class Aggregate implements SourceColumn {
  pattern: AggregatePattern;
  source?: string;
  sourceColumnName: string;
  groups: Group[];

  constructor({
    pattern,
    source,
    sourceColumnName,
    groups,
  }: SourceColumn & {
    pattern: AggregatePattern;
    groups: Group[];
  }) {
    this.pattern = pattern;
    this.source = source;
    this.sourceColumnName = sourceColumnName;
    this.groups = groups;
  }
}
