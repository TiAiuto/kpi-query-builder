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
          name: '月抽出'
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
          name: '月抽出'
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
          name: '月抽出'
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
          name: '月抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談相談申込数',
    alphabetName: 'counseling_case_applications_count',
    source: '[ACTION]ケース相談一次相談申込契約後一定期間内',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    groupBy: [
      {
        transform: {
          name: '月抽出'
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
          name: '月抽出'
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
          name: '月抽出'
        }
      }
    ],
  },
  {
    name: 'ケース相談二次相談申込数',
    alphabetName: 'submit_counseling_case_application_second_question_count',
    source: '[ACTION]ケース相談二次相談申込契約後一定期間内',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT',
    },
    groupBy: [
      {
        transform: {
          name: '月抽出'
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
          name: '月抽出'
        }
      }
    ],
    filters: [
      {
        name: '契約後一ヶ月以内'
      }
    ]
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
          name: '月抽出'
        }
      }
    ],
    filters: [
      {
        name: '契約後一ヶ月以内'
      }
    ]
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
          name: '月抽出'
        }
      }
    ],
    filters: [
      {
        name: '契約後一ヶ月以内'
      }
    ]
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
          name: '月抽出'
        }
      }
    ],
    filters: [
      {
        name: '契約後一ヶ月以内'
      }
    ]
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
          name: '月抽出'
        }
      }
    ],
    filters: [
      {
        name: '契約後一ヶ月以内'
      }
    ]
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
          name: '月抽出'
        }
      }
    ],
    filters: [
      {
        name: '契約後一ヶ月以内'
      }
    ]
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
          name: '月抽出'
        }
      }
    ],
    filters: [
      {
        name: '契約後一ヶ月以内'
      }
    ]
  },
  {
    name: 'ケース相談二次相談申込数',
    alphabetName: 'submit_counseling_case_application_second_question_uu_count',
    source: '[ACTION]ケース相談二次相談申込',
    value: 'ユーザコード',
    aggregate: {
      type: 'COUNT_DISTINCT',
    },
    groupBy: [
      {
        transform: {
          name: '月抽出'
        }
      }
    ],
    filters: [
      {
        name: '契約後一ヶ月以内'
      }
    ]
  },
];

const resultColumns = caseApplicationsDailyUu;

const resultRows = [
  {
    pattern: {
      name: '月抽出'
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
          columnName: '契約ユーザコード'
        }
      }
    ]
  },
  {
    name: '契約後一ヶ月以内',
    joins: [
      {
        type: 'join',
        target: 'ユーザコード付きPLUS契約',
        conditions: [
          {
            sourceColumnName: 'ユーザコード',
            targetColumnName: '契約ユーザコード'
          }
        ]
      }
    ],
    conditions: [
      {
        type: 'raw',
        // 本当はここで条件の利用に必須のカラムを明示できるといい
        raw: 'time BETWEEN usage_start_date_timestamp AND TIMESTAMP_ADD(usage_start_date_timestamp, INTERVAL 31 DAY)'
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
        name: '利用開始日タイムスタンプ',
        alphabetName: 'usage_start_date_timestamp',
        originalName: 'usage_start_date'
      },
      {
        name: '利用終了日タイムスタンプ',
        alphabetName: 'usage_end_date_timestamp',
        originalName: 'usage_end_date'
      },
      {
        name: '契約ユーザコード',
        alphabetName: 'contracted_user_code',
        originalName: 'users.code',
      },
      {
        name: '契約ユーザID',
        alphabetName: 'contracted_user_id',
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
        type: 'raw',
        raw: 'JOIN `h-navi.lo_production.users` users ON plus_contracts.contractor_user_id = users.id',
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
        type: 'raw',
        raw: 'JOIN `h-navi.lo_production.users` users ON rack_plus.user_id = users.id',
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
    ],
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
    ],
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
    ],
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
    ],
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
    ]
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
    ],
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
    ],
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
      inCondition += `${resolveColumnByViewColumns(viewColumns, condition.columnName)} IN (`;
      inCondition += `SELECT ${resolveColumnByResolvedQuery(sourceResolvedQuery, condition.selectColumn.columnName)} `;
      inCondition += `FROM ${sourceResolvedQuery.resolvedSource}`;
      inCondition += ') ';
      return inCondition;
    } else {
      throw new Error(`${condition.valueSetType}は未実装`);
    }
  }
}

function resolveFilter(resolvedQueries, filterName) {
  const targetFilterDefinition = filters.find((filterDefinition) => filterDefinition.name === filterName);
  if (!targetFilterDefinition) {
    throw new Error(`${filterName}は未定義です`);
  }
  return targetFilterDefinition;
}

function buildJoinPhrase(resolvedQueries, joinDefinition, viewAlphabetName, viewColumns) {
  if (joinDefinition.type === 'raw') {
    return joinDefinition.raw;
  } else if (joinDefinition.type === 'join') {
    return joinDefinition.conditions.map((joinCondition) => {
      const targetResolvedQuery = resolveQuery(resolvedQueries, joinDefinition.target);
      let joinPhrase = `JOIN ${targetResolvedQuery.resolvedSource} ON `;
      joinPhrase += `${viewAlphabetName}.${resolveColumnByViewColumns(viewColumns, joinCondition.sourceColumnName)}`;
      joinPhrase += ' = ';
      joinPhrase += `${targetResolvedQuery.resolvedSource}.${resolveColumnByResolvedQuery(targetResolvedQuery, joinCondition.targetColumnName)}`;
      return joinPhrase
    }).join(' \n ');
  }
  console.error(joinDefinition);
  throw new Error(`${joinDefinition.type}は未定義`);
}

