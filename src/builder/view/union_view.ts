import { ResolvedView } from "../resolved_view";
import { ViewResolver } from "../view_resolver";
import { View, ViewArgs } from "./view";

export class UnionView extends View {
  views: View[];

  constructor({ views, ...args }: ViewArgs & { views: View[] }) {
    super({ ...args, type: "union" });
    this.views = views;
  }

  resolve(resolver: ViewResolver): ResolvedView {
    const sql = this.views
      .map((view) => {
        const resolvedView = view.resolve(resolver);
        return `${resolvedView.sql} \n `;
      })
      .join("\nUNION ALL\n");
    const firstResolvedView = this.views[0].resolve(resolver);
    return new ResolvedView({
      publicName: this.name,
      physicalName: this.alphabetName,
      columns: [...firstResolvedView.asInheritedExtractedColumns()],
      sql,
    });
  }
}
