import { ResolvedColumn, ResolvedColumnArgs } from "./resolved_column";

export class ReferenceResolvedColumn extends ResolvedColumn {
  publicSource: string; // 外側に公開する定義名
  physicalSource: string; // SQLの書き出し用
  physicalSourceColumnName: string; // SQLの書き出し用

  constructor({
    publicSource,
    physicalSource,
    physicalSourceColumnName,
    ...args
  }: ResolvedColumnArgs & {
    publicSource: string;
    physicalSource: string;
    physicalSourceColumnName: string;
  }) {
    super({ ...args, type: 'reference' });
    this.publicSource = publicSource;
    this.physicalSource = physicalSource;
    this.physicalSourceColumnName = physicalSourceColumnName;
  }

  toSQL(): string {
    return `${this.physicalSource}.${this.physicalSourceColumnName} AS ${this.physicalName}`;
  }
}
