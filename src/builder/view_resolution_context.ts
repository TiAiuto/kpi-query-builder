import { PublicColumnReference } from "./public_column_reference";
import { SelectValue } from "./value/select_value";
import { Value } from "./value/value";
import { View } from "./view/view";
import { ViewResolver } from "./view_resolver";

export class ViewResolutionContext {
  currentView: View;
  resolver: ViewResolver;
  availableColumns: PublicColumnReference[];

  constructor({
    currentView,
    resolver,
    availableColumns,
  }: {
    currentView: View;
    resolver: ViewResolver;
    availableColumns: PublicColumnReference[];
  }) {
    this.currentView = currentView;
    this.resolver = resolver;
    this.availableColumns = availableColumns;
  }

  findColumnByName(sourceColumnName: string, source?: string): PublicColumnReference {
    if (source) {
      const completeMatchedColumn = this.availableColumns.find(
        (column) =>
          column.publicName === sourceColumnName &&
          column.resolvedView.publicName === source
      );
      if (completeMatchedColumn) {
        return completeMatchedColumn;
      }
    }

    const matchedColumns = this.availableColumns.filter(
      (column) => column.publicName === sourceColumnName
    );
    if (matchedColumns.length === 1) {
      return matchedColumns[0];
    }
    if (matchedColumns.length === 0) {
      throw new Error(`${sourceColumnName}は未定義`);
    }
    throw new Error(
      `${sourceColumnName}に該当するカラムが複数あるため特定できません`
    );
  }

  findColumnByValue(value: Value): PublicColumnReference {
    if (value instanceof SelectValue) {
      return this.findColumnByName(value.sourceColumnName, value.source);
    }
    throw new Error(`${value}は解決できません`);
  }
}
