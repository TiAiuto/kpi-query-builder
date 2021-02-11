import { ViewResolutionContext } from "../view_resolution_context";
import { Value } from "./value";

export class RawValue extends Value {
  raw: string;

  constructor({ raw }: { raw: string }) {
    super({ type: "raw" });
    this.raw = raw;
  }

  toSQL(context: ViewResolutionContext): string {
    return this.raw;
  }

  toSQLForRoot(context: ViewResolutionContext): string {
    return this.raw;
  }
}
