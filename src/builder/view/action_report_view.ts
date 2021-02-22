import { View, ViewArgs } from "./view";
import { ViewResolver } from "../view_resolver";
import { ResolvedView } from "../resolved_view";
import { ActionReportViewActionReference } from "../action_report_view_action_reference";
import { QueryView } from "./query_view";
import { LeftJoin } from "../join/left_join";
import { EqCondition } from "../condition/eq_condition";
import { SelectValue } from "../value/select_value";
import { Join } from "../join/join";
import { ValueSurface } from "../value_surface";
import { TransformValue } from "../value/transform_value";
import { TransformPattern } from "../transform_pattern";
import { Order } from "../order";

export class ActionReportView extends View {
  periodViewName: string; // 本当は事前にView作るんじゃなくて自動生成したい
  baseAction: ActionReportViewActionReference;
  relatedActions: ActionReportViewActionReference[];
  // ここでカウントするかしないか、するならユニークでカウントするかを持ちたい
  // 単位を日単位、週単位、月単位で分けたい

  constructor({
    periodViewName,
    baseAction,
    relatedActions,
    ...args
  }: ViewArgs & {
    periodViewName: string;
    baseAction: ActionReportViewActionReference;
    relatedActions: ActionReportViewActionReference[];
  }) {
    super({ ...args, type: "action_report" });
    this.periodViewName = periodViewName;
    this.baseAction = baseAction;
    this.relatedActions = relatedActions;
  }

  resolve(resolver: ViewResolver): ResolvedView {
    const baseActionView = resolver.findView(this.baseAction.actionName);
    const baseUnitName = "ユーザコード";
    const timestampName = "タイムスタンプ";
    const joins: Join[] = [];
    const columns: ValueSurface[] = [
      new ValueSurface({
        // ここでどの単位で抽出するかは選択可能にするとよさそう
        name: "基準アクション日",
        alphabetName: "base_action_date",
        value: new TransformValue({
          sourceColumnName: timestampName,
          source: this.baseAction.actionName,
          pattern: new TransformPattern({ name: "タイムスタンプ_日抽出" }),
        }),
      }),
      new ValueSurface({
        name: "基準アクション値",
        alphabetName: `${baseActionView.alphabetName}_base_unit_value`,
        value: new SelectValue({
          sourceColumnName: baseUnitName,
          source: this.baseAction.actionName,
        }),
      }),
    ];
    this.relatedActions.forEach((relatedAction, index) => {
      const relatedActionView = resolver.findView(relatedAction.actionName);
      joins.push(
        new LeftJoin({
          target: relatedAction.actionName,
          conditions: [
            ...relatedAction.conditions,
            new EqCondition({
              value: new SelectValue({
                sourceColumnName: baseUnitName,
                source: this.baseAction.actionName,
              }),
              otherValue: new SelectValue({
                sourceColumnName: baseUnitName,
                source:
                  relatedAction.actionNameAlias || relatedAction.actionName,
              }),
            }),
          ],
          publicNameAlias: relatedAction.actionNameAlias,
          physicalNameAlias: `${relatedActionView.alphabetName}_index_${index}`,
        })
      );
      columns.push(
        new ValueSurface({
          name: "関連アクション値",
          alphabetName: `${relatedActionView.alphabetName}_base_unit_value_index_${index}`,
          value: new SelectValue({
            source: relatedAction.actionNameAlias || relatedAction.actionName,
            sourceColumnName: baseUnitName,
          }),
        })
      );
    });

    const innerQueryView = new QueryView({
      name: `${this.name}_内側クエリ`,
      alphabetName: `${this.alphabetName}_inner_query`,
      source: this.baseAction.actionName,
      conditions: [...this.baseAction.conditions],
      columnsInheritanceEnabled: false,
      columns,
      joins,
      orders: [
        new Order({
          value: new SelectValue({
            sourceColumnName: timestampName,
            source: this.baseAction.actionName,
          }),
        }),
      ],
    });

    return new ResolvedView({
      publicName: this.name,
      physicalName: this.alphabetName,
      columns: [],
      sql: innerQueryView.resolve(resolver).sql, // TODO: 実装
    });
  }
}
