import { ViewResolutionContext } from "../view_resolution_context";
import { BinomialCondition, BinomialConditionArgs } from "./binomial_condition";

export class EqCondition extends BinomialCondition {
  constructor(args: BinomialConditionArgs) {
    super({ ...args, template: "? = ?" });
  }

  toSQL(context: ViewResolutionContext): string {
    return `${this.value.toSQL(context)} = ${this.otherValue.toSQL(context)}`;
  }

  toSQLForRoot(): string {
    throw new Error("Method not implemented.");
  }
}
