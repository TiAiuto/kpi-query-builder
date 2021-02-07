import { Condition } from "../condition/condition";
import { OrdinaryJoin, OrdinaryJoinArgs } from "./ordinary_join";

export class InnerJoin extends OrdinaryJoin {
  constructor(args: OrdinaryJoinArgs) {
    super({ ...args, type: "inner" });
  }
}
