import { Filter } from "./builder/filter";
import { FilterUsage } from "./builder/filter_usage";
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

function main() {
  const resolver = new ViewResolver({
    filters: [
      new Filter({
        name: "契約済み契約",
        conditions: [new RawCondition({ raw: "usage_start_date IS NOT NULL" })],
      }),
      new Filter({
        name: "PLUS契約ユーザ（解約済み含む）",
        conditions: [
          new InCondition({
            sourceColumnName: "ユーザコード",
            valueSet: new SelectValueSet({
              source: "ユーザコード付きPLUS契約",
              sourceColumnName: "契約ユーザコード",
            }),
          }),
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
            value: new RawValue({ raw: "usage_start_date" }),
          }),
          new ValueSurface({
            name: "利用終了日タイムスタンプ",
            alphabetName: "usage_end_date_timestamp",
            value: new RawValue({ raw: "usage_end_date" }),
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
        filterUsages: [new FilterUsage({ name: "契約済み契約" })],
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
              pattern: new TransformPattern({ name: "タイムスタンプ_月" }),
            }),
          }),
        ],
        columnsInheritanceEnabled: true,
        filterUsages: [
          new FilterUsage({
            name: "PLUS契約ユーザ（解約済み含む）",
          }),
        ],
      }),
    ],
  });
  resolver.resolve("PLUS契約者アクセスログ");
  const withQueries = resolver.resolvedViews
    .map(
      (resolvedView) =>
        `${resolvedView.physicalName} AS ( ${resolvedView.sql} )`
    )
    .join(", \n");
  console.log(withQueries);
}
main();
