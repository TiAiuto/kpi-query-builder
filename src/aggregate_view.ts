import { Aggregate } from "./aggregate";
import { View, ViewArgs } from "./view";

export class AggregateView extends View {
  aggregates: Aggregate[];

  constructor({
    aggregates,
    ...args
  }: Exclude<ViewArgs, "orders"> & { aggregates: Aggregate[] }) {
    super({
      ...args,
      type: "aggregate",
    });
    this.aggregates = aggregates;
  }
}
