import { ResolvedColumn } from "../resolved_column";
import { ViewResolver } from "../view_resolver";
import { Condition } from "./condition";

export class RawCondition extends Condition {
  raw: string;

  constructor({ raw }: { raw: string }) {
    super({type: 'raw'});
    this.raw = raw;
  }

  toSQL(resolver: ViewResolver, availableColumns: ResolvedColumn[]): string {
    return this.raw;
  }
  
  toSQLForRoot(resolver: ViewResolver): string {
    return this.raw;
  }
}
