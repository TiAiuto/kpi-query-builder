import { SourceColumn } from "./source_column";

export class SelectValue extends Value implements SourceColumn {
  source?: string;
  sourceColumnName: string;

  constructor({ source, sourceColumnName }: SourceColumn) {
    super({ type: "select" });
    this.source = source;
    this.sourceColumnName = sourceColumnName;
  }
}
