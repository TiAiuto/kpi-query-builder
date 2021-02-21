import { ViewResolutionContext } from "../view_resolution_context";
import { OrdinaryJoin, OrdinaryJoinArgs } from "./ordinary_join";

export class LeftJoin extends OrdinaryJoin {
  constructor(args: OrdinaryJoinArgs) {
    super({ ...args, type: "left" });
  }

  toSQL(context: ViewResolutionContext): string {
    return `LEFT JOIN ${
      context.resolver.findView(this.target).alphabetName
    } \n ON ${this.generateConditionPhrases(context).join(" AND \n ")} `;
  }

  toSQLForRoot(): string {
    throw new Error("Method not implemented.");
  }
}
