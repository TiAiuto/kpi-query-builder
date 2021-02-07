import { Condition } from "../condition/condition";
import { Join } from "./join";
import { ViewResolver } from "../view_resolver";

export type OrdinaryJoinArgs = {
  target: string;
  conditions: Condition[];
};

export abstract class OrdinaryJoin extends Join {
  target: string;
  conditions: Condition[];

  constructor({
    type,
    target,
    conditions,
  }: OrdinaryJoinArgs & {
    type: string;
  }) {
    super({ type });
    this.target = target;
    this.conditions = conditions;
  }

  toSQL(resolver: ViewResolver): string {
    throw new Error("Method not implemented.");
  }

  toSQLForRoot(resolver: ViewResolver): string {
    throw new Error("Method not implemented.");
  }
}
