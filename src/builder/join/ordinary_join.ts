import { Condition } from "../condition/condition";
import { Join } from "./join";
import { ViewResolutionContext } from "../view_resolution_context";

export type OrdinaryJoinArgs = {
  target: string;
  conditions: Condition[];
  publicNameAlias?: string;
  physicalNameAlias?: string;
};

export abstract class OrdinaryJoin extends Join {
  target: string;
  conditions: Condition[];
  publicNameAlias?: string;
  physicalNameAlias?: string;

  constructor({
    type,
    target,
    conditions,
    publicNameAlias,
    physicalNameAlias,
  }: OrdinaryJoinArgs & {
    type: string;
  }) {
    super({ type });
    this.target = target;
    this.conditions = conditions;
    this.publicNameAlias = publicNameAlias;
    this.physicalNameAlias = physicalNameAlias;
  }

  private generateConditionPhrases(context: ViewResolutionContext): string[] {
    return this.conditions.map((condition) => condition.toSQL(context));
  }

  protected buildJoinPhrase(context: ViewResolutionContext): string {
    const view = context.resolver.resolve(this.target);
    return `JOIN ${view.physicalName} ${
      this.physicalNameAlias || ""
    } \n ON ${this.generateConditionPhrases(context).join(" AND \n ")} `;
  }
}
