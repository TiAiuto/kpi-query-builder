import { Condition } from "./condition";

export class EqCondition extends Condition {
  oneSource?: string | null;
  oneSourceColumnName: string;

  otherSource?: string | null;
  otherSourceColumnName: string;

  constructor({
    oneSource,
    oneSourceColumnName,
    otherSource,
    otherSourceColumnName,
  }: {
    oneSource?: string | null;
    oneSourceColumnName: string;
    otherSource?: string | null;
    otherSourceColumnName: string;
  }) {
    super({ type: "eq" });

    this.oneSource = oneSource;
    this.oneSourceColumnName = oneSourceColumnName;

    this.otherSource = otherSource;
    this.otherSourceColumnName = otherSourceColumnName;
  }
}
