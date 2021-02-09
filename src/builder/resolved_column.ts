import { ResolvedView } from "./resolved_view";

export type ResolvedColumnArgs = {
  resolvedView: ResolvedView;
  publicName: string; // 外側に公開するカラム名
  physicalName: string; // SQL側で公開する（書き出す）カラム名
};

export class ResolvedColumn {
  resolvedView: ResolvedView;
  publicName: string;
  physicalName: string;

  constructor({ resolvedView, publicName, physicalName }: ResolvedColumnArgs) {
    this.resolvedView = resolvedView;
    this.publicName = publicName;
    this.physicalName = physicalName;
  }

  toValueSQL(): string {
    return `${this.resolvedView.physicalName}.${this.physicalName}`;
  }
}
