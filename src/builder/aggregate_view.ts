import { Aggregate } from "./aggregate";
import { ReferenceView, ReferenceViewArgs } from "./reference_view";
import { ResolvedView } from "./resolved_view";
import { ViewResolver } from "./view_resolver";

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

  resolve(resolver: ViewResolver): ResolvedView {
    throw new Error("Method not implemented.");
  }
}
