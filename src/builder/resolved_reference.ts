import { ResolvedColumn } from "./resolved_column";

export class ResolvedReference {
  resolvedColumns: ResolvedColumn[];
  physicalSource: string;
  physicalSourceAlias?: string;
  joinPhrases: string[];
  conditionsPhrases: string[];
  groupPhrases: string[];
  orderPhrases: string[];

  constructor({
    resolvedColumns,
    physicalSource,
    physicalSourceAlias,
    joinPhrases,
    conditionPhrases,
    groupPhrases,
    orderPhrases
  }: {
    resolvedColumns: ResolvedColumn[];
    physicalSource: string;
    physicalSourceAlias?: string;
    joinPhrases: string[];
    conditionPhrases: string[];
    groupPhrases: string[];
    orderPhrases: string[];
  }) {
    this.resolvedColumns = resolvedColumns;
    this.physicalSource = physicalSource;
    this.physicalSourceAlias = physicalSourceAlias;
    this.joinPhrases = joinPhrases;
    this.conditionsPhrases = conditionPhrases;
    this.groupPhrases = groupPhrases;
    this.orderPhrases = orderPhrases;
  }

  toSQL(): string {
    let sql = 'SELECT ';
    sql += this.resolvedColumns.map((item) => item.toSQL()).join(', ');
    sql += ' FROM ';
    sql += `${this.physicalSource} `;
    if (this.physicalSourceAlias) {
      sql += `${this.physicalSourceAlias} `;
    }
    if (this.conditionsPhrases.length) {
      sql += `WHERE ${this.conditionsPhrases.join('AND ')}`;
    }
    if (this.groupPhrases.length) {
      sql += `GROUP BY ${this.groupPhrases.join(', ')}`;
    }
    if (this.orderPhrases.length) {
      sql += `ORDER BY ${this.orderPhrases.join(', ')}`;
    }
    return sql;
  }
}
