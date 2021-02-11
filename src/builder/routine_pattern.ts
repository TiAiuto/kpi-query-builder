export class RoutinePattern {
  name: string;
  args: string[];

  constructor({ name, args = [] }: { name: string; args?: string[] }) {
    this.name = name;
    this.args = args;
  }
}
