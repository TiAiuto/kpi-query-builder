import { Condition } from "../condition/condition";
import { ExtractedColumn } from "../extracted_column";
import { Join } from "../join/join";
import { MixinUsage } from "../mixin_usage";
import { PhraseResolutionContext } from "../phrase_resolution_context";
import { ResolvedReference } from "../resolved_reference";
import { ResolvedView } from "../resolved_view";
import { RawValue } from "../value/raw_value";
import { ValueSurface } from "../value_surface";
import { ViewResolver } from "../view_resolver";
import { View, ViewArgs } from "./view";

export class RootView extends View {
  mixinUsages: MixinUsage[];
  conditions: Condition[];
  joins: Join[];
  physicalSource: string;
  physicalSourceAlias: string;
  dateSuffixEnabled: boolean;
  columns: ValueSurface[];

  constructor({
    mixinUsages = [],
    conditions = [],
    joins = [],
    physicalSource,
    physicalSourceAlias,
    dateSuffixEnabled,
    columns,
    ...args
  }: ViewArgs & {
    mixinUsages?: MixinUsage[];
    conditions?: Condition[];
    joins?: Join[];
    physicalSource: string;
    physicalSourceAlias: string;
    dateSuffixEnabled: boolean;
    columns: ValueSurface[];
  }) {
    super({
      ...args,
      type: "root",
    });
    this.mixinUsages = mixinUsages;
    this.conditions = conditions;
    this.joins = joins;
    this.physicalSource = physicalSource;
    this.physicalSourceAlias = physicalSourceAlias;
    this.dateSuffixEnabled = dateSuffixEnabled;
    this.columns = columns;
  }

  private buildColumns(context: PhraseResolutionContext): ExtractedColumn[] {
    return this.columns.map((column) => {
      if (column.value instanceof RawValue) {
        return new ExtractedColumn({
          publicName: column.name,
          physicalName: column.alphabetName,
          selectSQL: column.value.toSQL(context), // RawValueはselectを想定しているがWHEREなどでも動くはず
        });
      } else {
        throw new Error("Raw Value以外のcolumn指定は未対応");
      }
    });
  }

  private buildResolvedReference(resolver: ViewResolver): ResolvedReference {
    const jointConditions = [...this.conditions];
    const jointJoins = [...this.joins];
    this.mixinUsages.forEach((mixinUsage) => {
      const mixin = resolver.findMixin(mixinUsage.name);
      jointConditions.push(...mixin.conditions);
      jointJoins.push(...mixin.joins);
    });

    // rootではraw以外のjoin, conditionは使わない想定
    const joinPhrases = jointJoins.map((join) => join.toSQLForRoot());
    const conditionPhrases = jointConditions.map((condition) =>
      condition.toSQLForRoot()
    );

    const phraseResolutionContext = new PhraseResolutionContext({
      currentView: this,
      resolver,
      availableColumns: [], // Root Viewでは特になし＆rawを使う想定
    });

    return new ResolvedReference({
      columns: this.buildColumns(phraseResolutionContext),
      physicalSource: this.physicalSource,
      physicalSourceAlias: this.physicalSourceAlias,
      joinPhrases,
      conditionPhrases,
      groupPhrases: [],
      orderPhrases: [],
    });
  }

  resolve(resolver: ViewResolver): ResolvedView {
    const resolvedReference = this.buildResolvedReference(resolver);

    return new ResolvedView({
      publicName: this.name,
      physicalName: this.alphabetName,
      columns: resolvedReference.columns,
      sql: resolvedReference.toSQL(),
    });
  }
}
