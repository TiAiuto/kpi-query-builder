import { Mixin } from "./mixin";
import { ResolvedView } from "./resolved_view";
import { View } from "./view/view";

export class ViewResolver {
  resolvedViews: ResolvedView[];
  private views: View[];
  private mixins: Mixin[];

  constructor({ views, mixins }: { views: View[]; mixins: Mixin[] }) {
    this.views = views;
    this.mixins = mixins;
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

  findMixin(name: string): Mixin {
    const mixin = this.mixins.find((item) => item.name === name);
    if (mixin) {
      return mixin;
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

  addView(view: View): void {
    this.views.push(view);
  }
}
