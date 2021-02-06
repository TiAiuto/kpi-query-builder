import { Condition } from "./condition";
import { Filter } from "./filter";
import { Join } from "./join";
import { Order } from "./order";
import { ViewColumn } from "./view_column";

export abstract class View {
  type: string;
  name: string;
  alphabetName: string;
  columns: ViewColumn[];
  filters: Filter[];
  conditions: Condition[];
  joins: Join[];
  orders: Order[];

  constructor({
    type,
    name,
    alphabetName,
    columns,
    filters,
    conditions,
    joins,
    orders,
  }: {
    type: string;
    name: string;
    alphabetName: string;
    columns: ViewColumn[];
    filters: Filter[];
    conditions: Condition[];
    joins: Join[];
    orders: Order[];
  }) {
    this.type = type;
    this.name = name;
    this.alphabetName = alphabetName;
    this.columns = columns;
    this.filters = filters;
    this.conditions = conditions;
    this.joins = joins;
    this.orders = orders;
  }
}
