import { InCondition } from "./builder/condition/in_condition";
import { RawValue } from "./builder/value/raw_value";
import { RootView } from "./builder/view/root_view";
import { ValueSurface } from "./builder/value_surface";
import { ViewResolver } from "./builder/view_resolver";
import { RawJoin } from "./builder/join/raw_join";
import { QueryView } from "./builder/view/query_view";
import { RawCondition } from "./builder/condition/raw_condition";
import { SelectValueSet } from "./builder/value_set/select_value_set";
import { SelectValue } from "./builder/value/select_value";
import { TransformValue } from "./builder/value/transform_value";
import { TransformPattern } from "./builder/transform_pattern";
import { Order } from "./builder/order";
import { Mixin } from "./builder/mixin";
import { MixinUsage } from "./builder/mixin_usage";
import { ActionView } from "./builder/view/action_view";
import { BinomialCondition } from "./builder/condition/binomial_condition";
import { EqCondition } from "./builder/condition/eq_condition";
import { Group } from "./builder/group";
import { AggregateValue } from "./builder/value/aggregate_value";
import { AggregatePattern } from "./builder/aggregate_pattern";
import { InnerJoin } from "./builder/join/inner_join";
import { UnionView } from "./builder/view/union_view";
import { View } from "./builder/view/view";

