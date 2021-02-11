import { ViewResolutionContext } from "../view_resolution_context";

export abstract class Condition {
  type: string;

  constructor({ type }: { type: string }) {
    this.type = type;
  }

  abstract toSQL(context: ViewResolutionContext): string;
  abstract toSQLForRoot(): string;
}
