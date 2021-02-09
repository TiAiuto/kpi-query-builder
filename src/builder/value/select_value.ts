import { PhraseResolutionContext } from "../phrase_resolution_context";
import { SourceColumn } from "../source_column";
import { Value } from "./value";

export class SelectValue extends Value implements SourceColumn {
  source?: string;
  sourceColumnName: string;

  constructor({ source, sourceColumnName }: SourceColumn) {
    super({ type: "select" });
    this.source = source;
    this.sourceColumnName = sourceColumnName;
  }

  toSQL(context: PhraseResolutionContext): string {
    const resolvedColumn = context.findColumnByName(this.sourceColumnName, this.source);
    return resolvedColumn.fullPhysicalName;
  }

  toSQLForRoot(context: PhraseResolutionContext): string {
    let sql = '';
    if (this.source) {
      sql += `${this.source}.`;
    }
    sql += this.sourceColumnName;
    return sql;
  }
}
