import { Condition } from "./condition";
import { Filter } from "./filter";
import { Join } from "./join";
import { Order } from "./order";
import { View, ViewArgs } from "./view";

export type ReferenceViewArgs = ViewArgs & {
  filters?: Filter[];
  conditions?: Condition[];
  joins?: Join[];
  orders?: Order[];
};

export abstract class ReferenceView extends View {
  filters: Filter[];
  conditions: Condition[];
  joins: Join[];
  orders: Order[];

  constructor({
    filters,
    conditions,
    joins,
    orders,
    ...args
  }: ReferenceViewArgs & { type: string }) {
    super(args);
    this.filters = filters || [];
    this.conditions = conditions || [];
    this.joins = joins || [];
    this.orders = orders || [];
  }
}
