import { SelectColumn } from "./select_column";
import { ResolvedView } from "./resolved_view";
import {
  ResolvedViewColumn,
  ResolvedViewColumnArgs,
} from "./resolved_view_column";

export type PublicColumnReferenceArgs = ResolvedViewColumnArgs & {
  resolvedView: ResolvedView;
};

export class PublicColumnReference extends ResolvedViewColumn {
  resolvedView: ResolvedView;

  constructor({
    resolvedView,
    ...args
  }: PublicColumnReferenceArgs & { resolvedView: ResolvedView }) {
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
  } = {}): SelectColumn {
    return new SelectColumn({
      publicName: newPublicName,
      physicalName: newPhysicalName,
      selectSQL: `${this.fullPhysicalName} AS ${newPhysicalName}`,
    });
  }

  get fullPhysicalName(): string {
    return `${this.resolvedView.physicalName}.${this.physicalName}`;
  }
}
