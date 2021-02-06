import { Condition } from "./condition";

export class EqCondition extends Condition {
  oneColumnSource?: string | null;
  oneColumnName: string;

  otherColumnSource?: string | null;
  otherColumnName: string;

  constructor({
    oneColumnSource,
    oneColumnName,
    otherColumnSource,
    otherColumnName,
  }: {
    oneColumnSource?: string | null;
    oneColumnName: string;
    otherColumnSource?: string | null;
    otherColumnName: string;
  }) {
    super({ type: "eq" });

    this.oneColumnSource = oneColumnSource;
    this.oneColumnName = oneColumnName;

    this.otherColumnSource = otherColumnSource;
    this.otherColumnName = otherColumnName;
  }
}
