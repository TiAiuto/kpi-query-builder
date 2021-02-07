import { ResolvedView } from "./resolved_view";
import { RoutinePattern } from "./routine_pattern";
import { View, ViewArgs } from "./view";
import { ViewResolver } from "./view_resolver";

export class RoutineView extends View {
  pattern: RoutinePattern;

  constructor({ pattern, ...args }: ViewArgs & { pattern: RoutinePattern }) {
    super({ ...args, type: "routine" });
    this.pattern = pattern;
  }
  
  build(resolver: ViewResolver): ResolvedView {
    throw new Error("Method not implemented.");
  }
}
