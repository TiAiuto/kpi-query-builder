import { ResolvedColumn, ResolvedColumnArgs } from "./resolved_column";

export class ReferenceResolvedColumn extends ResolvedColumn {
  physicalSource: string; // SQLの書き出し用
  physicalSourceColumnName: string; // SQLの書き出し用

  constructor({
    physicalSource,
    physicalSourceColumnName,
    ...args
  }: ResolvedColumnArgs & {
    physicalSource: string;
    physicalSourceColumnName: string;
  }) {
    super({ ...args, type: "reference" });
    this.physicalSource = physicalSource;
    this.physicalSourceColumnName = physicalSourceColumnName;
  }

  toSQL(): string {
    return `${this.physicalSource}.${this.physicalSourceColumnName} AS ${this.physicalName}`;
  }
}
