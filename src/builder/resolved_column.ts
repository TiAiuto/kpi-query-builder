import { ExtractedColumn } from "./extracted_column";
import { PublicColumnInterface } from "./public_column_interface";
import { ResolvedView } from "./resolved_view";

export type ResolvedColumnArgs = {
  resolvedView: ResolvedView;
  publicName: string; // 外側に公開するカラム名
  physicalName: string; // SQL側で公開する（書き出す）カラム名
};

export class ResolvedColumn implements PublicColumnInterface {
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

  toExtractedColumn({
    newPublicName = this.publicName,
    newPhysicalName = this.physicalName,
  }: {
    newPublicName?: string;
    newPhysicalName?: string;
  } = {}): ExtractedColumn {
    return new ExtractedColumn({
      publicName: newPublicName,
      physicalName: newPhysicalName,
      selectSQL: `${this.fullPhysicalName} AS ${newPhysicalName}`,
    });
  }

  get fullPhysicalName(): string {
    return `${this.resolvedView.physicalName}.${this.physicalName}`;
  }
}
