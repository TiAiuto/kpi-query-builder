export abstract class ValueSet {
  type: string;

  constructor({ type }: { type: string }) {
    this.type = type;
  }
}
