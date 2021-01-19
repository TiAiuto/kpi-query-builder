// 日ごと
// 2020年12月1日から2020年12月31日
// ケース相談TOP表示数、詳細ページ表示数
// 一次相談申込数
// PLUSを契約していたユーザのみ
// ルーティンの場合と初期オンボーディングの場合

const resultColumns = [
  {
    name: 'ケース相談相談TOP表示数',
    alphabetName: 'counseling_top_pv',
    source: 'PLUS契約者アクセスログ',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    filters: [
      {
        name: 'ケース相談TOP表示'
      }
    ],
    groupBy: [
      {
        transform: {
          name: '日付',
          columnName: 'アクセス日時'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談詳細表示数',
    alphabetName: 'counseling_show_pv',
    source: 'PLUS契約者アクセスログ',
    value: 'ユーザコード',
    aggregate: 'COUNT',
    filters: [
      {
        name: 'ケース相談詳細ページ表示'
      }
    ],
    groupBy: [
      {
        transform: {
          name: '日付',
          columnName: 'アクセス日時'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談申込数',
    alphabetName: 'counseling_case_applications_count',
    source: '個別ケース相談一次相談',
    value: 'ユーザコード',
    aggregate: 'COUNT',
    filters: [
      {
        name: '個別ケース相談申し込み済み一次相談'
      }
    ],
    groupBy: [
      {
        transform: {
          name: '日付',
          columnName: '申込日時'
        }
      }
    ],
  }
];

const resultRows = [
  {
    pattern: {
      name: '日付'
    },
  }
];

const filters = [
  {
    name: '成功リクエスト',
    conditions: [
      {raw: 'status_code = \'200\''}
    ]
  },
  {
    name: '契約者リクエスト',
    conditions: [
      {raw: 'status_code = \'200\''}
    ]
  },
  {
    name: 'ケース相談TOP表示',
    conditions: [
      {raw: 'REGEXP_CONTAINS(path, \'^/plus/counseling$\')'}
    ]
  },
  {
    name: 'ケース相談詳細ページ表示',
    conditions: [
      {raw: 'REGEXP_CONTAINS(path, \'^/plus/counseling/\\w+?$\')'}
    ]
  },
  {
    name: '個別ケース相談申し込み済み一次相談',
    conditions: [
      {raw: 'application_datetime IS NOT NULL'}
    ]
  },
  {
    name: 'PLUS契約ユーザ（解約済み含む）',
    conditions: [
      {
        type: 'IN',
        columnName: 'ユーザコード',
        selectColumn: {
          source: 'ユーザコード付きPLUS契約',
          columnName: 'ユーザコード'
        }
      }
    ]
  }
];

const rootViews = [
  {
    name: 'ユーザコード付きPLUS契約',
    source: '`h-navi.lo_production.plus_contracts` plus_contracts',
    columns: [
      {
        name: '利用開始日',
        alphabetName: 'usage_start_date_jst',
        sourceName: 'DATE(usage_start_date, \'+9\')'
      },
      {
        name: '利用終了日',
        alphabetName: 'usage_end_date_jst',
        sourceName: 'DATE(usage_end_date, \'+9\')'
      },
      {
        name: 'ユーザコード',
        alphabetName: 'user_code',
        originalName: 'users.code',
      },
      {
        name: 'ユーザID',
        alphabetName: 'user_id',
        originalName: 'user_id',
      },
    ],
    conditions: [
      {
        raw: 'plus_contracts.usage_start_date IS NOT NULL'
      }
    ],
    joins: [
      {
        source: '`h-navi.lo_production.users` users',
        on: 'plus_contracts.contractor_user_id = users.id'
      }
    ],
  },
  {
    name: 'PLUSユーザコード付きアクセスログ',
    source: '`h-navi.lo_applog_transform.action_rack_plus_*` rack_plus',
    dateSuffixEnabled: true,
    columns: [
      {
        name: 'ユーザコード',
        alphabetName: 'user_code',
        originalName: 'users.code',
      },
      {
        name: 'path',
        alphabetName: 'path',
        originalName: 'rack_plus.path',
      },
      {
        name: 'アクセス日時',
        alphabetName: 'time',
        originalName: 'TIMESTAMP_SECONDS(rack_plus.time)',
      }
    ],
    joins: [
      {
        source: '`h-navi.lo_production.users` users',
        on: 'rack_plus.user_id = users.id'
      }
    ],
    filters: [
      {
        name: '成功リクエスト'
      }
    ]
  },
  {
    name: '個別ケース相談一次相談',
    source: '`h-navi.lo_plusmine_production.counseling_case_application_tickets` application_tickets',
    columns: [
      {
        name: 'ユーザコード',
        alphabetName: 'user_code',
        originalName: 'application_tickets.user_code',
      },
      {
        name: '申込日時',
        alphabetName: 'application_datetime',
        originalName: 'application_tickets.application_datetime',
      },
    ]
  }
];

const views = [
  {
    name: 'PLUS契約者アクセスログ',
    source: 'PLUSユーザコード付きアクセスログ',
    extendedColumns: [
      {
        name: 'ユーザコード',
        alphabetName: 'user_code',
        originalName: 'user_code'
      },
      {
        name: 'path',
        alphabetName: 'path',
        originalName: 'path'
      },
      {
        name: 'アクセス日時',
        alphabetName: 'time',
        originalName: 'time'
      }
    ],
    filters: [
      {
        name: 'PLUS契約ユーザ（解約済み含む）'
      }
    ]
  },
];

function resolveQuery(resolvedQueries, name) {
  for (let resolvedQuery of resolvedQueries) {
    if (resolvedQuery.name === name) {
      return resolvedQuery; // 既に解決済みなら前回の値を返す
    }
  }
  for (let rootViewDefinition of rootViews) {
    if (rootViewDefinition.name === name) {
      return {
        name: rootViewDefinition.name,
        resolvedSource: rootViewDefinition.source,
        resolvedColumns: []
      };
    }
  }
  for (let viewDefinition of views) {
    if (viewDefinition.name === name) {
      return {};
    }
  }
  throw new Error(`${options.name}は未定義です`);
}

function main() {
  const resolvedQueries = [];

  resultColumns.forEach((resultColumn) => {
    const resolvedView = resolveQuery(resolvedQueries, resultColumn.source);

    console.log(resolvedView);

    // いったんCOUNT, transformありの場合だけ実装する
    console.log(`SELECT COUNT(${resultColumn.value}) AS ${resultColumn.alphabetName} 
      FROM (
      SELECT FORMAT_TIMESTAMP('%Y-%m-%d', ${resultColumn.groupBy[0].transform.columnName}, 'Asia/Tokyo') AS auto_generated_unit_name, 
      ${resultColumn.value}
      FROM ${resultColumn.source}
      )
      GROUP BY auto_generated_unit_name
      `);
  });
}

main();
