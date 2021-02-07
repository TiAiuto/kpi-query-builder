import { ResolvedColumn } from "./resolved_column";
import { View } from "./view/view";
import { ViewResolver } from "./view_resolver";

export class PhraseResolutionContext {
  currentView: View;
  resolver: ViewResolver;
  availableColumns: ResolvedColumn[];

  constructor({
    currentView,
    resolver,
    availableColumns,
  }: {
    currentView: View;
    resolver: ViewResolver;
    availableColumns: ResolvedColumn[];
  }) {
    this.currentView = currentView;
    this.resolver = resolver;
    this.availableColumns = availableColumns;
  }
}
