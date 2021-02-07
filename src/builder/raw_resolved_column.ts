import { ResolvedColumn, ResolvedColumnArgs } from "./resolved_column";

export class RawResolvedColumn extends ResolvedColumn {
  raw: string;

  constructor({ raw, ...args }: ResolvedColumnArgs & { raw: string }) {
    super({ ...args, type: 'raw' });
    this.raw = raw;
  }

  toSQL(): string {
    return this.raw;
  }
}
