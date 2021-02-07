import { Condition } from "./condition";

export class EqCondition extends Condition {
  oneSource?: string;
  oneSourceColumnName: string;

  otherSource?: string;
  otherSourceColumnName: string;

  constructor({
    oneSource,
    oneSourceColumnName,
    otherSource,
    otherSourceColumnName,
  }: {
    oneSource?: string;
    oneSourceColumnName: string;
    otherSource?: string;
    otherSourceColumnName: string;
  }) {
    super({ type: "eq" });

    this.oneSource = oneSource;
    this.oneSourceColumnName = oneSourceColumnName;

    this.otherSource = otherSource;
    this.otherSourceColumnName = otherSourceColumnName;
  }
}
