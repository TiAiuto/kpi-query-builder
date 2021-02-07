export type ResolvedColumnArgs = {
  publicSource: string;
  publicName: string; // 外側に公開するカラム名
  physicalName: string; // SQL側で公開する（書き出す）カラム名
  physicalSource: string; // SQL側で参照するテーブル名
  physicalSourceValue: string; // SQL側で参照するカラム名
};

export abstract class ResolvedColumn {
  publicSource: string;
  publicName: string; // 外側に公開するカラム名
  physicalName: string; // SQL側で公開する（書き出す）カラム名
  physicalSource: string; // SQL側で参照するテーブル名
  physicalSourceValue: string; // SQL側で参照するカラム名

  constructor({
    publicSource,
    publicName,
    physicalName,
    physicalSource,
    physicalSourceValue,
  }: ResolvedColumnArgs) {
    this.publicSource = publicSource;
    this.publicName = publicName;
    this.physicalName = physicalName;
    this.physicalSource = physicalSource;
    this.physicalSourceValue = physicalSourceValue;
  }

  abstract toValueSQL(): string;
  abstract toSelectSQL(): string;
}
