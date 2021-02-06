import { Condition } from "./condition";
import { Filter } from "./filter";
import { Order } from "./order";
import { ViewColumn } from "./view_column";

export abstract class View {
  type: string;
  name: string;
  alphabetName: string;
  columns: ViewColumn[];
  filters: Filter[];
  conditions: Condition[];
  orders: Order[];

  constructor({
    type,
    name,
    alphabetName,
    columns,
    filters,
    conditions,
    orders
  }: {
    type: string;
    name: string;
    alphabetName: string;
    columns: ViewColumn[];
    filters: Filter[];
    conditions: Condition[];
    orders: Order[];
  }) {
    this.type = type;
    this.name = name;
    this.alphabetName = alphabetName;
    this.columns = columns;
    this.filters = filters;
    this.conditions = conditions;
    this.orders = orders;
  }
}
