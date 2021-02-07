import { Value } from "./value";

export class RawValue extends Value {
  raw: string

  constructor({ raw }: { raw: string }) {
    super({ type: "raw" });
    this.raw = raw;
  }

  toSQL(): string {
    return this.raw;
  }
}
