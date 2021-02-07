import { ResolvedColumn } from "./resolved_column";

export class ResolvedView {
  publicName: string;
  physicalName: string;
  resolvedColumns: ResolvedColumn[];
  sql: string;

  constructor({
    publicName,
    physicalName,
    resolvedColumns,
    sql,
  }: {
    publicName: string;
    physicalName: string;
    resolvedColumns: ResolvedColumn[];
    sql: string;
  }) {
    this.publicName = publicName;
    this.physicalName = physicalName;
    this.resolvedColumns = resolvedColumns;
    this.sql = sql;
  }
}
