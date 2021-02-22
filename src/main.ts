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
import { ActionReportView } from "./builder/view/action_report_view";
import { ActionReportViewActionReference } from "./builder/action_report_view_action_reference";
import { BinomialCondition } from "./builder/condition/binomial_condition";

function main() {
  const resolver = new ViewResolver({
    mixins: [
      new Mixin({
        name: "契約済み契約",
        conditions: [new RawCondition({ raw: "usage_start_date IS NOT NULL" })],
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
        ],
        joins: [
          new RawJoin({
            raw:
              "JOIN `h-navi.lo_production.users` users ON rack_plus.user_id = users.id",
          }),
        ],
      }),
      new RootView({
        name: "個別ケース相談一時相談",
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
        columnsInheritanceEnabled: true,
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
        actionName: "ACTION_PLUS利用開始",
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
      }),
      new ActionView({
        actionName: "ACTION_個別ケース相談一時相談",
        actionAlphabetName: "action_submit_counseling_first_question",
        source: "個別ケース相談一時相談",
        columns: [
          new ValueSurface({
            name: "ユーザコード",
            alphabetName: "user_code",
            value: new SelectValue({ sourceColumnName: "ユーザコード" }),
          }),
          new ValueSurface({
            name: "タイムスタンプ",
            alphabetName: "time",
            value: new SelectValue({ sourceColumnName: "申込日時" }),
          }),
        ],
        mixinUsages: [new MixinUsage({ name: "申込済み一時相談" })],
      }),
      new ActionReportView({
        name: "使用状況レポート",
        alphabetName: "usage_report",
        periodViewName: "いったん無視",
        baseAction: new ActionReportViewActionReference({
          actionName: "ACTION_PLUS利用開始",
        }),
        relatedActions: [
          new ActionReportViewActionReference({
            actionName: "ACTION_個別ケース相談一時相談",
            actionNameAlias: "ACTION_個別ケース相談一時相談1",
            conditions: [
              new BinomialCondition({
                value: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                  source: "ACTION_個別ケース相談一時相談1",
                }),
                otherValue: new SelectValue({
                  sourceColumnName: "タイムスタンプ",
                  source: "ACTION_PLUS利用開始",
                }),
                template: "DATE_DIFF(DATE(?), DATE(?), DAY) <= 31",
              }),
            ],
          }),
        ],
      }),
    ],
  });
  const bootstrapViewName = "使用状況レポート";
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