function buildRootViewQuery(resolvedQueries, rootViewDefinition) {
  const columnsToSelect = rootViewDefinition.columns.map((column) => `${column.originalName} AS ${column.alphabetName} `).join(', ');

  let joinDefs = rootViewDefinition.joins || [];
  let conditionDefs = rootViewDefinition.conditions || [];

  (rootViewDefinition.filters || []).forEach((filterRef) => {
    const filter = resolveFilter(resolvedQueries, filterRef.name, rootViewDefinition.columns);
    conditionDefs = conditionDefs.concat(filter.conditions || []);
    joinDefs = joinDefs.concat(filter.joins || []);
  });

  const conditionPhrases = conditionDefs.map((condition) => resolveCondition(resolvedQueries, condition, rootViewDefinition.columns));
  if (rootViewDefinition.dateSuffixEnabled) {
    conditionPhrases.push(` _TABLE_SUFFIX BETWEEN '${targetDateRange[0]}' AND '${targetDateRange[1]}' `);
  }
  const joins = joinDefs.map((join) => buildJoinPhrase(resolvedQueries, join, rootViewDefinition.alphabetName, rootViewDefinition.columns))
    .join('\n');
  return `SELECT ${columnsToSelect} \n FROM ${rootViewDefinition.source} \n ${joins} \n WHERE ${conditionPhrases.length ? conditionPhrases.join(' AND ') : 'TRUE'} `;
}

function buildViewQuery(resolvedQueries, viewDefinition, dependentQuery) {
  const viewColumns = appendInheritedColumns(viewDefinition, dependentQuery);
  // viewはjoinsは未実装
  const columnsToSelect = viewColumns.map((column) => `${resolveColumnByResolvedQuery(dependentQuery, column.originalName)} AS ${column.alphabetName} `)
    .join(', ');

  let joinDefs = viewDefinition.joins || [];
  let conditionDefs = viewDefinition.conditions || [];

  (viewDefinition.filters || []).forEach((filterRef) => {
    const filter = resolveFilter(resolvedQueries, filterRef.name);
    conditionDefs = conditionDefs.concat(filter.conditions || []);
    joinDefs = joinDefs.concat(filter.joins || []);
  });
  const conditionPhrases = conditionDefs.map((condition) => resolveCondition(resolvedQueries, condition, viewColumns));
  const joins = joinDefs.map((join) => buildJoinPhrase(resolvedQueries, join, viewDefinition.alphabetName, viewColumns))
    .join('\n');
  return `SELECT ${columnsToSelect} \n FROM ${dependentQuery.resolvedSource} \n ${joins} \n WHERE ${conditionPhrases.length ? conditionPhrases.join(' AND ') : 'TRUE'} `;
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

function buildTransformPhrase(transformType, columnAlphabetName) {
  if (transformType === '日付抽出') {
    return `FORMAT_TIMESTAMP('%Y-%m-%d', ${columnAlphabetName}, 'Asia/Tokyo')`;
  } else if (transformType === '月抽出') {
    return `FORMAT_TIMESTAMP('%Y-%m', ${columnAlphabetName}, 'Asia/Tokyo')`;
  }
}

function main() {
  const resolvedQueries = [];
  const resultColumnSelect = [];
  const resultColumnJoins = [];

  // resultRowsが複数ある場合の挙動は要検討、行が増えるがどう増やすか？
  resultRows.forEach((resultRow) => {
    if (resultRow.pattern.name === '月抽出') {
      const unitValuePhrase = buildTransformPhrase('月抽出', 'TIMESTAMP(unit_raw_value, "Asia/Tokyo")');

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
        sql: `SELECT DISTINCT ${unitValuePhrase} as unit_value FROM UNNEST(GENERATE_DATE_ARRAY(PARSE_DATE("%Y%m%d", "${targetDateRange[0]}"), 
          PARSE_DATE("%Y%m%d", "${targetDateRange[1]}"))) AS unit_raw_value`
      });
    } else {
      throw new Error(`${resultRow.pattern.name} は未実装`);
    }
  });

  resultColumns.forEach((resultColumn) => {
    const resolvedView = resolveQuery(resolvedQueries, resultColumn.source);
    // この集計クエリの内側のクエリが参照できるカラムを指定
    const viewColumns = resolvedView.resolvedColumns; // TODO: auto_generated_unit_name とかも入れてもいいかも

    let joinDefs = resultColumn.joins || [];
    let filterConditions = [];
    (resultColumn.filters || []).forEach((filterRef) => {
      const filter = resolveFilter(resolvedQueries, filterRef.name, viewColumns);
      filter.conditions.forEach((condition) => filterConditions.push(resolveCondition(resolvedQueries, condition, viewColumns)));
      joinDefs = joinDefs.concat(filter.joins || []);
    });
    const conditions = (resultColumn.conditions || []).map((condition) => resolveCondition(resolvedQueries, condition, viewColumns));
    const conditionsAndFilters = [...conditions, ...filterConditions];

    const joins = joinDefs.map((join) => buildJoinPhrase(resolvedQueries, join, resolvedView.resolvedSource, viewColumns))
      .join('\n');

    const aggregatePhrase = buildAggregatePhrase(resultColumn.aggregate.type, findResolvedColumnName(resolvedView, resultColumn.value));
    // TODO: そもそもtransformが必要かどうかで分岐が必要
    const generatedUnitPhrase = buildTransformPhrase(resultColumn.groupBy[0].transform.name, findResolvedColumnName(resolvedView, resultColumn.groupBy[0].transform.columnName || 'タイムスタンプ'));

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
      ${joins}
      WHERE ${conditionsAndFilters.length ? conditionsAndFilters.join(' AND ') : 'TRUE'}
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
