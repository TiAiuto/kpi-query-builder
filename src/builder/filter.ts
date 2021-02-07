import { Condition } from "./condition";
import { Join } from "./join";

export class Filter {
  name: string;
  conditions: Condition[];
  joins: Join[];

  constructor({ name, conditions, joins }: { name: string; conditions: Condition[]; joins: Join[] }) {
    this.name = name;
    this.conditions = conditions;
    this.joins = joins;
  }
}
