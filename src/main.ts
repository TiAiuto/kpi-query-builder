import { Filter } from "./builder/filter";
import { FilterUsage } from "./builder/filter_usage";
import { InCondition } from "./builder/in_condition";
import { QueryView } from "./builder/query_view";
import { RawCondition } from "./builder/raw_condition";
import { RawJoin } from "./builder/raw_join";
import { RawValue } from "./builder/raw_value";
import { RootView } from "./builder/root_view";
import { SelectValueSet } from "./builder/select_value_set";
import { TransformedValue } from "./builder/transformed_value";
import { ViewResolver } from "./builder/view_resolver";

function main() {
  const resolver = new ViewResolver({
    filters: [
      new Filter({
        name: '契約済み契約',
        conditions: [
          new RawCondition({ raw: 'usage_start_date IS NOT NULL' })
        ]
      }),
      new Filter({
        name: 'PLUS契約ユーザ（解約済み含む）',
        conditions: [
          new InCondition({
            valueSet: new SelectValueSet({
              source: 'ユーザコード付きPLUS契約',
              sourceColumnName: '契約ユーザコード'
            })
          })
        ]
      })
    ], 
    views: [
      new RootView({
        name: 'ユーザコード付きPLUS契約',
        alphabetName: 'plus_contracts_with_user_code',
        physicalSource: '`h-navi.lo_production.plus_contracts`',
        physicalSourceAlias: 'plus_contracts',
        dateSuffixEnabled: false,
        columns: [
          new TransformedValue({
            name: '利用開始日タイムスタンプ',
            alphabetName: 'usage_start_date_timestamp',
            value: new RawValue({ raw: 'usage_start_date' })
          }),
          new TransformedValue({
            name: '利用終了日タイムスタンプ',
            alphabetName: 'usage_end_date_timestamp',
            value: new RawValue({ raw: 'usage_end_date' })
          }),
          new TransformedValue({
            name: '契約ユーザコード',
            alphabetName: 'contracted_user_code',
            value: new RawValue({ raw: 'users.code' })
          }),
          new TransformedValue({
            name: '契約ユーザID',
            alphabetName: 'contracted_user_id',
            value: new RawValue({ raw: 'users.id' })
          }),
        ],
        filterUsages: [
          new FilterUsage({ name: '契約済み契約' })
        ],
        joins: [
          new RawJoin({ raw: 'JOIN `h-navi.lo_production.users` users ON plus_contracts.contractor_user_id = users.id' })
        ],
      }),
      new RootView({
        name: 'PLUSユーザコード付きアクセスログ',
        alphabetName: 'plus_users_logs_with_user_code',
        physicalSource: '`h-navi.lo_applog_transform.action_rack_plus_*`',
        physicalSourceAlias: 'rack_plus',
        dateSuffixEnabled: true,
        columns: [
          new TransformedValue({
            name: 'ユーザコード',
            alphabetName: 'user_code',
            value: new RawValue({ raw: 'users.code' })
          }),
          new TransformedValue({
            name: 'path',
            alphabetName: 'path',
            value: new RawValue({ raw: 'rack_plus.path' })
          }),
          new TransformedValue({
            name: 'タイムスタンプ',
            alphabetName: 'time',
            value: new RawValue({ raw: 'TIMESTAMP_SECONDS(rack_plus.time)' })
          })
        ]
      }), 
      new QueryView(  {
        name: 'PLUS契約者アクセスログ',
        alphabetName: 'plus_contracted_users_logs',
        source: 'PLUSユーザコード付きアクセスログ',
        columnsInheritanceEnabled: true,
        filterUsages: [
          new FilterUsage({
            name: 'PLUS契約ユーザ（解約済み含む）'
          })
        ]
      })
    ],
  });
  resolver.resolve('PLUS契約者アクセスログ');
  console.log(resolver.resolvedViews);
}
main();