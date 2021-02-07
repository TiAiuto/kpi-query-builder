import { ReferenceView, ReferenceViewArgs } from "./reference_view";
import { ResolvedView } from "./resolved_view";
import { ViewResolver } from "./view_resolver";

export class QueryView extends ReferenceView {
  columnsInheritanceEnabled: boolean;

  constructor({
    columnsInheritanceEnabled,
    ...args
  }: ReferenceViewArgs & { columnsInheritanceEnabled: boolean }) {
    super({ type: "query", ...args });
    this.columnsInheritanceEnabled = columnsInheritanceEnabled;
  }

  resolve(resolver: ViewResolver): ResolvedView {
    throw new Error("Method not implemented.");
  }
}
