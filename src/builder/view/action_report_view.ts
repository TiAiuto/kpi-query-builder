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
import { Group } from "../group";
import { AggregateValue } from "../value/aggregate_value";
import { AggregatePattern } from "../aggregate_pattern";

export class ActionReportView extends View {
  periodViewName: string; // 本当は事前にView作るんじゃなくて自動生成したい
  baseAction: ActionReportViewActionReference;
  relatedActions: ActionReportViewActionReference[];
  // アドネットワークの管理画面みたいにどの列でGROUP BYするかだけここに追記していけばいいのかも
  // ユーザごとに表示したい場合はGROUP BYにユーザコードも入れてもらえばいいだけ
  
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

    const periodUnitType = "タイムスタンプ_日抽出";
    const periodUnitName = "基準アクション日";
    const periodUnitAlphabetName = "base_action_date";

    const aggregatePatteren = new AggregatePattern({
      name: "COUNT_DISTINCT",
    });

    const joins: Join[] = [];
    const columns: ValueSurface[] = [
      new ValueSurface({
        // ここでどの単位で抽出するかは選択可能にするとよさそう
        name: periodUnitName,
        alphabetName: periodUnitAlphabetName,
        value: new TransformValue({
          sourceColumnName: timestampName,
          source: this.baseAction.actionName,
          pattern: new TransformPattern({ name: periodUnitType }),
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
            ...relatedAction.conditions, // ここで条件適用ではなくCOUNT時に条件適用でもよい（効率が良いほうにする）
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
          name: `関連アクション値_${index}`,
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

    resolver.addView(innerQueryView);

    const groupByValue = new SelectValue({
      sourceColumnName: periodUnitName,
      source: innerQueryView.name,
    });

    const aggregateColumns = [
      new ValueSurface({
        name: periodUnitName,
        alphabetName: periodUnitAlphabetName,
        value: groupByValue,
      }),
      new ValueSurface({
        name: `${baseActionView.name}_集計値`,
        alphabetName: `${baseActionView.alphabetName}_aggregated_value`,
        value: new AggregateValue({
          sourceColumnName: "基準アクション値",
          source: innerQueryView.name,
          pattern: aggregatePatteren,
        }),
      }),
    ];

    this.relatedActions.forEach((relatedAction, index) => {
      const relatedActionView = resolver.findView(relatedAction.actionName);
      aggregateColumns.push(
        new ValueSurface({
          name: `${relatedActionView.name}_集計値`,
          alphabetName: `${relatedActionView.alphabetName}_aggregated_value`,
          value: new AggregateValue({
            sourceColumnName: `関連アクション値_${index}`,
            source: innerQueryView.name,
            pattern: aggregatePatteren,
          }),
        })
      );
    });

    const aggregateView = new QueryView({
      name: `${this.name}_集計クエリ`,
      alphabetName: `${this.alphabetName}_aggregate_query`,
      source: innerQueryView.name,
      columnsInheritanceEnabled: false,
      columns: aggregateColumns,
      orders: [
        new Order({
          value: groupByValue,
        }),
      ],
      groups: [
        new Group({
          value: groupByValue,
        }),
      ],
    });
    resolver.addView(aggregateView);

    const resolvedAggregateView = aggregateView.resolve(resolver);

    return new ResolvedView({
      publicName: this.name,
      physicalName: this.alphabetName,
      columns: resolvedAggregateView.columns,
      sql: resolvedAggregateView.sql,
    });
  }
}
