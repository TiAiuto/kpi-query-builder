import { ResolvedView } from "../resolved_view";
import { SelectColumn } from "../select_column";
import { ValueSurface } from "../value_surface";
import { ViewResolver } from "../view_resolver";
import { View, ViewArgs } from "./view";

export class UnionView extends View {
  views: View[];
  columns: ValueSurface[];

  constructor({
    views,
    columns,
    ...args
  }: ViewArgs & { views: View[]; columns: ValueSurface[] }) {
    super({ ...args, type: "union" });
    this.views = views;
    this.columns = columns;
  }

  resolve(resolver: ViewResolver): ResolvedView {
    const sql = this.views
      .map((view) => {
        const resolvedView = view.resolve(resolver);
        return `${resolvedView.sql} \n `;
      })
      .join("\nUNION ALL\n");
    const columns = this.columns.map((column) => {
      return new SelectColumn({
        publicName: column.name,
        physicalName: column.alphabetName,
        selectSQL: "",
      });
    });
    return new ResolvedView({
      publicName: this.name,
      physicalName: this.alphabetName,
      columns,
      sql,
    });
  }
}
