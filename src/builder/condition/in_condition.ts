import { Condition } from "./condition";
import { ValueSet } from "../value_set/value_set";
import { SourceColumn } from "../source_column";
import { ViewResolutionContext } from "../view_resolution_context";

export class InCondition extends Condition implements SourceColumn {
  source?: string;
  sourceColumnName: string;
  valueSet: ValueSet;

  constructor({
    source, 
    sourceColumnName, 
    valueSet,
  }: {
    valueSet: ValueSet;
    source?: string;
    sourceColumnName: string;
  }) {
    super({ type: "in" });
    this.source = source;
    this.sourceColumnName = sourceColumnName;
    this.valueSet = valueSet;
  }

  toSQL(context: ViewResolutionContext): string {
    const column = context.findColumnByName(this.sourceColumnName, this.source);
    return `${column.toValueSQL()} IN ( ${this.valueSet.toSQL(context)} )`;
  }

  toSQLForRoot(): string {
    throw new Error("Method not implemented.");
  }
}
