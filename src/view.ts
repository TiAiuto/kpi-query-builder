import { ViewColumn } from "./view_column";

export abstract class View {
  type: string;
  name: string;
  alphabetName: string;
  columns: ViewColumn[];

  constructor({
    type,
    name,
    alphabetName,
    columns,
  }: {
    type: string;
    name: string;
    alphabetName: string;
    columns: ViewColumn[];
  }) {
    this.type = type;
    this.name = name;
    this.alphabetName = alphabetName;
    this.columns = columns;
  }
}
