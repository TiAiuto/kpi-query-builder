import { Condition } from "./condition";
import { ValueSet } from "../value_set/value_set";
import { ViewResolutionContext } from "../view_resolution_context";
import { Value } from "../value/value";

export class InCondition extends Condition {
  value: Value;
  inValueSet: ValueSet;

  constructor({ value, inValueSet }: { value: Value; inValueSet: ValueSet }) {
    super({ type: "in" });
    this.value = value;
    this.inValueSet = inValueSet;
  }

  toSQL(context: ViewResolutionContext): string {
    return `${this.value.toSQL(context)} IN ( ${this.inValueSet.toSQL(
      context
    )} )`;
  }

  toSQLForRoot(): string {
    throw new Error("Method not implemented.");
  }
}
