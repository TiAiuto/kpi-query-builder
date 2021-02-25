import { RawValue } from "./builder/value/raw_value";
import { ValueSurface } from "./builder/value_surface";
import { ViewResolver } from "./builder/view_resolver";
import { QueryView } from "./builder/view/query_view";
import { SelectValue } from "./builder/value/select_value";
import { TransformValue } from "./builder/value/transform_value";
import { TransformPattern } from "./builder/transform_pattern";
import { BinomialCondition } from "./builder/condition/binomial_condition";
import { EqCondition } from "./builder/condition/eq_condition";
import { Group } from "./builder/group";
import { AggregateValue } from "./builder/value/aggregate_value";
import { AggregatePattern } from "./builder/aggregate_pattern";
import { InnerJoin } from "./builder/join/inner_join";
import { UnionView } from "./builder/view/union_view";
import { View } from "./builder/view/view";
import { DefinedMixins } from "./defined_mixins";
import { DefinedViews } from "./defined_views";
import { ResolvedView } from "./builder/resolved_view";

function main() {
  const resolver = new ViewResolver({
    mixins: DefinedMixins,
    views: DefinedViews,
  });

  const timeColumnName = "タイムスタンプ";
  const baseUnitName = "ユーザコード";

  const periodUnitType = "タイムスタンプ_月抽出";
  const periodUnitName = "基準アクション月";
  const periodUnitAlphabetName = "base_action_month";

  const baseActionName = "A_PLUS利用開始";
  const relatedActionNames = [
    "A_概観_サイト内の任意ページ表示",
    "A_概観_勉強会内の任意ページ表示",
    "A_概観_勉強会過去動画内の任意ページ表示",
    "A_概観_個別ケース相談内の任意ページ表示",
    "A_概観_教材内の任意ページ表示",
    "A_概観_ヒント動画内の任意ページ表示",
    "A_概観_マイページ内の任意ページ表示",
    "A_TOP表示",
    "A_マイページTOP表示",
    "A_ケース相談TOP表示",
    "A_ケース相談詳細表示",
    "A_ケース相談一次相談作成",
    "A_ケース相談一次相談申込",
    "A_ケース相談申込詳細表示",
    "A_ケース相談二次相談作成",
    "A_ケース相談二次相談提出",
    "A_勉強会TOP表示",
    "A_勉強会詳細表示",
    "A_勉強会申込",
    "A_勉強会申込詳細表示",
    "A_勉強会参加",
  ];

  const generateAggregateColumns = function (
    view: ResolvedView
  ): ValueSurface[] {
    return [
      new ValueSurface({
        name: periodUnitName,
        alphabetName: periodUnitAlphabetName,
        value: new TransformValue({
          sourceColumnName: timeColumnName,
          source: baseActionName,
          pattern: new TransformPattern({ name: periodUnitType }),
        }),
      }),
      new ValueSurface({
        name: `アクション集計値`,
        alphabetName: `action_aggregated_value`,
        value: new AggregateValue({
          pattern: new AggregatePattern({ name: "COUNT" }),
          source: view.publicName,
          sourceColumnName: baseUnitName,
        }),
      }),
      new ValueSurface({
        name: `流入元パラメータ`,
        alphabetName: `source_param`,
        value: new SelectValue({
          source: view.publicName,
          sourceColumnName: "流入元パラメータ",
        }),
      }),
      new ValueSurface({
        name: "アクション種別ラベル",
        alphabetName: "action_type_label",
        value: new RawValue({ raw: `'${view.publicName}'` }),
      }),
    ];
  };

  const generateGroupBy = function (view: ResolvedView): Group[] {
    return [
      new Group({
        value: new TransformValue({
          sourceColumnName: timeColumnName,
          source: baseActionName,
          pattern: new TransformPattern({ name: periodUnitType }),
        }),
      }),
      new Group({
        value: new SelectValue({
          sourceColumnName: "流入元パラメータ",
          source: view.publicName,
        }),
      }),
    ];
  };

  const baseActionView = resolver.resolve(baseActionName);

  const unionViews: View[] = [
    new QueryView({
      name: `内側基準集計用`,
      alphabetName: `inner_base_for_aggregation`,
      source: baseActionName,
      columns: generateAggregateColumns(baseActionView),
      groups: generateGroupBy(baseActionView),
    }),
    ...relatedActionNames.map((relatedActionName) => {
      const relatedActionView = resolver.resolve(relatedActionName);
      return new QueryView({
        name: `内側関連アクション集計用`,
        alphabetName: `inner_related_for_aggregation`,
        source: baseActionName,
        columns: generateAggregateColumns(relatedActionView),
        joins: [
          new InnerJoin({
            target: relatedActionView.publicName,
            conditions: [
              new EqCondition({
                value: new SelectValue({
                  sourceColumnName: baseUnitName,
                  source: baseActionName,
                }),
                otherValue: new SelectValue({
                  sourceColumnName: baseUnitName,
                  source: relatedActionView.publicName,
                }),
              }),
              new BinomialCondition({
                value: new SelectValue({
                  sourceColumnName: timeColumnName,
                  source: relatedActionView.publicName,
                }),
                otherValue: new SelectValue({
                  sourceColumnName: timeColumnName,
                  source: baseActionName,
                }),
                template: "DATE_DIFF(DATE(?), DATE(?), MONTH) <= 1",
              }),
            ],
          }),
        ],
        groups: generateGroupBy(relatedActionView),
      });
    }),
  ];

  const reportUnionView = new UnionView({
    name: "集計クエリ",
    alphabetName: "aggregated_view",
    views: unionViews,
  });
  resolver.addView(reportUnionView);

  const bootstrapViewName = "集計クエリ";

  const outputResolvedView = resolver.resolve(bootstrapViewName);
  const withQueries = resolver.resolvedViews
    .map(
      (resolvedView) =>
        `${resolvedView.physicalName} AS ( ${resolvedView.sql} )`
    )
    .join(", \n\n");
  console.log("WITH ");
  console.log(withQueries);
  console.log(`SELECT * FROM ${outputResolvedView.physicalName};`);
}
main();
