import { ResolvedColumn } from "../resolved_column";
import { SourceColumn } from "../source_column";
import { SelectValue } from "../value/select_value";
import { ValueSurface } from "../value_surface";
import { QueryView } from "../view/query_view";
import { ViewResolver } from "../view_resolver";
import { ValueSet } from "./value_set";

export class SelectValueSet extends ValueSet implements SourceColumn {
  source: string;
  sourceColumnName: string;

  constructor({ source, sourceColumnName }: Required<SourceColumn>) {
    super({ type: "select" });
    this.source = source;
    this.sourceColumnName = sourceColumnName;
  }

  toSQL(resolver: ViewResolver, availableColumns: ResolvedColumn[]): string {
    const temporaryQueryView = new QueryView({
      name: "一時テーブル",
      alphabetName: "temporary table",
      source: this.source,
      columnsInheritanceEnabled: false,
      columns: [
        new ValueSurface({
          name: "抽出対象カラム",
          alphabetName: "value_set_value",
          value: new SelectValue({ sourceColumnName: this.sourceColumnName }),
        }),
      ],
    });
    return temporaryQueryView.resolve(resolver).sql;
  }
}