function main() {
  const resolver = new ViewResolver({
    mixins: [
      new Mixin({
        name: "契約済み契約",
        conditions: [new RawCondition({ raw: "usage_start_date IS NOT NULL" })],
      }),
      new Mixin({
        name: "成功リクエスト",
        conditions: [new RawCondition({ raw: "status_code = '200'" })],
      }),
      new Mixin({
        name: "PLUS契約ユーザ（解約済み含む）",
        conditions: [
          new InCondition({
            value: new SelectValue({ sourceColumnName: "ユーザコード" }),
            inValueSet: new SelectValueSet({
              source: "ユーザコード付きPLUS契約",
              sourceColumnName: "契約ユーザコード",
            }),
          }),
        ],
      }),
      new Mixin({
        name: "申込済み一時相談",
        conditions: [
          new RawCondition({ raw: "application_datetime IS NOT NULL" }),
        ],
      }),
      new Mixin({
        name: "申込済み二次相談",
        conditions: [new RawCondition({ raw: "submitted_at IS NOT NULL" })],
      }),
      new Mixin({
        name: "勉強会参加済み申込",
        conditions: [new RawCondition({ raw: "attended_at IS NOT NULL" })],
      }),
    ],
    views: [
      new RootView({
        name: "ユーザコード付きPLUS契約",
        alphabetName: "plus_contracts_with_user_code",
        physicalSource: "`h-navi.lo_production.plus_contracts`",
        physicalSourceAlias: "plus_contracts",
        dateSuffixEnabled: false,
        columns: [
          new ValueSurface({
            name: "利用開始日タイムスタンプ",
            alphabetName: "usage_start_date_timestamp",
            value: new RawValue({
              raw: "usage_start_date", // Dateの値は正しいタイムゾーンで入っているのでそのまま使う
            }),
          }),
          new ValueSurface({
            name: "利用終了日タイムスタンプ",
            alphabetName: "usage_end_date_timestamp",
            value: new RawValue({
              raw: "usage_end_date",
            }),
          }),
          new ValueSurface({
            name: "契約ユーザコード",
            alphabetName: "contracted_user_code",
            value: new RawValue({ raw: "users.code" }),
          }),
          new ValueSurface({
            name: "契約ユーザID",
            alphabetName: "contracted_user_id",
            value: new RawValue({ raw: "users.id" }),
          }),
        ],
        mixinUsages: [new MixinUsage({ name: "契約済み契約" })],
        joins: [
          new RawJoin({
            raw:
              "JOIN `h-navi.lo_production.users` users ON plus_contracts.contractor_user_id = users.id",
          }),
        ],
      }),
      new RootView({
        name: "PLUSユーザコード付きアクセスログ",
        alphabetName: "plus_users_logs_with_user_code",
        physicalSource: "`h-navi.lo_applog_transform.action_rack_plus_*`",
        physicalSourceAlias: "rack_plus",
        dateSuffixEnabled: true,
        columns: [
          new ValueSurface({
            name: "ユーザコード",
            alphabetName: "user_code",
            value: new RawValue({ raw: "users.code" }),
          }),
          new ValueSurface({
            name: "path",
            alphabetName: "path",
            value: new RawValue({ raw: "rack_plus.path" }),
          }),
          new ValueSurface({
            name: "タイムスタンプ",
            alphabetName: "time",
            value: new RawValue({ raw: "TIMESTAMP_SECONDS(rack_plus.time)" }),
          }),
          new ValueSurface({
            name: "流入元パラメータ",
            alphabetName: "source_param",
            value: new RawValue({
              raw:
                'IF(referrer = "https://h-navi.jp/plus/welcome", "welcome", JSON_EXTRACT_SCALAR(message, "$.params.s"))',
            }), // WELCOMEスライドの場合はブックマークされることを考慮してパラメータを仕込んでいない
          }),
        ],
        joins: [
          new RawJoin({
            raw:
              "JOIN `h-navi.lo_production.users` users ON rack_plus.user_id = users.id",
          }),
        ],
      }),
      new RootView({
        name: "個別ケース相談一次相談",
        alphabetName: "plus_counseling_first_applictions",
        physicalSource:
          "`h-navi.lo_plusmine_production.counseling_case_application_tickets`",
        physicalSourceAlias: "application_tickets",
        columns: [
          new ValueSurface({
            name: "ユーザコード",
            alphabetName: "user_code",
            value: new RawValue({ raw: "application_tickets.user_code" }),
          }),
          new ValueSurface({
            name: "申込日時",
            alphabetName: "application_datetime",
            value: new RawValue({
              raw: "application_tickets.application_datetime",
            }),
          }),
          new ValueSurface({
            name: "流入元パラメータ",
            alphabetName: "source_param",
            value: new RawValue({
              raw: "''",
            }),
          }),
        ],
        dateSuffixEnabled: false,
      }),
      new RootView({
        name: "個別ケース相談二次相談",
        alphabetName: "plus_counseling_second_applictions",
        physicalSource:
          "`h-navi.lo_plusmine_production.counseling_case_additional_question_tickets`",
        physicalSourceAlias: "second_question_tickets",
        columns: [
          new ValueSurface({
            name: "ユーザコード",
            alphabetName: "user_code",
            value: new RawValue({ raw: "second_question_tickets.user_code" }),
          }),
          new ValueSurface({
            name: "提出日時",
            alphabetName: "submitted_at",
            value: new RawValue({
              raw: "second_question_tickets.submitted_at",
            }),
          }),
          new ValueSurface({
            name: "流入元パラメータ",
            alphabetName: "source_param",
            value: new RawValue({
              raw: "''",
            }),
          }),
        ],
        dateSuffixEnabled: false,
      }),
      new RootView({
        name: "オンライン勉強会申込",
        alphabetName: "plus_study_meeting_applications",
        physicalSource:
          "`h-navi.lo_production.plus_study_meeting_applications`",
        physicalSourceAlias: "study_meeting_applications",
        columns: [
          new ValueSurface({
            name: "ユーザコード",
            alphabetName: "user_code",
            value: new RawValue({
              raw: "study_meeting_applications.user_code",
            }),
          }),
          new ValueSurface({
            name: "申込日時",
            alphabetName: "application_datetime",
            value: new RawValue({
              raw: "study_meeting_applications.application_datetime",
            }),
          }),
          new ValueSurface({
            name: "参加日時",
            alphabetName: "attended_at",
            value: new RawValue({
              raw: "study_meeting_applications.attended_at",
            }),
          }),
          new ValueSurface({
            name: "流入元パラメータ",
            alphabetName: "source_param",
            value: new RawValue({
              raw: "''",
            }),
          }),
        ],
        dateSuffixEnabled: false,
      }),
      new QueryView({
        name: "PLUS契約者アクセスログ",
        alphabetName: "plus_contracted_users_logs",
        source: "PLUSユーザコード付きアクセスログ",
        columns: [
          // テスト
          new ValueSurface({
            name: "新しい名前のユーザコード",
            alphabetName: "user_code_alias",
            value: new SelectValue({ sourceColumnName: "ユーザコード" }),
          }),
          new ValueSurface({
            name: "月",
            alphabetName: "month",
            value: new TransformValue({
              sourceColumnName: "タイムスタンプ",
              pattern: new TransformPattern({ name: "タイムスタンプ_月抽出" }),
            }),
          }),
        ],
        inheritAllColumnsEnabled: true,
        mixinUsages: [
          new MixinUsage({
            name: "PLUS契約ユーザ（解約済み含む）",
          }),
        ],
        orders: [
          new Order({
            value: new SelectValue({ sourceColumnName: "タイムスタンプ" }),
          }),
        ],
      }),
      new ActionView({
        actionName: "A_PLUS利用開始",
        actionAlphabetName: "action_start_using_plus",
        source: "ユーザコード付きPLUS契約",
        columns: [
          new ValueSurface({
            name: "ユーザコード",
            alphabetName: "user_code",
            value: new SelectValue({ sourceColumnName: "契約ユーザコード" }),
          }),
          new ValueSurface({
            name: "タイムスタンプ",
            alphabetName: "time",
            value: new SelectValue({
              sourceColumnName: "利用開始日タイムスタンプ",
            }),
          }),
          new ValueSurface({
            name: "流入元パラメータ",
            alphabetName: "source_param",
            value: new RawValue({
              raw: "''",
            }),
          }),
        ],
      }),
      new ActionView({
        actionName: "A_ケース相談TOP表示",
        actionAlphabetName: "action_visit_counseling_top",
        source: "PLUSユーザコード付きアクセスログ",
        inheritAllColumnsEnabled: true,
        conditions: [
          new RawCondition({
            raw: "REGEXP_CONTAINS(path, '^/plus/counseling$')",
          }),
        ],
      }),
      new ActionView({
        actionName: "A_ケース相談詳細表示",
        actionAlphabetName: "action_visit_counseling_show",
        source: "PLUSユーザコード付きアクセスログ",
        inheritAllColumnsEnabled: true,
        conditions: [
          new RawCondition({
            raw: "REGEXP_CONTAINS(path, '^/plus/counseling/\\\\w+?$')",
          }),
        ],
      }),
      new ActionView({
        actionName: "A_ケース相談一次相談作成",
        actionAlphabetName: "action_create_counseling_first_question",
        source: "個別ケース相談一次相談",
        columns: [
          new ValueSurface({
            name: "タイムスタンプ",
            alphabetName: "time",
            value: new SelectValue({ sourceColumnName: "申込日時" }),
          }),
        ],
        inheritColumns: ["ユーザコード", "流入元パラメータ"],
      }),
      new ActionView({
        actionName: "A_ケース相談一次相談申込",
        actionAlphabetName: "action_submit_counseling_first_question",
        source: "個別ケース相談一次相談",
        columns: [
          new ValueSurface({
            name: "タイムスタンプ",
            alphabetName: "time",
            value: new SelectValue({ sourceColumnName: "申込日時" }),
          }),
        ],
        inheritColumns: ["ユーザコード", "流入元パラメータ"],
        mixinUsages: [new MixinUsage({ name: "申込済み一時相談" })],
      }),
      new ActionView({
        actionName: "A_ケース相談申込詳細表示",
        actionAlphabetName: "action_visit_counseling_application_detail",
        source: "PLUSユーザコード付きアクセスログ",
        inheritAllColumnsEnabled: true,
        conditions: [
          new RawCondition({
            raw:
              "REGEXP_CONTAINS(path, '^/plus/mypage/case_applications/\\\\w+?$')",
          }),
        ],
      }),
      new ActionView({
        actionName: "A_ケース相談二次相談作成",
        actionAlphabetName:
          "action_create_counseling_case_application_second_question",
        source: "個別ケース相談二次相談",
        columns: [
          new ValueSurface({
            name: "タイムスタンプ",
            alphabetName: "time",
            value: new SelectValue({ sourceColumnName: "提出日時" }),
          }),
        ],
        inheritColumns: ["ユーザコード", "流入元パラメータ"],
      }),
      new ActionView({
        actionName: "A_ケース相談二次相談提出",
        actionAlphabetName:
          "action_submit_counseling_case_application_second_question",
        source: "個別ケース相談二次相談",
        columns: [
          new ValueSurface({
            name: "タイムスタンプ",
            alphabetName: "time",
            value: new SelectValue({ sourceColumnName: "提出日時" }),
          }),
        ],
        inheritColumns: ["ユーザコード", "流入元パラメータ"],
        mixinUsages: [new MixinUsage({ name: "申込済み二次相談" })],
      }),
      new ActionView({
        actionName: "A_勉強会TOP表示",
        actionAlphabetName: "action_visit_study_meeting_top",
        source: "PLUSユーザコード付きアクセスログ",
        inheritAllColumnsEnabled: true,
        conditions: [
          new RawCondition({
            raw: "REGEXP_CONTAINS(path, '^/plus/study_meeting$')",
          }),
        ],
      }),
      new ActionView({
        actionName: "A_勉強会詳細表示",
        actionAlphabetName: "action_visit_study_meeting_detail",
        source: "PLUSユーザコード付きアクセスログ",
        inheritAllColumnsEnabled: true,
        conditions: [
          new RawCondition({
            raw: "REGEXP_CONTAINS(path, '^/plus/study_meeting/\\\\w+?$')",
          }),
        ],
      }),
      new ActionView({
        actionName: "A_勉強会申込",
        actionAlphabetName: "action_entry_study_meeting",
        source: "オンライン勉強会申込",
        columns: [
          new ValueSurface({
            name: "タイムスタンプ",
            alphabetName: "time",
            value: new SelectValue({ sourceColumnName: "申込日時" }),
          }),
        ],
        inheritColumns: ["ユーザコード", "流入元パラメータ"],
      }),
      new ActionView({
        actionName: "A_勉強会申込詳細表示",
        actionAlphabetName:
          "action_visit_mypage_study_meeting_application_detail",
        source: "PLUSユーザコード付きアクセスログ",
        inheritAllColumnsEnabled: true,
        conditions: [
          new RawCondition({
            raw:
              "REGEXP_CONTAINS(path, '^/plus/mypage/study_meeting_applications/\\\\w+?')",
          }),
        ],
      }),
      new ActionView({
        actionName: "A_勉強会参加",
        actionAlphabetName: "action_attend_study_meeting",
        source: "オンライン勉強会申込",
        columns: [
          new ValueSurface({
            name: "タイムスタンプ",
            alphabetName: "time",
            value: new SelectValue({ sourceColumnName: "参加日時" }),
          }),
        ],
        inheritColumns: ["ユーザコード", "流入元パラメータ"],
        mixinUsages: [new MixinUsage({ name: "勉強会参加済み申込" })],
      }),
    ],
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
    views: unionViews
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
