import { Value } from "../value/value";
import { ViewResolutionContext } from "../view_resolution_context";
import { Condition } from "./condition";

export class PlaceholderCondition extends Condition {
  template: string;
  values: Value[];

  constructor({ template, values }: { template: string; values: Value[] }) {
    super({ type: "placeholder" });

    this.template = template;
    this.values = values;
  }

  toSQL(context: ViewResolutionContext): string {
    let result = this.template;
    this.values.forEach((value) => {
      // TODO: 本当はちゃんとエスケープしたほうがいい
      result = result.replace("?", value.toSQL(context));
    });
    return result;
  }

  toSQLForRoot(): string {
    throw new Error("Method not implemented.");
  }
}
