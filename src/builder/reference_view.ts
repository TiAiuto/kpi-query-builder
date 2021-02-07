import { Condition } from "./condition";
import { FilterUsage } from "./filter_usage";
import { Join } from "./join";
import { Order } from "./order";
import { View, ViewArgs } from "./view";

export type ReferenceViewArgs = ViewArgs & {
  filterUsages?: FilterUsage[];
  conditions?: Condition[];
  joins?: Join[];
  orders?: Order[];
};

export abstract class ReferenceView extends View {
  filterUsages: FilterUsage[];
  conditions: Condition[];
  joins: Join[];
  orders: Order[];

  constructor({
    filterUsages,
    conditions,
    joins,
    orders,
    ...args
  }: ReferenceViewArgs & { type: string }) {
    super(args);
    this.filterUsages = filterUsages || [];
    this.conditions = conditions || [];
    this.joins = joins || [];
    this.orders = orders || [];
  }
}
