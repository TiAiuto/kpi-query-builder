import { ResolvedColumn } from "./resolved_column";

export class ResolvedView {
  publicName: string;
  physicalName: string;
  columns: ResolvedColumn[];
  sql: string;

  constructor({
    publicName,
    physicalName,
    columns,
    sql,
  }: {
    publicName: string;
    physicalName: string;
    columns: ResolvedColumn[];
    sql: string;
  }) {
    this.publicName = publicName;
    this.physicalName = physicalName;
    this.columns = columns;
    this.sql = sql;
  }
}
