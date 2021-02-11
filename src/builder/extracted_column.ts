import { PublicColumnReference } from "./public_column_reference";
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

  toResolvedColumn(resolvedView: ResolvedView): PublicColumnReference {
    return new PublicColumnReference({
      publicName: this.publicName,
      physicalName: this.physicalName,
      resolvedView,
    });
  }
}
