export class ResolvedColumn {
  publicName: string; // 外側に公開するカラム名
  physicalName: string; // SQLの書き出し用
  publicSource?: string; // 外側に公開する定義名
  physicalSource?: string; // SQLの書き出し用

  constructor({
    publicName,
    physicalName,
    publicSource,
    physicalSource,
  }: {
    publicName: string;
    physicalName: string;
    publicSource?: string;
    physicalSource?: string;
  }) {
    this.publicName = publicName;
    this.physicalName = physicalName;
    this.publicSource = publicSource;
    this.physicalSource = physicalSource;
  }
}
