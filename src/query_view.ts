import { View, ViewArgs } from "./view";

export class QueryView extends View {
  constructor(args: ViewArgs) {
    super({ type: "query", ...args });
  }
}
