import { Value } from "./value/value";

export class ValueSurface {
  name: string;
  alphabetName: string;
  value: Value;

  constructor({
    name,
    alphabetName,
    value,
  }: {
    name: string;
    alphabetName: string;
    value: Value;
  }) {
    this.name = name;
    this.alphabetName = alphabetName;
    this.value = value;
  }
}
