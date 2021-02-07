import { SourceColumn } from "../source_column";
import { ValueSet } from "./value_set";

export class SelectValueSet extends ValueSet implements SourceColumn {
  source: string;
  sourceColumnName: string;

  constructor({ source, sourceColumnName }: Required<SourceColumn>) {
    super({ type: "select" });
    this.source = source;
    this.sourceColumnName = sourceColumnName;
  }
}
