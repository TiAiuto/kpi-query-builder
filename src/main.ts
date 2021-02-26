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
import { DefinedMixins } from "./defined_mixins";
import { DefinedViews } from "./defined_views";
import { ResolvedView } from "./builder/resolved_view";
import { RoutineView } from "./builder/view/routine_view";
import { RoutinePattern } from "./builder/routine_pattern";
import { RawCondition } from "./builder/condition/raw_condition";
import { UnaryCondition } from "./builder/condition/unary_condition";

function main() {
  const resolver = new ViewResolver({
    mixins: DefinedMixins,
    views: DefinedViews,
  });

  const usersContractedUsageSummary = function () {
    const timeColumnName = "タイムスタンプ";
    const baseUnitName = "ユーザコード";

    const periodUnitType = "タイムスタンプ_月抽出";
    const periodUnitName = "基準アクション月";
    const periodUnitAlphabetName = "base_action_month";

    const baseActionName = "A_PLUS利用開始";

    const relatedActionNames = [
      "A_サイト内のどこかしらのページ表示",
      "A_勉強会内のどこかしらのページ表示",
      "A_勉強会過去動画内のどこかしらのページ表示",
      "A_個別ケース相談内のどこかしらのページ表示",
      "A_教材内のどこかしらのページ表示",
      "A_ヒント動画内のどこかしらのページ表示",
      "A_マイページ内のどこかしらのページ表示",
      "A_TOP表示",
      "A_マイページTOP表示",
      "A_ケース相談TOP表示",
      "A_ケース相談詳細表示",
      "A_ケース相談一次相談作成",
      "A_ケース相談一次相談申込",
      "A_ケース相談申込詳細表示",
      "A_ケース相談二次相談作成",
      "A_ケース相談二次相談提出",
      "A_勉強会リリースお知らせ開封",
      "A_勉強会TOP表示",
      "A_勉強会詳細表示",
      "A_勉強会申込",
      "A_勉強会申込詳細表示",
      "A_勉強会参加",
    ];

    const generateAggregateColumns = function (
      view: ResolvedView,
      withSourceParam: boolean,
      index: number
    ): ValueSurface[] {
      const result = [
        new ValueSurface({
          name: periodUnitName,
          alphabetName: periodUnitAlphabetName,
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: view.publicName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
        new ValueSurface({
          name: `アクション集計値`,
          alphabetName: `action_aggregated_value`,
          value: new AggregateValue({
            pattern: new AggregatePattern({
              name: "COUNT_DISTINCT",
            }),
            source: view.publicName,
            sourceColumnName: baseUnitName,
          }),
        }),
        new ValueSurface({
          name: "アクション種別ラベル",
          alphabetName: "action_type_label",
          value: new RawValue({ raw: `'${index}_${view.publicName}'` }),
        }),
      ];

      return result;
    };

    const generateGroupBy = function (
      view: ResolvedView,
      withSourceParam: boolean
    ): Group[] {
      const result = [
        new Group({
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: view.publicName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
      ];

      return result;
    };

    resolver.addView(
      new RoutineView({
        name: "集計期間基準集合クエリ",
        alphabetName: "aggregate_base_period",
        pattern: new RoutinePattern({
          name: "期間集合生成",
          args: ["月単位", "20201001", "20211231"],
        }),
      })
    );

    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "契約者分母",
          alphabetName: "contracted_users",
          source: "集計期間基準集合クエリ",
          joins: [
            new InnerJoin({
              target: "ユーザコード付きPLUS契約",
              conditions: [
                new RawCondition({
                  raw:
                    'DATE(usage_start_date_timestamp, "Asia/Tokyo") <= date_range_end AND ' +
                    '(usage_end_date_timestamp IS NULL OR date_range_end <= DATE(usage_end_date_timestamp, "Asia/Tokyo"))',
                }),
              ],
            }),
          ],
          inheritColumns: ["期間生成値"],
          columns: [
            new ValueSurface({
              name: "契約ユーザ数",
              alphabetName: "action_aggregated_value",
              value: new AggregateValue({
                sourceColumnName: "契約ユーザコード",
                pattern: new AggregatePattern({ name: "COUNT" }),
              }),
            }),

            new ValueSurface({
              name: "アクション種別ラベル",
              alphabetName: "action_type_label",
              value: new RawValue({ raw: `'0_期間内PLUS契約中'` }),
            }),
          ],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "期間生成値" }),
            }),
          ],
        }),
        ...relatedActionNames.map((relatedActionName, index) => {
          const relatedActionView = resolver.resolve(relatedActionName);
          return new QueryView({
            name: `内側関連アクション集計用`,
            alphabetName: `inner_related_for_aggregation`,
            source: relatedActionView.publicName,
            columns: generateAggregateColumns(
              relatedActionView,
              true,
              index + 1
            ),
            groups: generateGroupBy(relatedActionView, true),
            conditions: [
              new RawCondition({
                raw: 'DATE(time, "Asia/Tokyo") >= DATE("2020-10-01")',
              }),
            ],
          });
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const usersContractedUsageSummaryMoreThanMonth = function () {
    const timeColumnName = "タイムスタンプ";
    const baseUnitName = "ユーザコード";

    const periodUnitType = "タイムスタンプ_月抽出";
    const periodUnitName = "基準アクション月";
    const periodUnitAlphabetName = "base_action_month";

    const baseActionName = "A_PLUS利用開始";

    const relatedActionNames = [
      "A_サイト内のどこかしらのページ表示",
      "A_勉強会内のどこかしらのページ表示",
      "A_勉強会過去動画内のどこかしらのページ表示",
      "A_個別ケース相談内のどこかしらのページ表示",
      "A_教材内のどこかしらのページ表示",
      "A_ヒント動画内のどこかしらのページ表示",
      "A_マイページ内のどこかしらのページ表示",
      "A_TOP表示",
      "A_マイページTOP表示",
      "A_ケース相談TOP表示",
      "A_ケース相談詳細表示",
      "A_ケース相談一次相談作成",
      "A_ケース相談一次相談申込",
      "A_ケース相談申込詳細表示",
      "A_ケース相談二次相談作成",
      "A_ケース相談二次相談提出",
      "A_勉強会リリースお知らせ開封",
      "A_勉強会TOP表示",
      "A_勉強会詳細表示",
      "A_勉強会申込",
      "A_勉強会申込詳細表示",
      "A_勉強会参加",
    ];

    const generateAggregateColumns = function (
      view: ResolvedView,
      withSourceParam: boolean,
      index: number
    ): ValueSurface[] {
      const result = [
        new ValueSurface({
          name: periodUnitName,
          alphabetName: periodUnitAlphabetName,
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: view.publicName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
        new ValueSurface({
          name: `アクション集計値`,
          alphabetName: `action_aggregated_value`,
          value: new AggregateValue({
            pattern: new AggregatePattern({
              name: "COUNT_DISTINCT",
            }),
            source: view.publicName,
            sourceColumnName: baseUnitName,
          }),
        }),
        new ValueSurface({
          name: "アクション種別ラベル",
          alphabetName: "action_type_label",
          value: new RawValue({ raw: `'${index}_${view.publicName}'` }),
        }),
      ];

      return result;
    };

    const generateGroupBy = function (
      view: ResolvedView,
      withSourceParam: boolean
    ): Group[] {
      const result = [
        new Group({
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: view.publicName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
      ];

      return result;
    };

    resolver.addView(
      new RoutineView({
        name: "集計期間基準集合クエリ",
        alphabetName: "aggregate_base_period",
        pattern: new RoutinePattern({
          name: "期間集合生成",
          args: ["月単位", "20201001", "20211231"],
        }),
      })
    );

    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "契約者分母",
          alphabetName: "contracted_users",
          source: "集計期間基準集合クエリ",
          joins: [
            new InnerJoin({
              target: "ユーザコード付きPLUS契約",
              conditions: [
                new RawCondition({
                  raw:
                    'DATE(usage_start_date_timestamp, "Asia/Tokyo") <= date_range_end AND ' +
                    '(usage_end_date_timestamp IS NULL OR date_range_end <= DATE(usage_end_date_timestamp, "Asia/Tokyo"))',
                }),
              ],
            }),
          ],
          inheritColumns: ["期間生成値"],
          columns: [
            new ValueSurface({
              name: "契約ユーザ数",
              alphabetName: "action_aggregated_value",
              value: new AggregateValue({
                sourceColumnName: "契約ユーザコード",
                pattern: new AggregatePattern({ name: "COUNT" }),
              }),
            }),

            new ValueSurface({
              name: "アクション種別ラベル",
              alphabetName: "action_type_label",
              value: new RawValue({ raw: `'0_期間内PLUS契約中'` }),
            }),
          ],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "期間生成値" }),
            }),
          ],
        }),
        ...relatedActionNames.map((relatedActionName, index) => {
          const relatedActionView = resolver.resolve(relatedActionName);
          return new QueryView({
            name: `内側関連アクション集計用`,
            alphabetName: `inner_related_for_aggregation`,
            source: relatedActionView.publicName,
            columns: generateAggregateColumns(
              relatedActionView,
              true,
              index + 1
            ),
            groups: generateGroupBy(relatedActionView, true),
            conditions: [
              new UnaryCondition({
                value: new SelectValue({
                  source: relatedActionName,
                  sourceColumnName: "タイムスタンプ",
                }),
                template: 'DATE(?, "Asia/Tokyo") >= DATE("2020-10-01")',
              }),
            ],
            joins: [
              new InnerJoin({
                target: baseActionName,
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
                    template: "DATE_DIFF(DATE(?), DATE(?), MONTH) >= 1",
                  }),
                ],
              }),
            ],
          });
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const usersContractedSourceParam = function () {
    const timeColumnName = "タイムスタンプ";
    const baseUnitName = "ユーザコード";

    const periodUnitType = "タイムスタンプ_月抽出";
    const periodUnitName = "基準アクション月";
    const periodUnitAlphabetName = "base_action_month";

    const baseActionName = "A_PLUS利用開始";

    const relatedActionNames = [
      // "A_サイト内のどこかしらのページ表示",
      // "A_勉強会内のどこかしらのページ表示",
      // "A_勉強会過去動画内のどこかしらのページ表示",
      // "A_個別ケース相談内のどこかしらのページ表示",
      // "A_教材内のどこかしらのページ表示",
      // "A_ヒント動画内のどこかしらのページ表示",
      // "A_マイページ内のどこかしらのページ表示",
      "A_TOP表示",
      "A_マイページTOP表示",
      "A_ケース相談TOP表示",
      "A_ケース相談詳細表示",
      // "A_ケース相談一次相談作成",
      // "A_ケース相談一次相談申込",
      // "A_ケース相談申込詳細表示",
      // "A_ケース相談二次相談作成",
      // "A_ケース相談二次相談提出",
      "A_勉強会TOP表示",
      "A_勉強会詳細表示",
      // "A_勉強会申込",
      // "A_勉強会申込詳細表示",
      // "A_勉強会参加",
    ];

    const generateAggregateColumns = function (
      view: ResolvedView,
      withSourceParam: boolean,
      index: number
    ): ValueSurface[] {
      const result = [
        new ValueSurface({
          name: periodUnitName,
          alphabetName: periodUnitAlphabetName,
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: view.publicName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
        new ValueSurface({
          name: `アクション集計値`,
          alphabetName: `action_aggregated_value`,
          value: new AggregateValue({
            pattern: new AggregatePattern({
              name: "COUNT",
            }),
            source: view.publicName,
            sourceColumnName: baseUnitName,
          }),
        }),
        new ValueSurface({
          name: "アクション種別ラベル",
          alphabetName: "action_type_label",
          value: new RawValue({ raw: `'${index}_${view.publicName}'` }),
        }),
      ];

      if (withSourceParam) {
        result.push(
          new ValueSurface({
            name: `流入元パラメータ`,
            alphabetName: `source_param`,
            value: new TransformValue({
              source: view.publicName,
              sourceColumnName: "流入元パラメータ",
              pattern: new TransformPattern({
                name: "空白変換",
                args: ["その他"],
              }),
            }),
          })
        );
      }

      return result;
    };

    const generateGroupBy = function (
      view: ResolvedView,
      withSourceParam: boolean
    ): Group[] {
      const result = [
        new Group({
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: view.publicName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
      ];

      if (withSourceParam) {
        result.push(
          new Group({
            value: new SelectValue({
              sourceColumnName: "流入元パラメータ",
              source: view.publicName,
            }),
          })
        );
      }

      return result;
    };

    resolver.addView(
      new RoutineView({
        name: "集計期間基準集合クエリ",
        alphabetName: "aggregate_base_period",
        pattern: new RoutinePattern({
          name: "期間集合生成",
          args: ["月単位", "20210118", "20211231"],
        }),
      })
    );

    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "契約者分母",
          alphabetName: "contracted_users",
          source: "集計期間基準集合クエリ",
          joins: [
            new InnerJoin({
              target: "ユーザコード付きPLUS契約",
              conditions: [
                new RawCondition({
                  raw:
                    'DATE(usage_start_date_timestamp, "Asia/Tokyo") <= date_range_end AND ' +
                    '(usage_end_date_timestamp IS NULL OR date_range_end <= DATE(usage_end_date_timestamp, "Asia/Tokyo"))',
                }),
              ],
            }),
          ],
          inheritColumns: ["期間生成値"],
          columns: [
            new ValueSurface({
              name: "契約ユーザ数",
              alphabetName: "action_aggregated_value",
              value: new AggregateValue({
                sourceColumnName: "契約ユーザコード",
                pattern: new AggregatePattern({ name: "COUNT" }),
              }),
            }),

            new ValueSurface({
              name: "アクション種別ラベル",
              alphabetName: "action_type_label",
              value: new RawValue({ raw: `'0_期間内PLUS契約中'` }),
            }),
            new ValueSurface({
              name: "流入元パラメータ",
              alphabetName: "source_param",
              value: new RawValue({
                raw: "CAST(NULL AS STRING)",
              }),
            }),
          ],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "期間生成値" }),
            }),
          ],
        }),
        ...relatedActionNames.map((relatedActionName, index) => {
          const relatedActionView = resolver.resolve(relatedActionName);
          return new QueryView({
            name: `内側関連アクション集計用`,
            alphabetName: `inner_related_for_aggregation`,
            source: relatedActionView.publicName,
            columns: generateAggregateColumns(
              relatedActionView,
              true,
              index + 1
            ),
            groups: generateGroupBy(relatedActionView, true),
            conditions: [
              new UnaryCondition({
                value: new SelectValue({
                  source: relatedActionName,
                  sourceColumnName: "タイムスタンプ",
                }),
                template: 'DATE(?, "Asia/Tokyo") >= DATE("2021-01-18")',
              }),
            ],
          });
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const usersContractedSourceParamEachService = function () {
    const timeColumnName = "タイムスタンプ";
    const baseUnitName = "ユーザコード";

    const periodUnitType = "タイムスタンプ_週抽出";
    const periodUnitName = "基準アクション月";
    const periodUnitAlphabetName = "base_action_month";

    const baseActionName = "A_PLUS利用開始";

    const relatedActionNames = [
      // "A_サイト内のどこかしらのページ表示",
      // "A_勉強会内のどこかしらのページ表示",
      // "A_勉強会過去動画内のどこかしらのページ表示",
      // "A_個別ケース相談内のどこかしらのページ表示",
      // "A_教材内のどこかしらのページ表示",
      // "A_ヒント動画内のどこかしらのページ表示",
      // "A_マイページ内のどこかしらのページ表示",
      // "A_TOP表示",
      "A_マイページTOP表示",
      // "A_ケース相談TOP表示",
      // "A_ケース相談詳細表示",
      // "A_ケース相談一次相談作成",
      // "A_ケース相談一次相談申込",
      // "A_ケース相談申込詳細表示",
      // "A_ケース相談二次相談作成",
      // "A_ケース相談二次相談提出",
      // "A_勉強会TOP表示",
      // "A_勉強会詳細表示",
      // "A_勉強会申込",
      // "A_勉強会申込詳細表示",
      // "A_勉強会参加",
    ];

    const generateAggregateColumns = function (
      view: ResolvedView,
      withSourceParam: boolean,
      index: number
    ): ValueSurface[] {
      const result = [
        new ValueSurface({
          name: periodUnitName,
          alphabetName: periodUnitAlphabetName,
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: view.publicName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
        new ValueSurface({
          name: `アクション集計値`,
          alphabetName: `action_aggregated_value`,
          value: new AggregateValue({
            pattern: new AggregatePattern({
              name: "COUNT",
            }),
            source: view.publicName,
            sourceColumnName: baseUnitName,
          }),
        }),
        new ValueSurface({
          name: "アクション種別ラベル",
          alphabetName: "action_type_label",
          value: new RawValue({ raw: `'${index}_${view.publicName}'` }),
        }),
      ];

      if (withSourceParam) {
        result.push(
          new ValueSurface({
            name: `流入元パラメータ`,
            alphabetName: `source_param`,
            value: new TransformValue({
              source: view.publicName,
              sourceColumnName: "流入元パラメータ",
              pattern: new TransformPattern({
                name: "空白変換",
                args: ["その他"],
              }),
            }),
          })
        );
      }

      return result;
    };

    const generateGroupBy = function (
      view: ResolvedView,
      withSourceParam: boolean
    ): Group[] {
      const result = [
        new Group({
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: view.publicName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
      ];

      if (withSourceParam) {
        result.push(
          new Group({
            value: new SelectValue({
              sourceColumnName: "流入元パラメータ",
              source: view.publicName,
            }),
          })
        );
      }

      return result;
    };

    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        ...relatedActionNames.map((relatedActionName, index) => {
          const relatedActionView = resolver.resolve(relatedActionName);
          return new QueryView({
            name: `内側関連アクション集計用`,
            alphabetName: `inner_related_for_aggregation`,
            source: relatedActionView.publicName,
            columns: generateAggregateColumns(
              relatedActionView,
              true,
              index + 1
            ),
            groups: generateGroupBy(relatedActionView, true),
            conditions: [
              new UnaryCondition({
                value: new SelectValue({
                  source: relatedActionName,
                  sourceColumnName: "タイムスタンプ",
                }),
                template: 'DATE(?, "Asia/Tokyo") >= DATE("2021-01-18")',
              }),
            ],
          });
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const usersContractedSourceParamMoreThanMonth = function () {
    const timeColumnName = "タイムスタンプ";
    const baseUnitName = "ユーザコード";

    const periodUnitType = "タイムスタンプ_月抽出";
    const periodUnitName = "基準アクション月";
    const periodUnitAlphabetName = "base_action_month";

    const baseActionName = "A_PLUS利用開始";

    const relatedActionNames = [
      // "A_サイト内のどこかしらのページ表示",
      // "A_勉強会内のどこかしらのページ表示",
      // "A_勉強会過去動画内のどこかしらのページ表示",
      // "A_個別ケース相談内のどこかしらのページ表示",
      // "A_教材内のどこかしらのページ表示",
      // "A_ヒント動画内のどこかしらのページ表示",
      // "A_マイページ内のどこかしらのページ表示",
      "A_TOP表示",
      "A_マイページTOP表示",
      "A_ケース相談TOP表示",
      "A_ケース相談詳細表示",
      // "A_ケース相談一次相談作成",
      // "A_ケース相談一次相談申込",
      // "A_ケース相談申込詳細表示",
      // "A_ケース相談二次相談作成",
      // "A_ケース相談二次相談提出",
      "A_勉強会TOP表示",
      "A_勉強会詳細表示",
      // "A_勉強会申込",
      // "A_勉強会申込詳細表示",
      // "A_勉強会参加",
    ];

    const generateAggregateColumns = function (
      view: ResolvedView,
      withSourceParam: boolean,
      index: number
    ): ValueSurface[] {
      const result = [
        new ValueSurface({
          name: periodUnitName,
          alphabetName: periodUnitAlphabetName,
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: view.publicName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
        new ValueSurface({
          name: `アクション集計値`,
          alphabetName: `action_aggregated_value`,
          value: new AggregateValue({
            pattern: new AggregatePattern({
              name: "COUNT",
            }),
            source: view.publicName,
            sourceColumnName: baseUnitName,
          }),
        }),
        new ValueSurface({
          name: "アクション種別ラベル",
          alphabetName: "action_type_label",
          value: new RawValue({ raw: `'${index}_${view.publicName}'` }),
        }),
      ];

      if (withSourceParam) {
        result.push(
          new ValueSurface({
            name: `流入元パラメータ`,
            alphabetName: `source_param`,
            value: new TransformValue({
              source: view.publicName,
              sourceColumnName: "流入元パラメータ",
              pattern: new TransformPattern({
                name: "空白変換",
                args: ["その他"],
              }),
            }),
          })
        );
      }

      return result;
    };

    const generateGroupBy = function (
      view: ResolvedView,
      withSourceParam: boolean
    ): Group[] {
      const result = [
        new Group({
          value: new TransformValue({
            sourceColumnName: timeColumnName,
            source: view.publicName,
            pattern: new TransformPattern({ name: periodUnitType }),
          }),
        }),
      ];

      if (withSourceParam) {
        result.push(
          new Group({
            value: new SelectValue({
              sourceColumnName: "流入元パラメータ",
              source: view.publicName,
            }),
          })
        );
      }

      return result;
    };

    resolver.addView(
      new RoutineView({
        name: "集計期間基準集合クエリ",
        alphabetName: "aggregate_base_period",
        pattern: new RoutinePattern({
          name: "期間集合生成",
          args: ["月単位", "20210118", "20211231"],
        }),
      })
    );

    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "契約者分母",
          alphabetName: "contracted_users",
          source: "集計期間基準集合クエリ",
          joins: [
            new InnerJoin({
              target: "ユーザコード付きPLUS契約",
              conditions: [
                new RawCondition({
                  raw:
                    'DATE(usage_start_date_timestamp, "Asia/Tokyo") <= date_range_end AND ' +
                    '(usage_end_date_timestamp IS NULL OR date_range_end <= DATE(usage_end_date_timestamp, "Asia/Tokyo"))',
                }),
              ],
            }),
          ],
          inheritColumns: ["期間生成値"],
          columns: [
            new ValueSurface({
              name: "契約ユーザ数",
              alphabetName: "action_aggregated_value",
              value: new AggregateValue({
                sourceColumnName: "契約ユーザコード",
                pattern: new AggregatePattern({ name: "COUNT" }),
              }),
            }),

            new ValueSurface({
              name: "アクション種別ラベル",
              alphabetName: "action_type_label",
              value: new RawValue({ raw: `'0_期間内PLUS契約中'` }),
            }),
            new ValueSurface({
              name: "流入元パラメータ",
              alphabetName: "source_param",
              value: new RawValue({
                raw: "CAST(NULL AS STRING)",
              }),
            }),
          ],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "期間生成値" }),
            }),
          ],
        }),
        ...relatedActionNames.map((relatedActionName, index) => {
          const relatedActionView = resolver.resolve(relatedActionName);
          return new QueryView({
            name: `内側関連アクション集計用`,
            alphabetName: `inner_related_for_aggregation`,
            source: relatedActionView.publicName,
            columns: generateAggregateColumns(
              relatedActionView,
              true,
              index + 1
            ),
            groups: generateGroupBy(relatedActionView, true),
            conditions: [
              new UnaryCondition({
                value: new SelectValue({
                  source: relatedActionName,
                  sourceColumnName: "タイムスタンプ",
                }),
                template: 'DATE(?, "Asia/Tokyo") >= DATE("2021-01-18")',
              }),
            ],
            joins: [
              new InnerJoin({
                target: baseActionName,
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
                    template: "DATE_DIFF(DATE(?), DATE(?), MONTH) >= 1",
                  }),
                ],
              }),
            ],
          });
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };


  const usersAfterContract = function () {
    const timeColumnName = "タイムスタンプ";
    const baseUnitName = "ユーザコード";

    const periodUnitType = "タイムスタンプ_月抽出"; // 週単位も可
    const periodUnitName = "基準アクション月";
    const periodUnitAlphabetName = "month";

    const baseActionName = "A_PLUS利用開始";

    const relatedActionNames = [
      "A_サイト内のどこかしらのページ表示",
      // "A_勉強会内のどこかしらのページ表示",
      // "A_勉強会過去動画内のどこかしらのページ表示",
      // "A_個別ケース相談内のどこかしらのページ表示",
      "A_教材内のどこかしらのページ表示",
      "A_ヒント動画内のどこかしらのページ表示",
      // "A_マイページ内のどこかしらのページ表示",
      "A_WELCOMEスライド完了",
      "A_勉強会モーダル完了",
      "A_個別ケース相談モーダル完了",
      "A_TOP表示",
      "A_マイページTOP表示",
      "A_ケース相談TOP表示",
      "A_ケース相談詳細表示",
      "A_ケース相談一次相談作成",
      "A_ケース相談一次相談申込",
      "A_ケース相談申込詳細表示",
      "A_ケース相談二次相談作成",
      "A_ケース相談二次相談提出",
      "A_勉強会リリースお知らせ開封",
      "A_勉強会TOP表示",
      "A_勉強会詳細表示",
      "A_勉強会申込",
      "A_勉強会申込詳細表示",
      "A_勉強会参加",
    ];

    const generateAggregateColumns = function (
      view: ResolvedView,
      index: number
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
            pattern: new AggregatePattern({ name: "COUNT_DISTINCT" }),
            source: view.publicName,
            sourceColumnName: baseUnitName,
          }),
        }),
        // new ValueSurface({
        //   name: `流入元パラメータ`,
        //   alphabetName: `source_param`,
        //   value: new SelectValue({
        //     source: view.publicName,
        //     sourceColumnName: "流入元パラメータ",
        //   }),
        // }),
        new ValueSurface({
          name: "アクション種別ラベル",
          alphabetName: "action",
          value: new RawValue({ raw: `'${index}_${view.publicName}'` }),
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
        // new Group({
        //   value: new SelectValue({
        //     sourceColumnName: "流入元パラメータ",
        //     source: view.publicName,
        //   }),
        // }),
      ];
    };

    const baseActionView = resolver.resolve(baseActionName);
    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: `内側基準集計用`,
          alphabetName: `inner_base_for_aggregation`,
          source: baseActionName,
          columns: generateAggregateColumns(baseActionView, 0),
          groups: generateGroupBy(baseActionView),
          conditions: [
            new UnaryCondition({
              template: 'DATE(?, "Asia/Tokyo") >= DATE("2020-10-01")',
              value: new SelectValue({
                sourceColumnName: "タイムスタンプ",
                source: baseActionName,
              }),
            }),
          ],
        }),
        ...relatedActionNames.map((relatedActionName, index) => {
          const relatedActionView = resolver.resolve(relatedActionName);
          return new QueryView({
            name: `内側関連アクション集計用`,
            alphabetName: `inner_related_for_aggregation`,
            source: baseActionName,
            columns: generateAggregateColumns(relatedActionView, index + 1),
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
                    template: "DATE_DIFF(DATE(?), DATE(?), MONTH) < 1",
                  }),
                ],
              }),
            ],
            conditions: [
              new UnaryCondition({
                template: 'DATE(?, "Asia/Tokyo") >= DATE("2020-10-01")',
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                  source: baseActionName,
                }),
              }),
            ],
            groups: generateGroupBy(relatedActionView),
          });
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  usersAfterContract();
  // usersContractedSourceParam();
  // usersContractedUsageSummary();
  // usersContractedSourceParamMoreThanMonth();
  // usersContractedUsageSummaryMoreThanMonth();
  // usersContractedSourceParamEachService();

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
