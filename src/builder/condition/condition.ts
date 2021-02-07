import { PhraseResolutionContext } from "../phrase_resolution_context";

export abstract class Condition {
  type: string;

  constructor({ type }: { type: string }) {
    this.type = type;
  }

  abstract toSQL(context: PhraseResolutionContext): string;
  abstract toSQLForRoot(): string;
}
