import { PublicColumnReference } from "./public_column_reference";
import { SelectColumn } from "./select_column";
import { ResolvedViewColumn } from "./resolved_view_column";

export class ResolvedView {
  publicName: string;
  physicalName: string;
  columns: ResolvedViewColumn[];
  sql: string;

  constructor({
    publicName,
    physicalName,
    columns,
    sql,
  }: {
    publicName: string;
    physicalName: string;
    columns: ResolvedViewColumn[];
    sql: string;
  }) {
    this.publicName = publicName;
    this.physicalName = physicalName;
    this.columns = columns;
    this.sql = sql;
  }

  asResolvedColumns(): PublicColumnReference[] {
    return this.columns.map(
      (column) =>
        new PublicColumnReference({
          publicName: column.publicName,
          physicalName: column.physicalName,
          resolvedView: this,
        })
    );
  }

  asInheritedExtractedColumns(): SelectColumn[] {
    return this.asResolvedColumns().map((resolvedColumn) =>
      resolvedColumn.toExtractedColumn()
    );
  }
}
