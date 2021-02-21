import { Value } from "../value/value";
import { ViewResolutionContext } from "../view_resolution_context";
import {
  BinominalCondition,
  BinominalConditionArgs,
} from "./binominal_condition";

export class EqCondition extends BinominalCondition {
  constructor(args: BinominalConditionArgs) {
    super({ ...args, type: "eq" });
  }

  toSQL(context: ViewResolutionContext): string {
    return `${this.value.toSQL(context)} = ${this.otherValue.toSQL(context)}`;
  }

  toSQLForRoot(): string {
    throw new Error("Method not implemented.");
  }
}
