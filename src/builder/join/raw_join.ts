import { ViewResolver } from "../view_resolver";
import { Join } from "./join";

export class RawJoin extends Join {
  raw: string;

  constructor({ raw }: { raw: string }) {
    super({ type: "raw" });
    this.raw = raw;
  }

  toSQL(resolver: ViewResolver): string {
    return this.raw;
  }
  
  toSQLForRoot(resolver: ViewResolver): string {
    return this.raw;
  }
}
