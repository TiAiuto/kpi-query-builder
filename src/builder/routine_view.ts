import { RoutinePattern } from "./routine_pattern";
import { View, ViewArgs } from "./view";

export class RoutineView extends View {
  pattern: RoutinePattern;

  constructor({ pattern, ...args }: ViewArgs & { pattern: RoutinePattern }) {
    super({ ...args, type: "routine" });
    this.pattern = pattern;
  }
}
