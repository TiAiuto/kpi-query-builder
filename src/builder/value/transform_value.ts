import { PhraseResolutionContext } from "../phrase_resolution_context";
import { SourceColumn } from "../source_column";
import { TransformPattern } from "../transform_pattern";
import { Value } from "./value";

export class TransformValue extends Value implements SourceColumn {
  source?: string;
  sourceColumnName: string;
  pattern: TransformPattern;

  constructor({
    source,
    sourceColumnName,
    pattern,
  }: SourceColumn & { pattern: TransformPattern }) {
    super({ type: "transform" });
    this.source = source;
    this.sourceColumnName = sourceColumnName;
    this.pattern = pattern;
  }

  toSQL(context: PhraseResolutionContext): string {
    const resolvedColumn = context.findColumnByName(
      this.sourceColumnName,
      this.source
    );
    if (this.pattern.name === "タイムスタンプ_月抽出") {
      return `FORMAT_TIMESTAMP('%Y-%m', ${resolvedColumn.fullPhysicalName}, 'Asia/Tokyo')`;
    } else if (this.pattern.name === "タイムスタンプ_週抽出") {
      return `FORMAT_TIMESTAMP('%Y-%m-%dW', TIMESTAMP_TRUNC(${resolvedColumn.fullPhysicalName}, WEEK(MONDAY)), 'Asia/Tokyo')`;
    } else if (this.pattern.name === "タイムスタンプ_日抽出") {
      return `FORMAT_TIMESTAMP('%Y-%m-%d', ${resolvedColumn.fullPhysicalName}, 'Asia/Tokyo')`;
    } else {
      throw new Error(`${this.pattern.name}は未実装`);
    }
  }

  toSQLForRoot(context: PhraseResolutionContext): string {
    throw new Error("Method not implemented.");
  }
}
