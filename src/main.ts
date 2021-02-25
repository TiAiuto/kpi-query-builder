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

  const unionViewNames: string[] = [];

  const unionViews: View[] = [];
  const baseActionView = resolver.resolve(baseActionName);
  unionViews.push(
    new QueryView({
      name: `${baseActionView.publicName}_集計用`,
      alphabetName: `${baseActionView.physicalName}_for_aggregation`,
      source: baseActionName,
      columns: [
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
          name: `${baseActionView.publicName}_集計値`,
          alphabetName: `${baseActionView.physicalName}_aggregated_value`,
          value: new AggregateValue({
            pattern: new AggregatePattern({ name: "COUNT_DISTINCT" }),
            source: baseActionView.publicName,
            sourceColumnName: baseUnitName,
          }),
        }),
        // new ValueSurface({
        //   name: `${relatedActionView.publicName}_流入元パラメータ`,
        //   alphabetName: `${relatedActionView.physicalName}_source_param`,
        //   value: new SelectValue({
        //     source: relatedActionView.publicName,
        //     sourceColumnName: "流入元パラメータ",
        //   }),
        // }),
        new ValueSurface({
          name: "アクション種別ラベル",
          alphabetName: "action_type_label",
          value: new RawValue({ raw: `'${baseActionView.publicName}'` }),
        }),
      ],
      groups: [
        new Group({
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: baseActionName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
        // new Group({
        //   value: new SelectValue({
        //     sourceColumnName: "流入元パラメータ",
        //     source: relatedActionView.publicName,
        //   }),
        // }),
      ],
    })
  );
  unionViewNames.push(`${baseActionView.publicName}_集計用`);

  relatedActionNames.forEach((relatedActionName) => {
    const relatedActionView = resolver.resolve(relatedActionName);

    unionViews.push(
      new QueryView({
        name: `${relatedActionView.publicName}_集計用`,
        alphabetName: `${relatedActionView.physicalName}_for_aggregation`,
        source: baseActionName,
        columns: [
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
              pattern: new AggregatePattern({ name: "COUNT_DISTINCT" }),
              source: relatedActionView.publicName,
              sourceColumnName: baseUnitName,
            }),
          }),
          // new ValueSurface({
          //   name: `${relatedActionView.publicName}_流入元パラメータ`,
          //   alphabetName: `${relatedActionView.physicalName}_source_param`,
          //   value: new SelectValue({
          //     source: relatedActionView.publicName,
          //     sourceColumnName: "流入元パラメータ",
          //   }),
          // }),
          new ValueSurface({
            name: "アクション種別ラベル",
            alphabetName: "action_type_label",
            value: new RawValue({ raw: `'${relatedActionView.publicName}'` }),
          }),
        ],
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
        groups: [
          new Group({
            value: new TransformValue({
              sourceColumnName: timeColumnName,
              source: baseActionName,
              pattern: new TransformPattern({ name: periodUnitType }),
            }),
          }),
          // new Group({
          //   value: new SelectValue({
          //     sourceColumnName: "流入元パラメータ",
          //     source: relatedActionView.publicName,
          //   }),
          // }),
        ],
      })
    );
  });
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
