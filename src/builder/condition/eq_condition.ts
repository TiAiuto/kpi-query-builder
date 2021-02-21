import { BinomialCondition, BinomialConditionArgs } from "./binomial_condition";

export class EqCondition extends BinomialCondition {
  constructor(args: BinomialConditionArgs) {
    super({ ...args, template: "? = ?" });
  }
}
