import { Condition } from "./condition";

export class Filter {
  name: string;
  conditions: Condition[];

  constructor({ name, conditions }: { name: string; conditions: Condition[] }) {
    this.name = name;
    this.conditions = conditions;
  }
}
