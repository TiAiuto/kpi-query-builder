import { Group } from "./group";
import { SourceColumn } from "./source_column";
import { TransformedColumn } from "./transformed_column";

export class Aggregate implements SourceColumn {
  type: string;
  source?: string | null;
  sourceColumnName: string;
  output: TransformedColumn;
  groups: Group[];

  constructor({
    type,
    source,
    sourceColumnName,
    output,
    groups,
  }: {
    type: string;
    source?: string | null;
    sourceColumnName: string;
    output: TransformedColumn;
    groups: Group[];
  }) {
    this.type = type;
    this.source = source;
    this.sourceColumnName = sourceColumnName;
    this.output = output;
    this.groups = groups;
  }
}
