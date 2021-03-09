import { EqCondition } from "./builder/condition/eq_condition";
import { InCondition } from "./builder/condition/in_condition";
import { NotNullCondition } from "./builder/condition/not_null_condition";
import { PlaceholderCondition } from "./builder/condition/placeholder_condition";
import { RawCondition } from "./builder/condition/raw_condition";
import { Mixin } from "./builder/mixin";
import { ConstStringValue } from "./builder/value/const_string_value";
import { RawValue } from "./builder/value/raw_value";
import { SelectValue } from "./builder/value/select_value";
import { SelectValueSet } from "./builder/value_set/select_value_set";
import { ValueSurface } from "./builder/value_surface";

export const DefinedMixins: Mixin[] = [
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
      new NotNullCondition({
        values: [new SelectValue({ sourceColumnName: "申込日時" })],
      }),
    ],
  }),
  new Mixin({
    name: "申込済み二次相談",
    conditions: [
      new NotNullCondition({
        values: [new SelectValue({ sourceColumnName: "提出日時" })],
      }),
    ],
  }),
  new Mixin({
    name: "勉強会参加済み申込",
    conditions: [
      new NotNullCondition({
        values: [new SelectValue({ sourceColumnName: "参加日時" })],
      }),
    ],
  }),
  new Mixin({
    name: "完了済みオンボコンテンツ",
    conditions: [
      new NotNullCondition({
        values: [new SelectValue({ sourceColumnName: "完了日時" })],
      }),
    ],
  }),
  new Mixin({
    name: "オンボコンテンツ_WELCOMEスライド",
    conditions: [
      new EqCondition({
        values: [
          new SelectValue({ sourceColumnName: "コンテンツ名" }),
          new ConstStringValue({ value: "welcome_slide" }),
        ],
      }),
    ],
  }),
  new Mixin({
    name: "オンボコンテンツ_ケース相談モーダル",
    conditions: [
      new EqCondition({
        values: [
          new SelectValue({ sourceColumnName: "コンテンツ名" }),
          new ConstStringValue({ value: "counseling_introduction_modal" }),
        ],
      }),
    ],
  }),
  new Mixin({
    name: "オンボコンテンツ_勉強会モーダル",
    conditions: [
      new EqCondition({
        values: [
          new SelectValue({ sourceColumnName: "コンテンツ名" }),
          new ConstStringValue({ value: "study_meeting_introduction_modal" }),
        ],
      }),
    ],
  }),
  new Mixin({
    name: "ダミー流入元パラメータ",
    columns: [
      new ValueSurface({
        name: "流入元パラメータ",
        alphabetName: "source_param",
        value: new RawValue({
          raw: "CAST(NULL AS STRING)",
        }),
      }),
    ],
  }),
  new Mixin({
    name: "お知らせ_開封済み",
    conditions: [
      new NotNullCondition({
        values: [new SelectValue({ sourceColumnName: "開封日時" })],
      }),
    ],
  }),
  new Mixin({
    name: "お知らせ_勉強会",
    conditions: [
      new EqCondition({
        values: [
          new SelectValue({ sourceColumnName: "コーナー名" }),
          new ConstStringValue({ value: "study_meeting" }),
        ],
      }),
    ],
  }),
  new Mixin({
    name: "お知らせ_コンテンツリリース",
    conditions: [
      new EqCondition({
        values: [
          new SelectValue({ sourceColumnName: "お知らせ種別" }),
          new ConstStringValue({ value: "content_release" }),
        ],
      }),
    ],
  }),
  new Mixin({
    name: "動画再生履歴_視聴開始",
    conditions: [
      new EqCondition({
        values: [
          new SelectValue({ sourceColumnName: "イベント種別" }),
          new ConstStringValue({ value: "play" }),
        ],
      }),
    ],
  }),
  new Mixin({
    name: "年月フォーム入力",
    conditions: [
      new PlaceholderCondition({
        template:
          "FORMAT_TIMESTAMP('%Y/%m', ?, 'Asia/Tokyo') = '{{year}}/{{month}}'",
        values: [new SelectValue({ sourceColumnName: "タイムスタンプ" })],
      }),
    ],
  }),
];
