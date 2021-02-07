export class ResolvedColumn {
  publicSource: string;
  publicName: string; // 外側に公開するカラム名
  physicalName: string; // SQL側で公開する（書き出す）カラム名
  physicalSource: string; // SQL側で参照するテーブル名
  physicalSourceColumnName: string; // SQL側で参照するカラム名

  constructor({
    publicSource,
    publicName,
    physicalName,
    physicalSource,
    physicalSourceColumnName,
  }: {
    publicSource: string;
    publicName: string;
    physicalName: string;
    physicalSource: string;
    physicalSourceColumnName: string;
  }) {
    this.publicSource = publicSource;
    this.publicName = publicName;
    this.physicalName = physicalName;
    this.physicalSource = physicalSource;
    this.physicalSourceColumnName = physicalSourceColumnName;
  }

  toSelectSQL(): string {
    return `${this.physicalSource}.${this.physicalSourceColumnName} AS ${this.physicalName}`;
  }
}
