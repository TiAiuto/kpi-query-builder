import { Filter } from "./filter";
import { ViewColumn } from "./view_column";

export abstract class View {
  type: string;
  name: string;
  alphabetName: string;
  columns: ViewColumn[];
  filters: Filter[];

  constructor({
    type,
    name,
    alphabetName,
    columns,
    filters
  }: {
    type: string;
    name: string;
    alphabetName: string;
    columns: ViewColumn[];
    filters: Filter[];
  }) {
    this.type = type;
    this.name = name;
    this.alphabetName = alphabetName;
    this.columns = columns;
    this.filters = filters;
  }
}
