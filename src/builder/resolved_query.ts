import { SelectColumn } from "./select_column";

export class ResolvedQuery {
  columns: SelectColumn[];
  physicalSource: string;
  physicalSourceAlias?: string;
  joinPhrases: string[];
  conditionsPhrases: string[];
  groupPhrases: string[];
  orderPhrases: string[];
  distinct: boolean;

  constructor({
    columns,
    physicalSource,
    physicalSourceAlias,
    joinPhrases,
    conditionPhrases,
    groupPhrases,
    orderPhrases,
    distinct
  }: {
    columns: SelectColumn[];
    physicalSource: string;
    physicalSourceAlias?: string;
    joinPhrases: string[];
    conditionPhrases: string[];
    groupPhrases: string[];
    orderPhrases: string[];
    distinct: boolean;
  }) {
    this.columns = columns;
    this.physicalSource = physicalSource;
    this.physicalSourceAlias = physicalSourceAlias;
    this.joinPhrases = joinPhrases;
    this.conditionsPhrases = conditionPhrases;
    this.groupPhrases = groupPhrases;
    this.orderPhrases = orderPhrases;
    this.distinct = distinct;
  }

  toSQL(): string {
    let sql = "SELECT \n ";
    if (this.distinct) {
      sql += " DISTINCT ";
    }
    sql += this.columns.map((item) => item.selectSQL).join(", \n");
    sql += " \n FROM ";
    sql += `${this.physicalSource} `;
    if (this.physicalSourceAlias) {
      sql += `${this.physicalSourceAlias} `;
    }
    sql += this.joinPhrases.join(" \n ");
    sql += " \n ";
    if (this.conditionsPhrases.length) {
      sql += `WHERE ${this.conditionsPhrases.join(" AND \n ")} \n`;
    }
    if (this.groupPhrases.length) {
      sql += `GROUP BY ${this.groupPhrases.join(", \n ")} \n`;
    }
    if (this.orderPhrases.length) {
      sql += `ORDER BY ${this.orderPhrases.join(", \n ")} \n`;
    }
    return sql;
  }
}
