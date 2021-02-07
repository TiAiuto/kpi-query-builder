import { ViewResolver } from "./view_resolver";

export abstract class Condition {
  type: string;

  constructor({ type }: { type: string }) {
    this.type = type;
  }

  abstract toSQL(resolver: ViewResolver): string
}
