import { ResolvedView } from "../resolved_view";
import { ValueSurface } from "../value_surface";
import { ViewResolver } from "../view_resolver";

export type ViewArgs = {
  name: string;
  alphabetName: string;
  columns: ValueSurface[];
};

export abstract class View {
  type: string;
  name: string;
  alphabetName: string;
  columns: ValueSurface[];

  constructor({
    type,
    name,
    alphabetName,
    columns,
  }: ViewArgs & {
    type: string;
  }) {
    this.type = type;
    this.name = name;
    this.alphabetName = alphabetName;
    this.columns = columns;
  }

  abstract resolve(resolver: ViewResolver): ResolvedView;
}
