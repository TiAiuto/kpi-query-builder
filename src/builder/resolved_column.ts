export type ResolvedColumnArgs = {
  publicSource: string;
  publicName: string;
  physicalName: string;
}

export abstract class ResolvedColumn {
  type: string;
  publicSource: string;
  publicName: string; // 外側に公開するカラム名
  physicalName: string; // SQL側で公開する（書き出す）カラム名

  constructor({
    type,
    publicSource, 
    publicName,
    physicalName
  }: ResolvedColumnArgs & {
    type: string;
  }) {
    this.type = type;
    this.publicSource = publicSource;
    this.publicName = publicName;
    this.physicalName = physicalName;
  }

  abstract toSQL(): string
}
