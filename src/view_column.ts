import { TransformedColumn } from "./transformed_column";

export class ViewColumn implements TransformedColumn {
  name: string;
  alphabetName: string;
  originalName: string;
  source?: string | null;

  constructor({
    name,
    alphabetName,
    originalName,
    source,
  }: {
    name: string;
    alphabetName: string;
    originalName: string;
    source?: string | null;
  }) {
    this.name = name;
    this.alphabetName = alphabetName;
    this.originalName = originalName;
    this.source = source;
  }
}
