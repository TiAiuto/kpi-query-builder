import { Filter } from "./filter";
import { ResolvedView } from "./resolved_view";
import { View } from "./view";

export class ViewResolver {
  resolvedViews: ResolvedView[];
  private views: View[];
  private filters: Filter[];

  constructor({ views, filters }: { views: View[]; filters: Filter[] }) {
    this.views = views;
    this.filters = filters;
    this.resolvedViews = [];
  }

  resolve(name: string): ResolvedView {
    const alreadyResolved = this.resolvedViews.find(
      (item) => item.publicName === name
    );
    if (alreadyResolved) {
      return alreadyResolved;
    }

    const view = this.findView(name);
    const resolvedView = view.resolve(this);
    this.resolvedViews.push(resolvedView);
    return resolvedView;
  }

  findFilter(name: string): Filter {
    const filter = this.filters.find((item) => item.name === name);
    if (filter) {
      return filter;
    }

    throw new Error(`${name}は未定義`);
  }

  findView(name: string): View {
    const view = this.views.find((item) => item.name === name);
    if (view) {
      return view;
    }

    throw new Error(`${name}は未定義`);
  }
}
