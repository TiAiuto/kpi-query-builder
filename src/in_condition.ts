import { Condition } from "./condition";

export class InCondition extends Condition {
  constructor() {
    super({ type: "in" });
  }
}
