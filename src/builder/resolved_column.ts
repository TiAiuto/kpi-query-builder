export class ResolvedColumn {
  publicName: string; // 外側に公開するカラム名
  physicalName: string; // SQLの書き出し用
  publicSource?: string; // 外側に公開する定義名
  physicalSource?: string; // SQLの書き出し用
  physicalSourceColumnName?: string; // SQLの書き出し用

  constructor({
    publicName,
    physicalName,
    publicSource,
    physicalSource,
    physicalSourceColumnName
  }: {
    publicName: string;
    physicalName: string;
    publicSource?: string;
    physicalSource?: string;
    physicalSourceColumnName?: string;
  }) {
    this.publicName = publicName;
    this.physicalName = physicalName;
    this.publicSource = publicSource;
    this.physicalSource = physicalSource;
    this.physicalSourceColumnName = physicalSourceColumnName;
  }

  toSQL(): string {
    if (!this.physicalSource) {
      throw new Error(`${this.publicName}の物理テーブル名が未定義`);
    }
    if (!this.physicalName) {
      throw new Error(`${this.publicName}の物理カラム名が未定義`);
    }

    return `${this.physicalSource}.${this.physicalSourceColumnName} AS ${this.physicalName}`;
  }
}
