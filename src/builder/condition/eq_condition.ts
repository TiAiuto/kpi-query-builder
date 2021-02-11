import { Value } from "../value/value";
import { ViewResolutionContext } from "../view_resolution_context";
import { Condition } from "./condition";

export class EqCondition extends Condition {
  value: Value;
  otherValue: Value;

  constructor({ value, otherValue }: { value: Value; otherValue: Value }) {
    super({ type: "eq" });

    this.value = value;
    this.otherValue = otherValue;
  }

  toSQL(context: ViewResolutionContext): string {
    return `${this.value.toSQL(context)} = ${this.otherValue.toSQL(context)}`;
  }

  toSQLForRoot(): string {
    throw new Error("Method not implemented.");
  }
}
