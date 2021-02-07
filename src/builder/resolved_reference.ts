import { ResolvedColumn } from "./resolved_column";

export class ResoledReference {
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
    throw new Error('未実装');
  }
}
