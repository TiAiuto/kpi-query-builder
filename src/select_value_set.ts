import { ValueSet } from "./value_set";

export class SelectValueSet extends ValueSet {
  source: string;
  columnName: string;

  constructor({ source, columnName }: { source: string; columnName: string }) {
    super({ type: "select" });
    this.source = source;
    this.columnName = columnName;
  }
}
