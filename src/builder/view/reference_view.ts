import { Condition } from "../condition/condition";
import { Join } from "../join/join";
import { MixinUsage } from "../mixin_usage";
import { Order } from "../order";
import { ValueSurface } from "../value_surface";
import { View, ViewArgs } from "./view";

export type ReferenceViewArgs = Omit<ViewArgs, "columns"> & {
  source: string;
  columns?: ValueSurface[];
  mixinUsages?: MixinUsage[];
  conditions?: Condition[];
  joins?: Join[];
  orders?: Order[];
};

export abstract class ReferenceView extends View {
  source: string;
  mixinUsages: MixinUsage[];
  conditions: Condition[];
  joins: Join[];
  orders: Order[];
  columns: ValueSurface[];

  constructor({
    columns,
    source,
    mixinUsages,
    conditions,
    joins,
    orders,
    ...args
  }: ReferenceViewArgs & { type: string }) {
    super(args);
    this.source = source;
    this.mixinUsages = mixinUsages || [];
    this.conditions = conditions || [];
    this.joins = joins || [];
    this.orders = orders || [];
    this.columns = columns || [];
  }
}
