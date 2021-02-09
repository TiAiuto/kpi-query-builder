import { Condition } from "../condition/condition";
import { FilterUsage } from "../filter_usage";
import { Join } from "../join/join";
import { Order } from "../order";
import { ValueSurface } from "../value_surface";
import { View, ViewArgs } from "./view";

export type ReferenceViewArgs = Omit<ViewArgs, "columns"> & {
  source: string;
  columns?: ValueSurface[];
  filterUsages?: FilterUsage[];
  conditions?: Condition[];
  joins?: Join[];
  orders?: Order[];
};

export abstract class ReferenceView extends View {
  source: string;
  filterUsages: FilterUsage[];
  conditions: Condition[];
  joins: Join[];
  orders: Order[];
  columns: ValueSurface[];

  constructor({
    columns,
    source,
    filterUsages,
    conditions,
    joins,
    orders,
    ...args
  }: ReferenceViewArgs & { type: string }) {
    super(args);
    this.source = source;
    this.filterUsages = filterUsages || [];
    this.conditions = conditions || [];
    this.joins = joins || [];
    this.orders = orders || [];
    this.columns = columns || [];
  }
}
