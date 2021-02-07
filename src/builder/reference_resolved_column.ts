import { ResolvedColumn, ResolvedColumnArgs } from "./resolved_column";

export class ReferenceResolvedColumn extends ResolvedColumn {
  constructor(args: ResolvedColumnArgs) {
    super(args);
  }

  toValueSQL(): string {
    return `${this.physicalSource}.${this.physicalSourceValue}`;
  }

  toSelectSQL(): string {
    return `${this.toValueSQL()} AS ${this.physicalName}`;
  }
}
