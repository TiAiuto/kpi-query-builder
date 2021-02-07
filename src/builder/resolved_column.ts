export type ResolvedColumnArgs = {
  publicName: string;
  physicalName: string;
}

export abstract class ResolvedColumn {
  type: string;
  publicName: string; // 外側に公開するカラム名
  physicalName: string; // SQLの書き出し用

  constructor({
    type,
    publicName,
    physicalName
  }: ResolvedColumnArgs & {
    type: string;
  }) {
    this.type = type;
    this.publicName = publicName;
    this.physicalName = physicalName;
  }

  abstract toSQL(): string
}
