import { ViewResolutionContext } from "../view_resolution_context";
import { Condition } from "./condition";

export class RawCondition extends Condition {
  raw: string;

  constructor({ raw }: { raw: string }) {
    super({ type: "raw" });
    this.raw = raw;
  }

  toSQL(context: ViewResolutionContext): string {
    return this.raw;
  }

  toSQLForRoot(): string {
    return this.raw;
  }
}
