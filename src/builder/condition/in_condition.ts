import { Condition } from "./condition";
import { ViewResolver } from "../view_resolver";
import { ValueSet } from "../value_set/value_set";

export class InCondition extends Condition {
  valueSet: ValueSet;

  constructor({ valueSet }: { valueSet: ValueSet }) {
    super({ type: "in" });
    this.valueSet = valueSet;
  }

  toSQL(resolver: ViewResolver): string {
    throw new Error("Method not implemented.");
  }
}
