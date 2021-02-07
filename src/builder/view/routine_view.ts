import { ResolvedView } from "../resolved_view";
import { RoutinePattern } from "../routine_pattern";
import { ViewResolver } from "../view_resolver";
import { View, ViewArgs } from "./view";

export class RoutineView extends View {
  pattern: RoutinePattern;

  constructor({ pattern, ...args }: ViewArgs & { pattern: RoutinePattern }) {
    super({ ...args, type: "routine" });
    this.pattern = pattern;
  }
  
  resolve(resolver: ViewResolver): ResolvedView {
    throw new Error("Method not implemented.");
  }
}
