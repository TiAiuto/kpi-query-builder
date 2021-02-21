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

  asResolvedColumns({
    publicNameAlias,
    physicalNameAlias,
  }: {
    publicNameAlias?: string;
    physicalNameAlias?: string;
  } = {}): PublicColumnReference[] {
    return this.columns.map(
      (column) =>
        new PublicColumnReference({
          publicName: column.publicName,
          physicalName: column.physicalName,
          resolvedView: new ResolvedView({
            columns: this.columns,
            sql: this.sql, // sqlはいらない気もするが一応正しい値を渡しておく
            publicName: publicNameAlias || this.publicName,
            physicalName: physicalNameAlias || this.physicalName,
          }),
        })
    );
  }

  asInheritedExtractedColumns(): SelectColumn[] {
    return this.asResolvedColumns().map((resolvedColumn) =>
      resolvedColumn.toExtractedColumn()
    );
  }
}
