// 日ごと
// 2020年12月1日から2020年12月31日
// ケース相談TOP表示数、詳細ページ表示数
// 一次相談申込数
// PLUSを契約していたユーザのみ
// ルーティンの場合と初期オンボーディングの場合

// これは引数で渡せるようにしたほうがよさそう
const targetDateRange = ['20200901', '20210119'];

const caseApplicationDailyPv = [
  {
    name: 'ケース相談相談TOP表示数',
    alphabetName: 'counseling_top_pv',
    source: '[ACTION]個別ケース相談TOP表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    groupBy: [ // groupByはaggregateの中に入れてもいいかも
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談詳細表示数',
    alphabetName: 'counseling_show_pv',
    source: '[ACTION]ケース相談詳細ページ表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談1次相談新規作成フォーム表示数',
    alphabetName: 'visit_counseling_first_question_form_pv',
    source: '[ACTION]ケース相談1次相談新規作成フォーム表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談1次相談編集フォーム表示数',
    alphabetName: 'visit_counseling_first_question_edit_form_pv',
    source: '[ACTION]ケース相談1次相談編集フォーム表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談申込数',
    alphabetName: 'counseling_case_applications_count',
    source: '[ACTION]ケース相談一次相談申込',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談詳細表示数',
    alphabetName: 'visit_counseling_application_detail_pv',
    source: '[ACTION]ケース相談相談詳細ページ表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談二次相談編集フォーム表示数',
    alphabetName: 'visit_counseling_application_second_question_edit_pv',
    source: '[ACTION]ケース相談二次相談編集ページ表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談申込数',
    alphabetName: 'submit_counseling_case_application_second_question_count',
    source: '[ACTION]ケース相談二次相談申込',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
];

const caseApplicationsDailyUu = [
  {
    name: 'ケース相談相談TOP表示数',
    alphabetName: 'counseling_top_uu',
    source: '[ACTION]個別ケース相談TOP表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT_DISTINCT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談詳細表示数',
    alphabetName: 'counseling_show_uu',
    source: '[ACTION]ケース相談詳細ページ表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT_DISTINCT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談1次相談新規作成フォーム表示数',
    alphabetName: 'visit_counseling_first_question_form_uu',
    source: '[ACTION]ケース相談1次相談新規作成フォーム表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT_DISTINCT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談1次相談編集フォーム表示数',
    alphabetName: 'visit_counseling_first_question_edit_form_uu',
    source: '[ACTION]ケース相談1次相談編集フォーム表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT_DISTINCT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談申込数',
    alphabetName: 'counseling_case_applications_uu_count',
    source: '[ACTION]ケース相談一次相談申込',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT_DISTINCT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談詳細表示数',
    alphabetName: 'visit_counseling_application_detail_uu',
    source: '[ACTION]ケース相談相談詳細ページ表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT_DISTINCT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談二次相談編集フォーム表示数',
    alphabetName: 'visit_counseling_application_second_question_edit_uu',
    source: '[ACTION]ケース相談二次相談編集ページ表示',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT_DISTINCT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談申込数',
    alphabetName: 'submit_counseling_case_application_second_question_uu_count',
    source: '[ACTION]ケース相談二次相談申込',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT_DISTINCT',
    },
    groupBy: [
      {
        transform: {
          name: '日付抽出'
        }
      }
    ],
  },
];

