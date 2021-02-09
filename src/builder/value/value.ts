import { PhraseResolutionContext } from "../phrase_resolution_context";

export abstract class Value {
  type: string;

  constructor({ type }: { type: string }) {
    this.type = type;
  }
  
  abstract toSQL(context: PhraseResolutionContext): string;
  abstract toSQLForRoot(context: PhraseResolutionContext): string;
}
