import { SourceColumn } from "./source_column";
import { ValueSet } from "./value_set";

export class SelectValueSet extends ValueSet implements SourceColumn {
  source: string;
  sourceColumnName: string;

  constructor({ source, sourceColumnName }: { source: string; sourceColumnName: string }) {
    super({ type: "select" });
    this.source = source;
    this.sourceColumnName = sourceColumnName;
  }
}