const resultColumns = caseApplicationsDailyUu;

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
      {
        type: 'raw',
        raw: 'status_code = \'200\''
      }
    ]
  },
  {
    name: '契約者リクエスト',
    conditions: [
      {
        type: 'raw',
        raw: 'status_code = \'200\''
      }
    ]
  },
  {
    name: '契約済み契約',
    conditions: [
      {
        type: 'raw',
        raw: 'usage_start_date IS NOT NULL'
      }
    ]
  },
  {
    name: '個別ケース相談申し込み済み一次相談',
    conditions: [
      {
        type: 'raw',
        raw: 'application_datetime IS NOT NULL'
      }
    ]
  },
  {
    name: '個別ケース相談申し込み済み二次相談',
    conditions: [
      {
        type: 'raw',
        raw: 'submitted_at IS NOT NULL'
      }
    ]
  },
  {
    name: 'PLUS契約ユーザ（解約済み含む）',
    conditions: [
      {
        type: 'in',
        columnName: 'ユーザコード',
        valueSetType: 'selectColumn',
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
    alphabetName: 'plus_contracts_with_user_code',
    source: '`h-navi.lo_production.plus_contracts` plus_contracts',
    columns: [
      {
        name: '利用開始日',
        alphabetName: 'usage_start_date_jst',
        originalName: 'DATE(usage_start_date, \'+9\')'
      },
      {
        name: '利用終了日',
        alphabetName: 'usage_end_date_jst',
        originalName: 'DATE(usage_end_date, \'+9\')'
      },
      {
        name: 'ユーザコード',
        alphabetName: 'user_code',
        originalName: 'users.code',
      },
      {
        name: 'ユーザID',
        alphabetName: 'user_id',
        originalName: 'users.id',
      },
    ],
    filters: [
      {
        name: '契約済み契約'
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
    alphabetName: 'plus_users_logs_with_user_code',
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
        name: 'タイムスタンプ',
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
    alphabetName: 'plus_counseling_first_applictions',
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
  },
  {
    name: '個別ケース相談二次相談',
    alphabetName: 'plus_counseling_second_applictions',
    source: '`h-navi.lo_plusmine_production.counseling_case_additional_question_tickets` second_question_tickets',
    columns: [
      {
        name: 'ユーザコード',
        alphabetName: 'user_code',
        originalName: 'second_question_tickets.user_code',
      },
      {
        name: '提出日時',
        alphabetName: 'submitted_at',
        originalName: 'second_question_tickets.submitted_at',
      },
    ],
  }
];

const views = [
  {
    name: 'PLUS契約者アクセスログ',
    alphabetName: 'plus_contracted_users_logs',
    source: 'PLUSユーザコード付きアクセスログ',
    columnsInheritanceEnabled: true,
    filters: [
      {
        name: 'PLUS契約ユーザ（解約済み含む）'
      }
    ]
  },
  {
    name: '[ACTION]個別ケース相談TOP表示',
    alphabetName: 'visit_counseling_top',
    source: 'PLUS契約者アクセスログ',
    columnsInheritanceEnabled: true,
    conditions: [
      {
        type: 'raw',
        raw: 'REGEXP_CONTAINS(path, \'^/plus/counseling$\')'
      }
    ]
  },
  {
    name: '[ACTION]ケース相談詳細ページ表示',
    alphabetName: 'visit_counseling_show',
    source: 'PLUS契約者アクセスログ',
    columnsInheritanceEnabled: true,
    conditions: [
      {
        type: 'raw',
        raw: 'REGEXP_CONTAINS(path, \'^/plus/counseling/\\\\w+?$\')'
      }
    ]
  },
  {
    name: '[ACTION]ケース相談1次相談新規作成フォーム表示',
    alphabetName: 'visit_counseling_first_question_form',
    source: 'PLUS契約者アクセスログ',
    columnsInheritanceEnabled: true,
    conditions: [
      {
        type: 'raw',
        raw: 'REGEXP_CONTAINS(path, \'^/plus/counseling/\\\\w+?/form$\')'
      }
    ]
  },
  {
    name: '[ACTION]ケース相談1次相談編集フォーム表示',
    alphabetName: 'visit_counseling_first_question_edit_form',
    source: 'PLUS契約者アクセスログ',
    columnsInheritanceEnabled: true,
    conditions: [
      {
        type: 'raw',
        raw: 'REGEXP_CONTAINS(path, \'^/plus/mypage/case_applications/\\\\w+?/edit$\')'
      }
    ]
  },
  {
    name: '[ACTION]ケース相談一次相談申込',
    alphabetName: 'submit_counseling_case_application',
    source: '個別ケース相談一次相談',
    columnsInheritanceEnabled: true,
    columns: [
      {
        name: 'タイムスタンプ',
        alphabetName: 'time',
        originalName: '申込日時'
      }
    ],
    filters: [
      {
        name: '個別ケース相談申し込み済み一次相談'
      }
    ],
  },
  {
    name: '[ACTION]ケース相談二次相談申込',
    alphabetName: 'submit_counseling_case_application_second_question',
    source: '個別ケース相談二次相談',
    columnsInheritanceEnabled: true,
    columns: [
      {
        name: 'タイムスタンプ',
        alphabetName: 'time',
        originalName: '提出日時'
      }
    ],
    filters: [
      {
        name: '個別ケース相談申し込み済み二次相談'
      }
    ],
  },
  {
    name: '[ACTION]ケース相談相談詳細ページ表示',
    alphabetName: 'visit_counseling_application_detail',
    source: 'PLUS契約者アクセスログ',
    columnsInheritanceEnabled: true,
    conditions: [
      {
        type: 'raw',
        raw: 'REGEXP_CONTAINS(path, \'^/plus/mypage/case_applications/\\\\w+?$\')'
      }
    ]
  },
  {
    name: '[ACTION]ケース相談二次相談編集ページ表示',
    alphabetName: 'visit_counseling_application_second_question_edit',
    source: 'PLUS契約者アクセスログ',
    columnsInheritanceEnabled: true,
    conditions: [
      {
        type: 'raw',
        raw: 'REGEXP_CONTAINS(path, \'^/plus/mypage/case_applications/\\\\w+?/second_question$\')'
      }
    ]
  },
];

// TODO: このロジックはクラスに移せそう
function resolveColumnByViewColumns(viewColumns, columnName) {
  for (let column of viewColumns) {
    if (column.name === columnName) {
      return column.alphabetName;
    }
  }
  throw new Error(`${columnName}は未定義`);
}

// TODO: このロジックはクラスに移せそう
function resolveColumnByResolvedQuery(resolvedQuery, columnName) {
  for (let resolvedColumn of resolvedQuery.resolvedColumns) {
    if (resolvedColumn.name === columnName) {
      return resolvedColumn.alphabetName;
    }
  }
}

// TODO: このロジックはクラスに移せそう
function appendInheritedColumns(viewDefinition, dependentQuery) {
  if (viewDefinition.columnsInheritanceEnabled) {
    const columns = (viewDefinition.columns || []).concat([]);
    dependentQuery.resolvedColumns.forEach((column) => {
      columns.push({
        name: column.name,
        alphabetName: column.alphabetName,
        originalName: column.name // 依存先クエリで使っている名前がそのまま自クエリの名前になる
      });
    });
    return columns;
  } else {
    return viewDefinition.columns;
  }
}

function resolveCondition(resolvedQueries, condition, viewColumns) {
  if (condition.type === 'raw') {
    return condition.raw;
  } else if (condition.type === 'in') {
    if (condition.valueSetType === 'selectColumn') {
      const sourceResolvedQuery = resolveQuery(resolvedQueries, condition.selectColumn.source);
      let inCondition = '';
      inCondition += `${resolveColumnByViewColumns(viewColumns, condition.selectColumn.columnName)} IN (`;
      inCondition += `SELECT ${resolveColumnByResolvedQuery(sourceResolvedQuery, condition.selectColumn.columnName)} `;
      inCondition += `FROM ${sourceResolvedQuery.resolvedSource}`;
      inCondition += ') ';
      return inCondition;
    } else {
      throw new Error(`${condition.valueSetType}は未実装`);
    }
  }
}

function resolveFilter(resolvedQueries, filter, abstractViewDefinition) {
  const targetFilterDefinition = filters.find((filterDefinition) => filterDefinition.name === filter.name);
  if (!targetFilterDefinition) {
    throw new Error(`${filter.name}は未定義です`);
  }
  return targetFilterDefinition.conditions.map((condition) => resolveCondition(resolvedQueries, condition, abstractViewDefinition));
}

function buildRootViewQuery(resolvedQueries, rootViewDefinition) {
  const columns = rootViewDefinition.columns.map((column) => `${column.originalName} AS ${column.alphabetName} `)
    .join(', ');
  const joins = (rootViewDefinition.joins || []).map((join) => `JOIN ${join.source} ON ${join.on} `)
    .join('\n');
  const conditions = (rootViewDefinition.conditions || []).map((condition) => resolveCondition(resolvedQueries, condition, rootViewDefinition.columns));
  let filterConditions = [];
  (rootViewDefinition.filters || []).forEach((filter) => filterConditions = [...filterConditions, ...resolveFilter(resolvedQueries, filter, rootViewDefinition.columns)]);
  const conditionsAndFilters = [...conditions, ...filterConditions];
  if (rootViewDefinition.dateSuffixEnabled) {
    conditionsAndFilters.push(` _TABLE_SUFFIX BETWEEN '${targetDateRange[0]}' AND '${targetDateRange[1]}' `);
  }
  return `SELECT ${columns} \n FROM ${rootViewDefinition.source} \n ${joins} \n WHERE ${conditionsAndFilters.length ? conditionsAndFilters.join(' AND ') : 'TRUE'} `;
}

function buildViewQuery(resolvedQueries, viewDefinition, dependentQuery) {
  const viewColumns = appendInheritedColumns(viewDefinition, dependentQuery);
  // viewはjoinsは未実装
  const columns = viewColumns.map((column) => `${resolveColumnByResolvedQuery(dependentQuery, column.originalName)} AS ${column.alphabetName} `)
    .join(', ');
  const conditions = (viewDefinition.conditions || []).map((condition) => resolveCondition(resolvedQueries, condition, viewColumns));
  let filterConditions = [];
  (viewDefinition.filters || []).forEach((filter) => filterConditions = [...filterConditions, ...resolveFilter(resolvedQueries, filter, viewColumns)]);
  const conditionsAndFilters = [...conditions, ...filterConditions];
  return `SELECT ${columns} \n FROM ${dependentQuery.resolvedSource} \n WHERE ${conditionsAndFilters.length ? conditionsAndFilters.join(' AND ') : 'TRUE'} `;
}

function resolveQuery(resolvedQueries, name) {
  for (let resolvedQuery of resolvedQueries) {
    if (resolvedQuery.name === name) {
      return resolvedQuery; // 既に解決済みなら前回の値を返す
    }
  }
  for (let rootViewDefinition of rootViews) {
    if (rootViewDefinition.name === name) {
      const result = {
        name,
        resolvedSource: rootViewDefinition.alphabetName,
        resolvedColumns: rootViewDefinition.columns,
        sql: buildRootViewQuery(resolvedQueries, rootViewDefinition)
      };
      resolvedQueries.push(result);
      return result;
    }
  }
  for (let viewDefinition of views) {
    if (viewDefinition.name === name) {
      const dependentQuery = resolveQuery(resolvedQueries, viewDefinition.source);
      const resolvedColumns = appendInheritedColumns(viewDefinition, dependentQuery);
      const result = {
        name,
        resolvedSource: viewDefinition.alphabetName,
        resolvedColumns,
        sql: buildViewQuery(resolvedQueries, viewDefinition, dependentQuery)
      };
      resolvedQueries.push(result);
      return result;
    }
  }
  throw new Error(`${name}は未定義です`);
}

function findResolvedColumnName(resolvedView, name) {
  for (let resolvedColumn of resolvedView.resolvedColumns) {
    if (resolvedColumn.name === name) {
      return resolvedColumn.alphabetName;
    }
  }
  throw new Error(`${name}は未定義です`);
}

function buildAggregatePhrase(aggregateType, columnAlphabetName) {
  if (aggregateType === 'COUNT') {
    return `COUNT(${columnAlphabetName})`;
  } else if (aggregateType === 'COUNT_DISTINCT') {
    return `COUNT(DISTINCT ${columnAlphabetName})`;
  } else {
    throw new Error(`${aggregateType}は未実装`);
  }
}

function buildGeneratedUnitPhrase(unitType, columnAlphabetName) {
  return `FORMAT_TIMESTAMP('%Y-%m-%d', ${columnAlphabetName}, 'Asia/Tokyo')`;
}

function main() {
  const resolvedQueries = [];
  const resultColumnSelect = [];
  const resultColumnJoins = [];

  // resultRowsが複数ある場合の挙動は要検討、行が増えるがどう増やすか？
  resultRows.forEach((resultRow) => {
    if (resultRow.pattern.name === '日付') {
      resolvedQueries.push({
        name: '列日付基準集合生成クエリ',
        resolvedSource: 'row_base_unit_value',
        resolvedColumns: [
          {
            name: '集計基準値',
            alphabetName: 'unit_value',
            originalName: 'unit_value'
          }
        ],
        sql: `SELECT FORMAT_DATE("%Y-%m-%d", unit_value) as unit_value FROM UNNEST(GENERATE_DATE_ARRAY(PARSE_DATE("%Y%m%d", "${targetDateRange[0]}"), 
          PARSE_DATE("%Y%m%d", "${targetDateRange[1]}"))) AS unit_value`
      });
    } else {
      throw new Error(`${resultRow.pattern.name} は未実装`);
    }
  });

  resultColumns.forEach((resultColumn) => {
    const resolvedView = resolveQuery(resolvedQueries, resultColumn.source);

    let filterConditions = [];
    (resultColumn.filters || []).forEach((filter) => {
      // TODO: resolveFilterの第三引数に現在のviewの定義を渡す必要がある
      filterConditions = [...filterConditions, resolveFilter(resolvedQueries, filter, {})];
    });

    const aggregatePhrase = buildAggregatePhrase(resultColumn.aggregate.type, findResolvedColumnName(resolvedView, resultColumn.value));
    // TODO: そもそもtransformが必要かどうかで分岐が必要
    const generatedUnitPhrase = buildGeneratedUnitPhrase(resultColumn.groupBy[0].transform.name, findResolvedColumnName(resolvedView, resultColumn.groupBy[0].transform.columnName || 'タイムスタンプ'));

    // いったんCOUNT, transformありの場合だけ実装する
    resolvedQueries.push({
      name: resultColumn.name,
      resolvedSource: resultColumn.alphabetName,
      resolvedColumns: [
        {
          name: resultColumn.name,
          alphabetName: resultColumn.alphabetName + '_value',
          originalName: resultColumn.alphabetName + '_value'
        },
        {
          name: '集計単位（自動生成）',
          alphabetName: 'auto_generated_unit_name',
          originalName: 'auto_generated_unit_name'
        }
      ],
      sql: `SELECT 
      auto_generated_unit_name, 
      ${aggregatePhrase} AS ${resultColumn.alphabetName}_value 
      FROM (
      SELECT ${generatedUnitPhrase} AS auto_generated_unit_name, 
      ${findResolvedColumnName(resolvedView, resultColumn.value)}
      FROM ${resolvedView.resolvedSource}
      WHERE ${filterConditions.length ? filterConditions.join(' AND ') : 'TRUE'}
      )
      GROUP BY auto_generated_unit_name
      ORDER BY auto_generated_unit_name`
    });

    resultColumnSelect.push(` ${resultColumn.alphabetName}.${resultColumn.alphabetName}_value AS ${resultColumn.alphabetName} `);
    resultColumnJoins.push(`LEFT JOIN ${resultColumn.alphabetName} ON unit_value = ${resultColumn.alphabetName}.auto_generated_unit_name`);
  });

  const withQueries = resolvedQueries.map((resolvedQuery) => `${resolvedQuery.resolvedSource} AS (${resolvedQuery.sql})`);
  console.log('WITH ' + withQueries.join(', \n'));
  console.log(` SELECT unit_value, ${resultColumnSelect.join(', ')} \n FROM row_base_unit_value ${resultColumnJoins.join('\n')} ORDER BY unit_value `);
}

main();
