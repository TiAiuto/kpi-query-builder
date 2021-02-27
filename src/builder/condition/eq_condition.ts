import { Value } from "../value/value";
import { PlaceholderCondition } from "./placeholder_condition";

export class EqCondition extends PlaceholderCondition {
  constructor(args: { values: Value[] }) {
    if (args.values.length !== 2) {
      throw new Error(`${args.values}は2つ指定してください`);
    }

    super({ ...args, template: "? = ?" });
  }
}
