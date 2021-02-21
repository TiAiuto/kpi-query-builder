import { Value } from "../value/value";
import { Condition } from "./condition";

export type BinominalConditionArgs = {
  value: Value;
  otherValue: Value;
};

export abstract class BinominalCondition extends Condition {
  value: Value;
  otherValue: Value;

  constructor({
    value,
    otherValue,
    type,
  }: BinominalConditionArgs & { type: string }) {
    super({ type });

    this.value = value;
    this.otherValue = otherValue;
  }
}
