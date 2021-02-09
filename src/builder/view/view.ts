import { ResolvedView } from "../resolved_view";
import { ViewResolver } from "../view_resolver";

export type ViewArgs = {
  name: string;
  alphabetName: string;
};

export abstract class View {
  type: string;
  name: string;
  alphabetName: string;

  constructor({
    type,
    name,
    alphabetName,
  }: ViewArgs & {
    type: string;
  }) {
    this.type = type;
    this.name = name;
    this.alphabetName = alphabetName;
  }

  abstract resolve(resolver: ViewResolver): ResolvedView;
}
