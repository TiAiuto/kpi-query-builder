import { Condition } from "./condition";
import { Join } from "./join";

export class InnerJoin extends Join {
  target: string;
  conditions: Condition[];

  constructor({
    target,
    conditions,
  }: {
    target: string;
    conditions: Condition[];
  }) {
    super({ type: "inner" });
    this.target = target;
    this.conditions = conditions;
  }
}
