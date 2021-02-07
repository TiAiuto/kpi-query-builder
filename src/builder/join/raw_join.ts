import { PhraseResolutionContext } from "../phrase_resolution_context";
import { Join } from "./join";

export class RawJoin extends Join {
  raw: string;

  constructor({ raw }: { raw: string }) {
    super({ type: "raw" });
    this.raw = raw;
  }

  toSQL(context: PhraseResolutionContext): string {
    return this.raw;
  }

  toSQLForRoot(): string {
    return this.raw;
  }
}
