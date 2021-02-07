import { ResolvedColumn } from "./resolved_column";

export class ResolvedView {
  publicName: string;
  physicalName: string;
  columns: ResolvedColumn[];
  physicalSource?: string;
  sql: string;

  constructor({
    publicName,
    physicalName,
    columns,
    physicalSource,
    sql,
  }: {
    publicName: string;
    physicalName: string;
    columns: ResolvedColumn[];
    physicalSource?: string;
    sql: string;
  }) {
    this.publicName = publicName;
    this.physicalName = physicalName;
    this.columns = columns;
    this.physicalSource = physicalSource;
    this.sql = sql;
  }
}
