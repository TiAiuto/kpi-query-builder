import { Group } from "./group";
import { TransformedColumn } from "./transformed_column";

export class Aggregate {
  type: string;
  source?: string | null;
  columnName: string;
  output: TransformedColumn;
  groups: Group[];

  constructor({
    type,
    source,
    columnName,
    output,
    groups,
  }: {
    type: string;
    source?: string | null;
    columnName: string;
    output: TransformedColumn;
    groups: Group[];
  }) {
    this.type = type;
    this.source = source;
    this.columnName = columnName;
    this.output = output;
    this.groups = groups;
  }
}
