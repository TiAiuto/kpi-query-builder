import { ViewResolutionContext } from "../view_resolution_context";

export abstract class ValueSet {
  type: string;

  constructor({ type }: { type: string }) {
    this.type = type;
  }

  abstract toSQL(context: ViewResolutionContext): string;
}
