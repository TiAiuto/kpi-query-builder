import { Condition } from "./condition/condition";
import { Join } from "./join/join";
import { ValueSurface } from "./value_surface";

export class Mixin {
  name: string;
  conditions: Condition[];
  joins: Join[];
  columns: ValueSurface[];

  constructor({
    name,
    conditions = [],
    joins = [],
    columns = [],
  }: {
    name: string;
    conditions?: Condition[];
    joins?: Join[];
    columns?: ValueSurface[];
  }) {
    this.name = name;
    this.conditions = conditions;
    this.joins = joins;
    this.columns = columns;
  }
}
