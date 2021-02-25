import { RawCondition } from "./builder/condition/raw_condition";
import { RawJoin } from "./builder/join/raw_join";
import { MixinUsage } from "./builder/mixin_usage";
import { Order } from "./builder/order";
import { TransformPattern } from "./builder/transform_pattern";
import { RawValue } from "./builder/value/raw_value";
import { SelectValue } from "./builder/value/select_value";
import { TransformValue } from "./builder/value/transform_value";
import { ValueSurface } from "./builder/value_surface";
import { ActionView } from "./builder/view/action_view";
import { QueryView } from "./builder/view/query_view";
import { RootView } from "./builder/view/root_view";
import { View } from "./builder/view/view";

export const DefinedViews: View[] = [
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
];
