import { Value } from "../value/value";
import { ViewResolutionContext } from "../view_resolution_context";
import { Condition } from "./condition";

export class UnaryCondition extends Condition {
  template: string;
  value: Value;

  constructor({ template, value }: { value: Value; template: string }) {
    super({ type: "unary" });

    this.template = template;
    this.value = value;
  }

  toSQL(context: ViewResolutionContext): string {
    return this.template.replace("?", this.value.toSQL(context));
  }

  toSQLForRoot(): string {
    throw new Error("Method not implemented.");
  }
}
