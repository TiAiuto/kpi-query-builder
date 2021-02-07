import { TransformedColumn } from "./transformed_column";
import { Value } from "./value/value";

export class TransformedValue implements TransformedColumn {
  name: string;
  alphabetName: string;
  value: Value;

  constructor({
    name,
    alphabetName,
    value
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
