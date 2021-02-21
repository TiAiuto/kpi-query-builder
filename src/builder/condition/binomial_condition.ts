import { Value } from "../value/value";
import { ViewResolutionContext } from "../view_resolution_context";
import { Condition } from "./condition";

export type BinomialConditionArgs = {
  value: Value;
  otherValue: Value;
};

export class BinomialCondition extends Condition {
  template: string;
  value: Value;
  otherValue: Value;

  constructor({
    template,
    value,
    otherValue,
  }: BinomialConditionArgs & { template: string }) {
    super({ type: "binominal" });

    this.template = template;
    this.value = value;
    this.otherValue = otherValue;
  }

  toSQL(context: ViewResolutionContext): string {
    return this.template
      .replace("?", this.value.toSQL(context))
      .replace("?", this.otherValue.toSQL(context));
  }

  toSQLForRoot(): string {
    throw new Error("Method not implemented.");
  }
}
