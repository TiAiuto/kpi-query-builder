import { ResolvedColumn } from "./resolved_column";
import { ExtractedColumn } from "./extracted_column";

export class ResolvedView {
  publicName: string;
  physicalName: string;
  columns: ExtractedColumn[];
  sql: string;

  constructor({
    publicName,
    physicalName,
    columns,
    sql,
  }: {
    publicName: string;
    physicalName: string;
    columns: ExtractedColumn[];
    sql: string;
  }) {
    this.publicName = publicName;
    this.physicalName = physicalName;
    this.columns = columns;
    this.sql = sql;
  }

  asResolvedColumns(): ResolvedColumn[] {
    return this.columns.map(
      (column) =>
        new ResolvedColumn({
          publicName: column.publicName,
          physicalName: column.physicalName,
          resolvedView: this,
        })
    );
  }
}
