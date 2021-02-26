import { InCondition } from "./builder/condition/in_condition";
import { RawCondition } from "./builder/condition/raw_condition";
import { UnaryCondition } from "./builder/condition/unary_condition";
import { Mixin } from "./builder/mixin";
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
    conditions: [new RawCondition({ raw: "application_datetime IS NOT NULL" })],
  }),
  new Mixin({
    name: "申込済み二次相談",
    conditions: [new RawCondition({ raw: "submitted_at IS NOT NULL" })],
  }),
  new Mixin({
    name: "勉強会参加済み申込",
    conditions: [new RawCondition({ raw: "attended_at IS NOT NULL" })],
  }),
  new Mixin({
    name: "完了済みオンボコンテンツ",
    conditions: [
      new UnaryCondition({
        template: "? IS NOT NULL",
        value: new SelectValue({ sourceColumnName: "完了日時" }),
      }),
    ],
  }),
  new Mixin({
    name: "オンボコンテンツ_WELCOMEスライド",
    conditions: [
      new UnaryCondition({
        template: '? = "welcome_slide"',
        value: new SelectValue({ sourceColumnName: "コンテンツ名" }),
      }),
    ],
  }),
  new Mixin({
    name: "オンボコンテンツ_ケース相談モーダル",
    conditions: [
      new UnaryCondition({
        template: '? = "counseling_introduction_modal"',
        value: new SelectValue({ sourceColumnName: "コンテンツ名" }),
      }),
    ],
  }),
  new Mixin({
    name: "オンボコンテンツ_勉強会モーダル",
    conditions: [
      new UnaryCondition({
        template: '? = "study_meeting_introduction_modal"',
        value: new SelectValue({ sourceColumnName: "コンテンツ名" }),
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
      new UnaryCondition({
        template: '? IS NOT NULL',
        value: new SelectValue({ sourceColumnName: "開封日時" }),
      }),
    ]
  }),
  new Mixin({
    name: "お知らせ_勉強会",
    conditions: [
      new UnaryCondition({
        template: '? = "study_meeting"',
        value: new SelectValue({ sourceColumnName: "コーナー名" }),
      }),
    ]
  }),
  new Mixin({
    name: "お知らせ_コンテンツリリース",
    conditions: [
      new UnaryCondition({
        template: '? = "content_release"',
        value: new SelectValue({ sourceColumnName: "お知らせ種別" }),
      }),
    ]
  }),
];
