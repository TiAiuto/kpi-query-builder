import { Filter } from "./builder/filter";
import { FilterUsage } from "./builder/filter_usage";
import { RawCondition } from "./builder/raw_condition";
import { RawJoin } from "./builder/raw_join";
import { RawValue } from "./builder/raw_value";
import { RootView } from "./builder/root_view";
import { TransformedValue } from "./builder/transformed_value";
import { ViewResolver } from "./builder/view_resolver";

const filterSample = new Filter({
  name: '契約済み契約',
  conditions: [
    new RawCondition({ raw: 'usage_start_date IS NOT NULL' })
  ]
});

const rootViewSample = new RootView({
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
});

function main() {
  const resolver = new ViewResolver({views: [rootViewSample], filters: [filterSample]});
  resolver.resolve('ユーザコード付きPLUS契約');
  console.log(resolver.resolvedViews);
}
main();
