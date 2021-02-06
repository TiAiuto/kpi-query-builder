import { SourceColumn } from "./source_column";
import { TransformedColumn } from "./transformed_column";

export class ViewColumn implements TransformedColumn, SourceColumn {
  name: string;
  alphabetName: string;
  sourceColumnName: string;
  source?: string | null;

  constructor({
    name,
    alphabetName,
    sourceColumnName,
    source,
  }: {
    name: string;
    alphabetName: string;
    sourceColumnName: string;
    source?: string | null;
  }) {
    this.name = name;
    this.alphabetName = alphabetName;
    this.sourceColumnName = sourceColumnName;
    this.source = source;
  }
}
