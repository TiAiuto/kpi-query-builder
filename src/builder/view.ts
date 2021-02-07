import { ResolvedView } from "./resolved_view";
import { TransformedValue } from "./transformed_value";
import { ViewResolver } from "./view_resolver";

export type ViewArgs = {
  name: string;
  alphabetName: string;
  columns: TransformedValue[];
};

export abstract class View {
  type: string;
  name: string;
  alphabetName: string;
  columns: TransformedValue[];

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

  abstract build(resolver: ViewResolver): ResolvedView;
}
