export abstract class View {
  type: string;

  constructor({ type }: { type: string }) {
    this.type = type;
  }
}
