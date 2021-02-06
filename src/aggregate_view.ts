import { Aggregate } from "./aggregate";
import { ReferenceView, ReferenceViewArgs } from "./reference_view";

export class AggregateView extends ReferenceView {
  aggregates: Aggregate[];

  constructor({
    aggregates,
    ...args
  }: Exclude<ReferenceViewArgs, "orders"> & { aggregates: Aggregate[] }) {
    super({
      ...args,
      type: "aggregate",
      orders: [],
    });
    this.aggregates = aggregates;
  }
}
