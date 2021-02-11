import { ResolvedColumn } from "./resolved_column";
import { ResolvedView } from "./resolved_view";
import { ResolvedViewColumn, ResolvedViewColumnArgs } from "./resolved_view_column";

export class ExtractedColumn extends ResolvedViewColumn {
  selectSQL: string;

  constructor({
    selectSQL,
    ...args
  }: ResolvedViewColumnArgs & {
    selectSQL: string;
  }) {
    super(args);
    this.selectSQL = selectSQL;
  }

  toResolvedColumn(resolvedView: ResolvedView): ResolvedColumn {
    return new ResolvedColumn({
      publicName: this.publicName,
      physicalName: this.physicalName,
      resolvedView,
    });
  }
}
