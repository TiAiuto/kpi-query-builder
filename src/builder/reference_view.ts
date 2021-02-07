import { Condition } from "./condition";
import { FilterUsage } from "./filter_usage";
import { Join } from "./join/join";
import { Order } from "./order";
import { TransformedValue } from "./transformed_value";
import { View, ViewArgs } from "./view";

export type ReferenceViewArgs = Omit<ViewArgs, 'columns'> & {
  source: string;
  columns?: TransformedValue[],
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

  constructor({
    columns,
    source,
    filterUsages,
    conditions,
    joins,
    orders,
    ...args
  }: ReferenceViewArgs & { type: string }) {
    super({ ...args, columns: columns || [] });
    this.source = source;
    this.filterUsages = filterUsages || [];
    this.conditions = conditions || [];
    this.joins = joins || [];
    this.orders = orders || [];
  }
}
