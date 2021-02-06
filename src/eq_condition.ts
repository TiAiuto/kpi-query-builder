import { Condition } from "./condition";

export class EqCondition extends Condition {
  oneSource?: string | null;
  oneColumnName: string;

  otherSource?: string | null;
  otherColumnName: string;

  constructor({
    oneSource,
    oneColumnName,
    otherSource,
    otherColumnName,
  }: {
    oneSource?: string | null;
    oneColumnName: string;
    otherSource?: string | null;
    otherColumnName: string;
  }) {
    super({ type: "eq" });

    this.oneSource = oneSource;
    this.oneColumnName = oneColumnName;

    this.otherSource = otherSource;
    this.otherColumnName = otherColumnName;
  }
}
