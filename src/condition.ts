export abstract class Condition {
  type: string;

  constructor({ type }: { type: string }) {
    this.type = type;
  }
}
