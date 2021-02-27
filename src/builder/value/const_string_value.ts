import { ViewResolutionContext } from "../view_resolution_context";
import { Value } from "./value";

export class ConstStringValue extends Value {
  value: string;

  constructor({ value }: { value: string }) {
    super({ type: "const_string" });
    this.value = value;
  }

  toSQL(context: ViewResolutionContext): string {
    // TODO: 本当はエスケープが必要
    return `"${this.value}"`;
  }

  toSQLForRoot(context: ViewResolutionContext): string {
    // TODO: 本当はエスケープが必要
    return `"${this.value}"`;
  }
}
