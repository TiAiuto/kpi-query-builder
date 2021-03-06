import { ViewResolutionContext } from "./view_resolution_context";
import { Value } from "./value/value";

export class Group {
  value: Value;

  constructor({ value }: { value: Value }) {
    this.value = value;
  }

  toSQL(context: ViewResolutionContext): string {
    return this.value.toSQL(context);
  }
}
