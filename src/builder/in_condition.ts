import { Condition } from "./condition";
import { ValueSet } from "./value_set";

export class InCondition extends Condition {
  valueSet: ValueSet;

  constructor({ valueSet }: { valueSet: ValueSet }) {
    super({ type: "in" });
    this.valueSet = valueSet;
  }
}
