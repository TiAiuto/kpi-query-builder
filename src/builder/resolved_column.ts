export class ResolvedColumn {
  publicName: string; // 外側に公開するカラム名
  physicalName: string; // SQLの書き出し用
  publicSource?: string; // 外側に公開する定義名
  physicalSource?: string; // SQLの書き出し用
  physicalSourceColumnName?: string; // SQLの書き出し用
  raw?: string; // 直にSQLを覚える場合

  constructor({
    publicName,
    physicalName,
    publicSource,
    physicalSource,
    physicalSourceColumnName, 
    raw
  }: {
    publicName: string;
    physicalName: string;
    publicSource?: string;
    physicalSource?: string;
    physicalSourceColumnName?: string;
    raw?: string;
  }) {
    this.publicName = publicName;
    this.physicalName = physicalName;
    this.publicSource = publicSource;
    this.physicalSource = physicalSource;
    this.physicalSourceColumnName = physicalSourceColumnName;
    this.raw = raw;
  }

  toSQL(): string {
    if (this.raw) {
      return this.raw;
    }

    if (!this.physicalSource) {
      throw new Error(`${this.publicName}の物理テーブル名が未定義`);
    }
    if (!this.physicalName) {
      throw new Error(`${this.publicName}の物理カラム名が未定義`);
    }

    return `${this.physicalSource}.${this.physicalSourceColumnName} AS ${this.physicalName}`;
  }
}
