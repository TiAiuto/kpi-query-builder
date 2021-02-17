import {Condition} from './condition/condition';

export class ActionReportViewActionReference {
    actionName: string;
    conditions: Condition[];

    constructor({actionName, conditions}: { actionName: string; conditions: Condition[]; }) {
        this.actionName = actionName;
        this.conditions = conditions;
    }
}
