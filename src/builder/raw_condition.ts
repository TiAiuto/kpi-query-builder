import { Condition } from "./condition";

export class RawCondition extends Condition {
  raw: string;

  constructor({ raw }: { raw: string }) {
    super({type: 'raw'});
    this.raw = raw;
  }
}
