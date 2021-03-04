import { RawValue } from "./builder/value/raw_value";
import { ValueSurface } from "./builder/value_surface";
import { ViewResolver } from "./builder/view_resolver";
import { QueryView } from "./builder/view/query_view";
import { SelectValue } from "./builder/value/select_value";
import { TransformValue } from "./builder/value/transform_value";
import { TransformPattern } from "./builder/transform_pattern";
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
import { PlaceholderCondition } from "./builder/condition/placeholder_condition";
import { EqCondition } from "./builder/condition/eq_condition";
import { ConstStringValue } from "./builder/value/const_string_value";

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
      "A_何かしらのお知らせ開封",
      "A_ケース相談TOP表示",
      "A_ケース相談詳細表示",
      "A_ケース相談一次相談作成",
      "A_ケース相談一次相談申込",
      // "A_ケース相談申込詳細表示",
      "A_ケース相談二次相談作成",
      "A_ケース相談二次相談提出",
      "A_勉強会リリースお知らせ開封",
      "A_勉強会TOP表示",
      "A_勉強会詳細表示",
      "A_勉強会申込",
      "A_勉強会申込詳細表示",
      "A_勉強会参加",
      "A_過去動画TOP表示",
      "A_勉強会過去動画再生開始",
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
            value: new SelectValue({
              sourceColumnName: timeColumnName,
              source: view.publicName,
            }),
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
            value: new SelectValue({
              source: view.publicName,
              sourceColumnName: baseUnitName,
            }),
          }),
        }),
        new ValueSurface({
          name: "アクション種別ラベル",
          alphabetName: "action",
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
            value: new SelectValue({
              sourceColumnName: timeColumnName,
              source: view.publicName,
            }),
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
                new PlaceholderCondition({
                  template: 'DATE(?, "Asia/Tokyo") <= ?',
                  values: [
                    new SelectValue({
                      sourceColumnName: "利用開始日タイムスタンプ",
                    }),
                    new SelectValue({ sourceColumnName: "終端日付" }),
                  ],
                }),
                new PlaceholderCondition({
                  template:
                    '? <= IFNULL(DATE(?, "Asia/Tokyo"), DATE("2099-12-31"))',
                  values: [
                    new SelectValue({ sourceColumnName: "終端日付" }),
                    new SelectValue({
                      sourceColumnName: "利用終了日タイムスタンプ",
                    }),
                  ],
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
                value: new SelectValue({
                  sourceColumnName: "契約ユーザコード",
                }),
                pattern: new AggregatePattern({ name: "COUNT" }),
              }),
            }),

            new ValueSurface({
              name: "アクション種別ラベル",
              alphabetName: "action",
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
      "A_何かしらのお知らせ開封",
      "A_ケース相談TOP表示",
      "A_ケース相談詳細表示",
      "A_ケース相談一次相談作成",
      "A_ケース相談一次相談申込",
      // "A_ケース相談申込詳細表示",
      "A_ケース相談二次相談作成",
      "A_ケース相談二次相談提出",
      "A_勉強会リリースお知らせ開封",
      "A_勉強会TOP表示",
      "A_勉強会詳細表示",
      "A_勉強会申込",
      "A_勉強会申込詳細表示",
      "A_勉強会参加",
      "A_過去動画TOP表示",
      "A_勉強会過去動画再生開始",
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
            value: new SelectValue({
              sourceColumnName: timeColumnName,
              source: view.publicName,
            }),
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
            value: new SelectValue({
              source: view.publicName,
              sourceColumnName: baseUnitName,
            }),
          }),
        }),
        new ValueSurface({
          name: "アクション種別ラベル",
          alphabetName: "action",
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
            pattern: new TransformPattern({ name: periodUnitType }),
            value: new SelectValue({
              sourceColumnName: timeColumnName,
              source: view.publicName,
            }),
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
                new PlaceholderCondition({
                  template: 'DATE(?, "Asia/Tokyo") <= ?',
                  values: [
                    new SelectValue({
                      sourceColumnName: "利用開始日タイムスタンプ",
                    }),
                    new SelectValue({ sourceColumnName: "終端日付" }),
                  ],
                }),
                new PlaceholderCondition({
                  template:
                    '? <= IFNULL(DATE(?, "Asia/Tokyo"), DATE("2099-12-31"))',
                  values: [
                    new SelectValue({ sourceColumnName: "終端日付" }),
                    new SelectValue({
                      sourceColumnName: "利用終了日タイムスタンプ",
                    }),
                  ],
                }),
                new PlaceholderCondition({
                  template: 'DATE_DIFF(?, DATE(?, "Asia/Tokyo"), MONTH) >= 2',
                  values: [
                    new SelectValue({ sourceColumnName: "始端日付" }),
                    new SelectValue({
                      sourceColumnName: "利用開始日タイムスタンプ",
                    }),
                  ],
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
                pattern: new AggregatePattern({ name: "COUNT" }),
                value: new SelectValue({
                  sourceColumnName: "契約ユーザコード",
                }),
              }),
            }),

            new ValueSurface({
              name: "アクション種別ラベル",
              alphabetName: "action",
              value: new RawValue({ raw: `'0_期間内PLUS契約2ヶ月目以降'` }),
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
              new PlaceholderCondition({
                values: [
                  new SelectValue({
                    source: relatedActionName,
                    sourceColumnName: "タイムスタンプ",
                  }),
                ],
                template: 'DATE(?, "Asia/Tokyo") >= DATE("2020-10-01")',
              }),
            ],
            joins: [
              new InnerJoin({
                target: baseActionName,
                conditions: [
                  new EqCondition({
                    values: [
                      new SelectValue({
                        sourceColumnName: baseUnitName,
                        source: baseActionName,
                      }),
                      new SelectValue({
                        sourceColumnName: baseUnitName,
                        source: relatedActionView.publicName,
                      }),
                    ],
                  }),
                  new PlaceholderCondition({
                    values: [
                      new SelectValue({
                        sourceColumnName: timeColumnName,
                        source: relatedActionView.publicName,
                      }),
                      new SelectValue({
                        sourceColumnName: timeColumnName,
                        source: baseActionName,
                      }),
                    ],
                    template: "DATE_DIFF(DATE(?), DATE(?), MONTH) >= 2",
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

  const usersContractedSourceParamAfterMonth = function () {
    const timeColumnName = "タイムスタンプ";
    const baseUnitName = "ユーザコード";

    const periodUnitType = "タイムスタンプ_週抽出";
    const periodUnitName = "基準アクション月";
    const periodUnitAlphabetName = "base_action_month";

    const baseActionName = "A_PLUS利用開始";

    const relatedActionNames = [
      "A_TOP表示",
      "A_マイページTOP表示",
      "A_ケース相談TOP表示",
      "A_ケース相談詳細表示",
      "A_勉強会TOP表示",
      "A_勉強会詳細表示",
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
            pattern: new TransformPattern({ name: periodUnitType }),
            value: new SelectValue({
              sourceColumnName: timeColumnName,
              source: view.publicName,
            }),
          }),
        }),
        new ValueSurface({
          name: `アクション集計値`,
          alphabetName: `action_pv`,
          value: new AggregateValue({
            pattern: new AggregatePattern({
              name: "COUNT",
            }),
            value: new SelectValue({
              source: view.publicName,
              sourceColumnName: baseUnitName,
            }),
          }),
        }),
        new ValueSurface({
          name: `アクション集計値`,
          alphabetName: `action_uu`,
          value: new AggregateValue({
            pattern: new AggregatePattern({
              name: "COUNT_DISTINCT",
            }),
            value: new SelectValue({
              source: view.publicName,
              sourceColumnName: baseUnitName,
            }),
          }),
        }),
        new ValueSurface({
          name: "アクション種別ラベル",
          alphabetName: "action",
          value: new RawValue({ raw: `'${index}_${view.publicName}'` }),
        }),
      ];

      if (withSourceParam) {
        result.push(
          new ValueSurface({
            name: `流入元パラメータ`,
            alphabetName: `source`,
            value: new TransformValue({
              pattern: new TransformPattern({
                name: "空白変換",
                args: ["その他"],
              }),
              value: new SelectValue({
                source: view.publicName,
                sourceColumnName: "流入元パラメータ",
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
            pattern: new TransformPattern({ name: periodUnitType }),
            value: new SelectValue({
              sourceColumnName: timeColumnName,
              source: view.publicName,
            }),
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
              new PlaceholderCondition({
                values: [
                  new SelectValue({
                    source: relatedActionName,
                    sourceColumnName: "タイムスタンプ",
                  }),
                ],
                template: 'DATE(?, "Asia/Tokyo") >= DATE("2021-01-18")',
              }),
            ],
            // join以下をコメントアウトすれば2ヶ月前の縛りなしの数値が出る
            // joins: [
            //   new InnerJoin({
            //     target: baseActionName,
            //     conditions: [
            //       new EqCondition({
            //         value: new SelectValue({
            //           sourceColumnName: baseUnitName,
            //           source: baseActionName,
            //         }),
            //         otherValue: new SelectValue({
            //           sourceColumnName: baseUnitName,
            //           source: relatedActionView.publicName,
            //         }),
            //       }),
            //       new BinomialCondition({
            //         value: new SelectValue({
            //           sourceColumnName: timeColumnName,
            //           source: relatedActionView.publicName,
            //         }),
            //         otherValue: new SelectValue({
            //           sourceColumnName: timeColumnName,
            //           source: baseActionName,
            //         }),
            //         template: "DATE_DIFF(DATE(?), DATE(?), MONTH) >= 2",
            //       }),
            //     ],
            //   }),
            // ],
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
      // "A_TOP表示",
      // "A_マイページTOP表示",
      // "A_ケース相談TOP表示",
      // "A_ケース相談詳細表示",
      "A_勉強会TOP表示",
      // "A_勉強会詳細表示",
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
            pattern: new TransformPattern({ name: periodUnitType }),
            value: new SelectValue({
              sourceColumnName: timeColumnName,
              source: view.publicName,
            }),
          }),
        }),
        new ValueSurface({
          name: `アクション集計値`,
          alphabetName: `action_pv`,
          value: new AggregateValue({
            pattern: new AggregatePattern({
              name: "COUNT",
            }),
            value: new SelectValue({
              source: view.publicName,
              sourceColumnName: baseUnitName,
            }),
          }),
        }),
        new ValueSurface({
          name: `アクション集計値`,
          alphabetName: `action_uu`,
          value: new AggregateValue({
            pattern: new AggregatePattern({
              name: "COUNT_DISTINCT",
            }),
            value: new SelectValue({
              source: view.publicName,
              sourceColumnName: baseUnitName,
            }),
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
              pattern: new TransformPattern({
                name: "空白変換",
                args: ["その他"],
              }),
              value: new SelectValue({
                source: view.publicName,
                sourceColumnName: "流入元パラメータ",
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
            pattern: new TransformPattern({ name: periodUnitType }),
            value: new SelectValue({
              sourceColumnName: timeColumnName,
              source: view.publicName,
            }),
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
              new PlaceholderCondition({
                values: [
                  new SelectValue({
                    source: relatedActionName,
                    sourceColumnName: "タイムスタンプ",
                  }),
                ],
                template: 'DATE(?, "Asia/Tokyo") >= DATE("2021-01-18")',
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
      "A_ウェルカムスライド完了",
      "A_勉強会モーダル完了",
      "A_個別ケース相談モーダル完了",
      "A_TOP表示",
      "A_マイページTOP表示",
      "A_何かしらのお知らせ開封",
      "A_ケース相談TOP表示",
      "A_ケース相談詳細表示",
      "A_ケース相談一次相談作成",
      "A_ケース相談一次相談申込",
      // "A_ケース相談申込詳細表示",
      "A_ケース相談二次相談作成",
      "A_ケース相談二次相談提出",
      "A_勉強会リリースお知らせ開封",
      "A_勉強会TOP表示",
      "A_勉強会詳細表示",
      "A_勉強会申込",
      "A_勉強会申込詳細表示",
      "A_勉強会参加",
      "A_過去動画TOP表示",
      "A_勉強会過去動画再生開始",
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
            pattern: new TransformPattern({ name: periodUnitType }),
            value: new SelectValue({
              sourceColumnName: timeColumnName,
              source: baseActionName,
            }),
          }),
        }),
        new ValueSurface({
          name: `アクション集計値`,
          alphabetName: `action_aggregated_value`,
          value: new AggregateValue({
            pattern: new AggregatePattern({ name: "COUNT_DISTINCT" }),
            value: new SelectValue({
              source: view.publicName,
              sourceColumnName: baseUnitName,
            }),
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
            pattern: new TransformPattern({ name: periodUnitType }),
            value: new SelectValue({
              sourceColumnName: timeColumnName,
              source: baseActionName,
            }),
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
            new PlaceholderCondition({
              template: 'DATE(?, "Asia/Tokyo") >= DATE("2020-10-01")',
              values: [
                new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                  source: baseActionName,
                }),
              ],
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
                    values: [
                      new SelectValue({
                        sourceColumnName: baseUnitName,
                        source: baseActionName,
                      }),
                      new SelectValue({
                        sourceColumnName: baseUnitName,
                        source: relatedActionView.publicName,
                      }),
                    ],
                  }),
                  new PlaceholderCondition({
                    values: [
                      new SelectValue({
                        sourceColumnName: timeColumnName,
                        source: relatedActionView.publicName,
                      }),
                      new SelectValue({
                        sourceColumnName: timeColumnName,
                        source: baseActionName,
                      }),
                    ],
                    template: "DATE_DIFF(DATE(?), DATE(?), DAY) <= 31", // 31 * 3 も計算可能
                  }),
                ],
              }),
            ],
            conditions: [
              new PlaceholderCondition({
                template: 'DATE(?, "Asia/Tokyo") >= DATE("2020-10-01")',
                values: [
                  new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                    source: baseActionName,
                  }),
                ],
              }),
            ],
            groups: generateGroupBy(relatedActionView),
          });
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const userHealthScoreStatistics = function () {
    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_サイト内のどこかしらのページ表示",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_日抽出" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "MAX",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "PLUS全体_最終閲覧日" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_サイト内のどこかしらのページ表示",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "PLUS全体_累計PV" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_勉強会内のどこかしらのページ表示",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_日抽出" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "MAX",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "勉強会_最終閲覧日" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_勉強会申込",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "勉強会_申込数" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_勉強会参加",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "勉強会_参加数" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_勉強会過去動画再生開始",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({
                value: "勉強会_過去動画累計視聴回数",
              }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_勉強会申込",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_日抽出" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "MAX",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "勉強会_最終申込日" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_教材レッスンページ表示",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "教材_教材レッスン累計PV" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_教材PDFクリック",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({
                value: "教材_教材PDF累計クリック数",
              }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_ヒント動画再生開始",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "ヒント動画_累計視聴回数" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_マイページ内のどこかしらのページ表示",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_日抽出" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "MAX",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "マイページ_最終閲覧日" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_マイページ内のどこかしらのページ表示",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "マイページ_累計PV" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
          ],
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const userHealthScoreStatisticsMonthPv = function () {
    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_サイト内のどこかしらのページ表示",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "集計期間",
              alphabetName: "period",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "PLUS全体_月別_PV" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
            new Group({
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                }),
              }),
            }),
          ],
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const userHealthScoreStatisticsMonthKyozaiLessonPv = function () {
    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_教材レッスンページ表示",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "集計期間",
              alphabetName: "period",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "PLUS全体_月別_教材_レッスンPV" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
            new Group({
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                }),
              }),
            }),
          ],
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const userHealthScoreStatisticsMonthKyozaiPdfClick = function () {
    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_教材PDFクリック",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "集計期間",
              alphabetName: "period",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "PLUS全体_月別_教材_PDFクリック" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
            new Group({
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                }),
              }),
            }),
          ],
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const userHealthScoreStatisticsMonthHintVideoPlay = function () {
    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_ヒント動画再生開始",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "集計期間",
              alphabetName: "period",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "PLUS全体_月別_ヒント動画_視聴回数" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
            new Group({
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                }),
              }),
            }),
          ],
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const userHealthScoreStatisticsMonthStudyMeetingArchiveVideoPlay = function () {
    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_勉強会過去動画再生開始",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "集計期間",
              alphabetName: "period",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "PLUS全体_月別_勉強会_過去動画視聴回数" }),
            }),
          ],
          inheritColumns: ["ユーザコード"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
            new Group({
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                }),
              }),
            }),
          ],
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const userHealthScoreStatisticsMonthStudyMeetingArchiveVideoEachTitle = function () {
    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "",
          alphabetName: "",
          source: "A_勉強会過去動画再生開始",
          columns: [
            new ValueSurface({
              name: "統計値",
              alphabetName: "stat_value",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "型変換_文字列" }),
                value: new AggregateValue({
                  pattern: new AggregatePattern({
                    name: "COUNT",
                  }),
                  value: new SelectValue({
                    sourceColumnName: "タイムスタンプ",
                  }),
                }),
              }),
            }),
            new ValueSurface({
              name: "統計種別ラベル",
              alphabetName: "stat_label",
              value: new ConstStringValue({ value: "PLUS全体_勉強会別_過去動画視聴回数" }),
            }),
          ],
          inheritColumns: ["ユーザコード", "勉強会コード", "勉強会タイトル"],
          groups: [
            new Group({
              value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            }),
            new Group({
              value: new SelectValue({ sourceColumnName: "勉強会コード" }),
            }),
            new Group({
              value: new SelectValue({ sourceColumnName: "勉強会タイトル" }),
            }),
          ],
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };

  const userHealthScoreStatisticsMonthStudyMeetingApplicationEachTitle = function () {
    const reportUnionView = new UnionView({
      name: "集計クエリ",
      alphabetName: "aggregated_view",
      views: [
        new QueryView({
          name: "",
          alphabetName: "",
          source: "オンライン勉強会申込",
          columns: [
            new ValueSurface({
              name: "勉強会開催日",
              alphabetName: "held_on",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_日抽出" }),
                value: new SelectValue({sourceColumnName: '勉強会開始日時タイムスタンプ'})
              }),
            }),
            new ValueSurface({
              name: "申込日",
              alphabetName: "submiited_on",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_日抽出" }),
                value: new SelectValue({sourceColumnName: '申込日時'})
              }),
            }),
            new ValueSurface({
              name: "参加日",
              alphabetName: "attended_on",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_日抽出" }),
                value: new SelectValue({sourceColumnName: '参加日時'})
              }),
            }),
            new ValueSurface({
              name: "キャンセル日",
              alphabetName: "cancelled_on",
              value: new TransformValue({
                pattern: new TransformPattern({ name: "タイムスタンプ_日抽出" }),
                value: new SelectValue({sourceColumnName: 'キャンセル日時'})
              }),
            }),
          ],
          inheritColumns: ["ユーザコード", "勉強会コード", "勉強会タイトル"],
        }),
      ],
    });
    resolver.addView(reportUnionView);
  };
  // usersAfterContract();
  // usersContractedUsageSummary();
  // usersContractedUsageSummaryMoreThanMonth();
  // usersContractedSourceParamAfterMonth();
  // usersContractedSourceParamEachService();
  // userHealthScoreStatistics();
  // userHealthScoreStatisticsMonthPv();
  // userHealthScoreStatisticsMonthKyozaiLessonPv();
  // userHealthScoreStatisticsMonthKyozaiPdfClick();
  // userHealthScoreStatisticsMonthHintVideoPlay();
  // userHealthScoreStatisticsMonthStudyMeetingArchiveVideoPlay();
  // userHealthScoreStatisticsMonthStudyMeetingArchiveVideoEachTitle();
  userHealthScoreStatisticsMonthStudyMeetingApplicationEachTitle();

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
