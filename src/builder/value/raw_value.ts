import { PhraseResolutionContext } from "../phrase_resolution_context";
import { Value } from "./value";

export class RawValue extends Value {
  raw: string;

  constructor({ raw }: { raw: string }) {
    super({ type: "raw" });
    this.raw = raw;
  }

  toSQL(context: PhraseResolutionContext): string {
    return this.raw;
  }
}
