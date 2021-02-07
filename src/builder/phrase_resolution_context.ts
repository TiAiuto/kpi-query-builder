import { ResolvedColumn } from "./resolved_column";
import { ViewResolver } from "./view_resolver";

export class PhraseResolutionContext {
  resolver: ViewResolver;
  availableColumns: ResolvedColumn[];

  constructor({
    resolver,
    availableColumns,
  }: {
    resolver: ViewResolver;
    availableColumns: ResolvedColumn[];
  }) {
    this.resolver = resolver;
    this.availableColumns = availableColumns;
  }
}
