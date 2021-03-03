import { RawCondition } from "./builder/condition/raw_condition";
import { RawJoin } from "./builder/join/raw_join";
import { MixinUsage } from "./builder/mixin_usage";
import { RawValue } from "./builder/value/raw_value";
import { SelectValue } from "./builder/value/select_value";
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
          raw: `CASE
WHEN REGEXP_CONTAINS(referrer, "/plus/registers/complete") THEN "contract-completed"
WHEN REGEXP_CONTAINS(referrer, "/plus/welcome") THEN "welcome"
WHEN REGEXP_CONTAINS(referrer, "https://h-navi.jp") AND NOT REGEXP_CONTAINS(referrer, "https://h-navi.jp/plus") THEN "h-navi"
ELSE JSON_EXTRACT_SCALAR(message, "$.params.s")
END`,
        }), // WELCOMEスライドの場合はブックマークされることを考慮してパラメータを仕込んでいない
      }),
    ],
    joins: [
      new RawJoin({
        raw:
          "JOIN `h-navi.lo_production.users` users ON rack_plus.user_id = users.id",
      }),
    ],
    mixinUsages: [new MixinUsage({ name: "成功リクエスト" })],
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
        name: "作成日時",
        alphabetName: "created_on",
        value: new RawValue({
          raw: "application_tickets.created_on",
        }),
      }),
    ],
    mixinUsages: [new MixinUsage({ name: "ダミー流入元パラメータ" })],
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
        name: "作成日時",
        alphabetName: "created_on",
        value: new RawValue({
          raw: "second_question_tickets.created_on",
        }),
      }),
    ],
    mixinUsages: [new MixinUsage({ name: "ダミー流入元パラメータ" })],
    dateSuffixEnabled: false,
  }),
  new RootView({
    name: "オンライン勉強会申込",
    alphabetName: "plus_study_meeting_applications",
    physicalSource: "`h-navi.lo_production.plus_study_meeting_applications`",
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
    ],
    mixinUsages: [new MixinUsage({ name: "ダミー流入元パラメータ" })],
    dateSuffixEnabled: false,
  }),
  new RootView({
    name: "オンボWELCOMEスライド閲覧履歴",
    alphabetName: "plus_featured_content_check_histories",
    physicalSource:
      "`h-navi.lo_production.plus_featured_content_check_histories`",
    physicalSourceAlias: "plus_featured_content_check_histories",
    columns: [
      new ValueSurface({
        name: "ユーザコード",
        alphabetName: "user_code",
        value: new RawValue({
          raw: "plus_featured_content_check_histories.user_code",
        }),
      }),
      new ValueSurface({
        name: "完了日時",
        alphabetName: "completed_at",
        value: new RawValue({
          raw: "plus_featured_content_check_histories.completed_at",
        }),
      }),
      new ValueSurface({
        name: "最終表示日時",
        alphabetName: "last_displayed_at",
        value: new RawValue({
          raw: "plus_featured_content_check_histories.last_displayed_at",
        }),
      }),
      new ValueSurface({
        name: "コンテンツ名",
        alphabetName: "content_name",
        value: new RawValue({
          raw: "plus_featured_content_check_histories.content_name",
        }),
      }),
    ],
    mixinUsages: [new MixinUsage({ name: "ダミー流入元パラメータ" })],
    dateSuffixEnabled: false,
  }),
  new RootView({
    name: "勉強会過去動画視聴履歴",
    alphabetName: "action_plus_archive_videos_playback_logs",
    physicalSource:
      "`h-navi.lo_applog.action_plus_archive_videos_playback_logs_*`",
    physicalSourceAlias: "playback_logs",
    columns: [
      new ValueSurface({
        name: "ユーザコード",
        alphabetName: "user_code",
        value: new RawValue({ raw: "users.code" }),
      }),
      new ValueSurface({
        name: "イベント種別",
        alphabetName: "event_name",
        value: new RawValue({
          raw: "JSON_EXTRACT_SCALAR(playback_logs.message, '$.eventName')",
        }),
      }),
      new ValueSurface({
        name: "過去動画コード",
        alphabetName: "archive_video_code",
        value: new RawValue({
          raw: "JSON_EXTRACT_SCALAR(playback_logs.message, '$.code')",
        }),
      }),
      new ValueSurface({
        name: "タイムスタンプ",
        alphabetName: "time",
        value: new RawValue({
          raw: "TIMESTAMP_SECONDS(playback_logs.time)",
        }),
      }),
    ],
    joins: [
      new RawJoin({
        raw:
          "JOIN `h-navi.lo_production.users` users ON CAST(JSON_EXTRACT_SCALAR(playback_logs.message, '$.user_id') AS INT64) = users.id",
      }),
    ],
    mixinUsages: [new MixinUsage({ name: "ダミー流入元パラメータ" })],
    dateSuffixEnabled: true,
  }),
  new RootView({
    name: "PLUSお知らせ",
    alphabetName: "plus_notices",
    physicalSource: "`h-navi.lo_production.plus_notices`",
    physicalSourceAlias: "plus_notices",
    columns: [
      new ValueSurface({
        name: "ユーザコード",
        alphabetName: "user_code",
        value: new RawValue({
          raw: "plus_notices.user_code",
        }),
      }),
      new ValueSurface({
        name: "開封日時",
        alphabetName: "opened_at",
        value: new RawValue({
          raw: "plus_notices.opened_at",
        }),
      }),
      new ValueSurface({
        name: "コーナー名",
        alphabetName: "corner_name",
        value: new RawValue({
          raw: "plus_notices.corner_name",
        }),
      }),
      new ValueSurface({
        name: "お知らせ種別",
        alphabetName: "notice_type",
        value: new RawValue({
          raw: "plus_notices.notice_type",
        }),
      }),
    ],
    mixinUsages: [new MixinUsage({ name: "ダミー流入元パラメータ" })],
    dateSuffixEnabled: false,
  }),
  new RootView({
    name: "PLUS教材PDFクリック",
    alphabetName: "plus_kyozai_doc_pdf_click",
    physicalSource:
      "`h-navi.lo_applog.action_plus_kyozai_doc_pdf_click_*`",
    physicalSourceAlias: "plus_kyozai_doc_pdf_click",
    columns: [
      new ValueSurface({
        name: "ユーザコード",
        alphabetName: "user_code",
        value: new RawValue({ raw: "users.code" }),
      }),
      new ValueSurface({
        name: "教材資料ID",
        alphabetName: "kyozai_doc_id",
        value: new RawValue({
          raw: "CAST(JSON_EXTRACT_SCALAR(plus_kyozai_doc_pdf_click.message, '$.doc_id') AS INT64)",
        }),
      }),
      new ValueSurface({
        name: "タイムスタンプ",
        alphabetName: "time",
        value: new RawValue({
          raw: "TIMESTAMP_SECONDS(playback_logs.time)",
        }),
      }),
    ],
    joins: [
      new RawJoin({
        raw:
          "JOIN `h-navi.lo_production.users` users ON CAST(JSON_EXTRACT_SCALAR(playback_logs.message, '$.user_id') AS INT64) = users.id",
      }),
    ],
    mixinUsages: [new MixinUsage({ name: "ダミー流入元パラメータ" })],
    dateSuffixEnabled: true,
  }),
  new RootView({
    name: "ヒント動画視聴履歴",
    alphabetName: "plus_hint_videos_playback_logs",
    physicalSource:
      "`h-navi.lo_applog.action_plus_hint_videos_playback_logs_*`",
    physicalSourceAlias: "playback_logs",
    columns: [
      new ValueSurface({
        name: "ユーザコード",
        alphabetName: "user_code",
        value: new RawValue({ raw: "users.code" }),
      }),
      new ValueSurface({
        name: "イベント種別",
        alphabetName: "event_name",
        value: new RawValue({
          raw: "JSON_EXTRACT_SCALAR(playback_logs.message, '$.eventName')",
        }),
      }),
      new ValueSurface({
        name: "ヒント動画コード",
        alphabetName: "hint_video_code",
        value: new RawValue({
          raw: "JSON_EXTRACT_SCALAR(playback_logs.message, '$.id')",
        }),
      }),
      new ValueSurface({
        name: "タイムスタンプ",
        alphabetName: "time",
        value: new RawValue({
          raw: "TIMESTAMP_SECONDS(playback_logs.time)",
        }),
      }),
    ],
    joins: [
      new RawJoin({
        raw:
          "JOIN `h-navi.lo_production.users` users ON CAST(JSON_EXTRACT_SCALAR(playback_logs.message, '$.user_id') AS INT64) = users.id",
      }),
    ],
    mixinUsages: [new MixinUsage({ name: "ダミー流入元パラメータ" })],
    dateSuffixEnabled: true,
  }),
  new QueryView({
    name: "PLUS契約者アクセスログ",
    alphabetName: "plus_contracted_users_logs",
    source: "PLUSユーザコード付きアクセスログ",
    inheritAllColumnsEnabled: true,
    mixinUsages: [
      new MixinUsage({
        name: "PLUS契約ユーザ（解約済み含む）",
      }),
    ],
  }),
  new QueryView({
    name: "PLUS契約者アクセスログ流入元パラメータ除外",
    alphabetName: "plus_contracted_users_logs_without_source_param",
    source: "PLUS契約者アクセスログ",
    inheritColumns: ["ユーザコード", "path", "タイムスタンプ"],
    mixinUsages: [new MixinUsage({ name: "ダミー流入元パラメータ" })],
  }),
  new ActionView({
    actionName: "A_ウェルカムスライド完了",
    actionAlphabetName: "action_complete_welcome_slide",
    source: "オンボWELCOMEスライド閲覧履歴",
    columns: [
      new ValueSurface({
        name: "タイムスタンプ",
        alphabetName: "time",
        value: new SelectValue({
          sourceColumnName: "完了日時",
        }),
      }),
    ],
    inheritColumns: ["ユーザコード", "流入元パラメータ"],
    mixinUsages: [
      new MixinUsage({ name: "完了済みオンボコンテンツ" }),
      new MixinUsage({ name: "オンボコンテンツ_WELCOMEスライド" }),
    ],
  }),
  new ActionView({
    actionName: "A_勉強会モーダル完了",
    actionAlphabetName: "action_complete_study_modal",
    source: "オンボWELCOMEスライド閲覧履歴",
    columns: [
      new ValueSurface({
        name: "タイムスタンプ",
        alphabetName: "time",
        value: new SelectValue({
          sourceColumnName: "完了日時",
        }),
      }),
    ],
    inheritColumns: ["ユーザコード", "流入元パラメータ"],
    mixinUsages: [
      new MixinUsage({ name: "完了済みオンボコンテンツ" }),
      new MixinUsage({ name: "オンボコンテンツ_勉強会モーダル" }),
    ],
  }),
  new ActionView({
    actionName: "A_個別ケース相談モーダル完了",
    actionAlphabetName: "action_complete_counseling_modal",
    source: "オンボWELCOMEスライド閲覧履歴",
    columns: [
      new ValueSurface({
        name: "タイムスタンプ",
        alphabetName: "time",
        value: new SelectValue({
          sourceColumnName: "完了日時",
        }),
      }),
    ],
    inheritColumns: ["ユーザコード", "流入元パラメータ"],
    mixinUsages: [
      new MixinUsage({ name: "完了済みオンボコンテンツ" }),
      new MixinUsage({ name: "オンボコンテンツ_ケース相談モーダル" }),
    ],
  }),
  new ActionView({
    actionName: "A_何かしらのお知らせ開封",
    actionAlphabetName: "action_open_any_notice",
    source: "PLUSお知らせ",
    columns: [
      new ValueSurface({
        name: "タイムスタンプ",
        alphabetName: "time",
        value: new SelectValue({
          sourceColumnName: "開封日時",
        }),
      }),
    ],
    inheritColumns: ["ユーザコード", "流入元パラメータ"],
    mixinUsages: [new MixinUsage({ name: "お知らせ_開封済み" })],
  }),
  new ActionView({
    actionName: "A_勉強会リリースお知らせ開封",
    actionAlphabetName: "action_open_new_study_meeting_notice",
    source: "PLUSお知らせ",
    columns: [
      new ValueSurface({
        name: "タイムスタンプ",
        alphabetName: "time",
        value: new SelectValue({
          sourceColumnName: "開封日時",
        }),
      }),
    ],
    inheritColumns: ["ユーザコード", "流入元パラメータ"],
    mixinUsages: [
      new MixinUsage({ name: "お知らせ_開封済み" }),
      new MixinUsage({ name: "お知らせ_勉強会" }),
      new MixinUsage({ name: "お知らせ_コンテンツリリース" }),
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
    ],
    mixinUsages: [new MixinUsage({ name: "ダミー流入元パラメータ" })],
  }),
  new ActionView({
    actionName: "A_サイト内のどこかしらのページ表示",
    actionAlphabetName: "action_overview_visit_site",
    source: "PLUS契約者アクセスログ流入元パラメータ除外",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw: "REGEXP_CONTAINS(path, '^/plus')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_勉強会内のどこかしらのページ表示",
    actionAlphabetName: "action_overview_visit_study_meeting",
    source: "PLUS契約者アクセスログ流入元パラメータ除外",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw: "REGEXP_CONTAINS(path, '^/plus/study_meeting[^_]')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_勉強会過去動画内のどこかしらのページ表示",
    actionAlphabetName: "action_overview_visit_study_meeting_archive",
    source: "PLUS契約者アクセスログ流入元パラメータ除外",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw: "REGEXP_CONTAINS(path, '^/plus/study_meeting_archive')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_個別ケース相談内のどこかしらのページ表示",
    actionAlphabetName: "action_overview_visit_counseling",
    source: "PLUS契約者アクセスログ流入元パラメータ除外",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw: "REGEXP_CONTAINS(path, '^/plus/counseling')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_教材内のどこかしらのページ表示",
    actionAlphabetName: "action_overview_visit_kyozai",
    source: "PLUS契約者アクセスログ流入元パラメータ除外",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw: "REGEXP_CONTAINS(path, '^/plus/kyozai')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_ヒント動画内のどこかしらのページ表示",
    actionAlphabetName: "action_overview_visit_hint_videos",
    source: "PLUS契約者アクセスログ流入元パラメータ除外",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw: "REGEXP_CONTAINS(path, '^/plus/hint_videos')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_マイページ内のどこかしらのページ表示",
    actionAlphabetName: "action_overview_visit_mypage",
    source: "PLUS契約者アクセスログ流入元パラメータ除外",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw: "REGEXP_CONTAINS(path, '^/plus/mypage')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_TOP表示",
    actionAlphabetName: "action_visit_top",
    source: "PLUS契約者アクセスログ",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw: "REGEXP_CONTAINS(path, '^/plus$')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_マイページTOP表示",
    actionAlphabetName: "action_visit_mypage_top",
    source: "PLUS契約者アクセスログ",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw: "REGEXP_CONTAINS(path, '^/plus/mypage$')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_ケース相談TOP表示",
    actionAlphabetName: "action_visit_counseling_top",
    source: "PLUS契約者アクセスログ",
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
    source: "PLUS契約者アクセスログ",
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
        value: new SelectValue({ sourceColumnName: "作成日時" }),
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
    source: "PLUS契約者アクセスログ",
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
        value: new SelectValue({ sourceColumnName: "作成日時" }),
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
    source: "PLUS契約者アクセスログ",
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
    source: "PLUS契約者アクセスログ",
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
    actionAlphabetName: "action_visit_mypage_study_meeting_application_detail",
    source: "PLUS契約者アクセスログ",
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
  new ActionView({
    actionName: "A_過去動画TOP表示",
    actionAlphabetName: "action_visit_study_meeting_archive_top",
    source: "PLUS契約者アクセスログ",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw: "REGEXP_CONTAINS(path, '^/plus/study_meeting_archive$')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_勉強会過去動画再生開始",
    actionAlphabetName: "action_play_study_meeting_archive_video",
    source: "勉強会過去動画視聴履歴",
    inheritColumns: ["ユーザコード", "流入元パラメータ", "タイムスタンプ"],
    mixinUsages: [new MixinUsage({ name: "動画再生履歴_視聴開始" })],
  }),
  new ActionView({
    actionName: "A_教材レッスンページ表示",
    actionAlphabetName: "action_visit_kyozai_lesson",
    source: "PLUS契約者アクセスログ",
    inheritAllColumnsEnabled: true,
    conditions: [
      new RawCondition({
        raw:
          "REGEXP_CONTAINS(path, '^/plus/kyozai/lessons/\\\\w+?')",
      }),
    ],
  }),
  new ActionView({
    actionName: "A_教材PDFクリック",
    actionAlphabetName: "action_click_kyozai_pdf",
    source: "PLUS教材PDFクリック",
    inheritColumns: ["ユーザコード", "流入元パラメータ", "タイムスタンプ"],
  }),
  new ActionView({
    actionName: "A_ヒント動画再生開始",
    actionAlphabetName: "action_play_hint_video",
    source: "ヒント動画視聴履歴",
    inheritColumns: ["ユーザコード", "流入元パラメータ", "タイムスタンプ"],
    mixinUsages: [new MixinUsage({ name: "動画再生履歴_視聴開始" })],
  }),
];
