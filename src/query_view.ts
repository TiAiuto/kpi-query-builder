import { ReferenceView, ReferenceViewArgs } from "./reference_view";

export class QueryView extends ReferenceView {
  constructor(args: ReferenceViewArgs) {
    super({ type: "query", ...args });
  }
}
