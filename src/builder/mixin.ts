import { Condition } from "./condition/condition";
import { Join } from "./join/join";

export class Mixin {
  name: string;
  conditions: Condition[];
  joins: Join[];

  constructor({
    name,
    conditions = [],
    joins = [],
  }: {
    name: string;
    conditions?: Condition[];
    joins?: Join[];
  }) {
    this.name = name;
    this.conditions = conditions;
    this.joins = joins;
  }
}
