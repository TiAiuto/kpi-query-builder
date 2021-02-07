import { Condition } from "./condition";
import { Join } from "./join";
import { ViewResolver } from "./view_resolver";

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

  toSQL(resolver: ViewResolver): string {
    throw new Error("Method not implemented.");
  }
}
