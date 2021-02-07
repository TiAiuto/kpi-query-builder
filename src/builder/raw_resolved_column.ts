import { ResolvedColumn, ResolvedColumnArgs } from "./resolved_column";

export class RawResolvedColumn extends ResolvedColumn {
  constructor(args: ResolvedColumnArgs) {
    super(args);
  }

  toValueSQL(): string {
    return this.physicalSourceValue;
  }

  toSelectSQL(): string {
    return `${this.toValueSQL()} AS ${this.physicalName}`;
  }
}
