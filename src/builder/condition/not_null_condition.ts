import { Value } from "../value/value";
import { PlaceholderCondition } from "./placeholder_condition";

export class NotNullCondition extends PlaceholderCondition {
  constructor(args: { values: Value[] }) {
    if (args.values.length !== 1) {
      throw new Error(`${args.values}は1つだけ指定してください`);
    }

    super({ ...args, template: "? IS NOT NULL" });
  }
}
