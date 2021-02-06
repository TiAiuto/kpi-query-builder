import { Condition } from "./condition";
import { Filter } from "./filter";
import { ViewColumn } from "./view_column";

export abstract class View {
  type: string;
  name: string;
  alphabetName: string;
  columns: ViewColumn[];
  filters: Filter[];
  conditions: Condition[];

  constructor({
    type,
    name,
    alphabetName,
    columns,
    filters,
    conditions,
  }: {
    type: string;
    name: string;
    alphabetName: string;
    columns: ViewColumn[];
    filters: Filter[];
    conditions: Condition[];
  }) {
    this.type = type;
    this.name = name;
    this.alphabetName = alphabetName;
    this.columns = columns;
    this.filters = filters;
    this.conditions = conditions;
  }
}
