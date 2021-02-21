import { Condition } from "./condition/condition";

export class ActionReportViewActionReference {
  actionName: string;
  actionNameAlias?: string;
  conditions: Condition[];

  constructor({
    actionName,
    actionNameAlias,
    conditions = [],
  }: {
    actionName: string;
    actionNameAlias?: string;
    conditions?: Condition[];
  }) {
    this.actionName = actionName;
    this.actionNameAlias = actionNameAlias;
    this.conditions = conditions;
  }
}
