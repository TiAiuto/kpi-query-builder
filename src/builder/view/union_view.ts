import { ResolvedView } from "../resolved_view";
import { ViewResolver } from "../view_resolver";
import { View, ViewArgs } from "./view";

export class UnionView extends View {
  viewNames: string[];

  constructor({ viewNames, ...args }: ViewArgs & { viewNames: string[] }) {
    super({ ...args, type: "union" });
    this.viewNames = viewNames;
  }

  resolve(resolver: ViewResolver): ResolvedView {
    // 本当はカラム定義を引数でセットするようにしたほうがいい
    const firstResolvedView = resolver.resolve(this.viewNames[0]);
    const sql = this.viewNames
      .map((viewName) => {
        const resolvedView = resolver.resolve(viewName);
        return resolvedView.sql + "\n";
      })
      .join("\nUNION ALL\n");
    return new ResolvedView({
      publicName: this.name,
      physicalName: this.alphabetName,
      columns: [...firstResolvedView.asInheritedExtractedColumns()],
      sql,
    });
  }
}
