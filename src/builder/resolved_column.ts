import { ExtractedColumn } from "./extracted_column";
import { ResolvedView } from "./resolved_view";
import {
  ResolvedViewColumn,
  ResolvedViewColumnArgs,
} from "./resolved_view_column";

export type ResolvedColumnArgs = ResolvedViewColumnArgs & {
  resolvedView: ResolvedView;
};

// 「参照可能カラム」みたいな名前にするとはまりそう
export class ResolvedColumn extends ResolvedViewColumn {
  resolvedView: ResolvedView;

  constructor({
    resolvedView,
    ...args
  }: ResolvedColumnArgs & { resolvedView: ResolvedView }) {
    super(args);
    this.resolvedView = resolvedView;
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
