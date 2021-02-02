// これは引数で渡せるようにしたほうがよさそう
const targetDateRange = ['20200901', '20210119'];

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
    name: 'オンライン勉強会参加済み申込',
    conditions: [
      {
        type: 'raw',
        raw: 'attended_at IS NOT NULL'
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
    source: '`h-navi.lo_production.plus_contracts`',
    sourceAlias: 'plus_contracts',
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
    source: '`h-navi.lo_applog_transform.action_rack_plus_*`',
    sourceAlias: 'rack_plus',
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
    source: '`h-navi.lo_plusmine_production.counseling_case_application_tickets`',
    sourceAlias: 'application_tickets',
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
    source: '`h-navi.lo_plusmine_production.counseling_case_additional_question_tickets`',
    sourceAlias: 'second_question_tickets',
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
  },
  {
    name: 'オンライン勉強会申込',
    alphabetName: 'plus_study_meeting_applications',
    source: '`h-navi.lo_production.plus_study_meeting_applications`',
    sourceAlias: 'study_meeting_applications',
    columns: [
      {
        name: 'ユーザコード',
        alphabetName: 'user_code',
        originalName: 'study_meeting_applications.user_code',
      },
      {
        name: '申込日時',
        alphabetName: 'application_datetime',
        originalName: 'study_meeting_applications.application_datetime',
      },
      {
        name: '参加日時',
        alphabetName: 'attended_at',
        originalName: 'study_meeting_applications.attended_at',
      },
    ]
  },
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
  {
    name: '[ACTION]勉強会TOP表示',
    alphabetName: 'visit_study_meeting_top',
    source: 'PLUS契約者アクセスログ',
    columnsInheritanceEnabled: true,
    conditions: [
      {
        type: 'raw',
        raw: 'REGEXP_CONTAINS(path, \'^/plus/study_meeting$\')'
      }
    ],
  },
  {
    name: '[ACTION]勉強会詳細表示',
    alphabetName: 'visit_study_meeting_defail',
    source: 'PLUS契約者アクセスログ',
    columnsInheritanceEnabled: true,
    conditions: [
      {
        type: 'raw',
        raw: 'REGEXP_CONTAINS(path, \'^/plus/study_meeting/\\\\w+?$\')'
      }
    ],
  },
  {
    name: '[ACTION]勉強会申込詳細表示',
    alphabetName: 'visit_mypage_study_meeting_application_defail',
    source: 'PLUS契約者アクセスログ',
    columnsInheritanceEnabled: true,
    conditions: [
      {
        type: 'raw',
        raw: 'REGEXP_CONTAINS(path, \'^/plus/mypage/study_meeting_applications/\\\\w+?\')'
      }
    ],
  },
  {
    name: '[ACTION]勉強会申込',
    alphabetName: 'submit_study_meeting_application',
    source: 'オンライン勉強会申込',
    columnsInheritanceEnabled: true,
    columns: [
      {
        name: 'タイムスタンプ',
        alphabetName: 'time',
        originalName: '申込日時'
      }
    ],
  },
  {
    name: '[ACTION]勉強会参加',
    alphabetName: 'attend_study_meeting',
    source: 'オンライン勉強会申込',
    columnsInheritanceEnabled: true,
    onlyLastAction: true,
    columns: [
      {
        name: 'タイムスタンプ',
        alphabetName: 'time',
        originalName: '申込日時'
      }
    ],
    filters: [
      {
        name: 'オンライン勉強会参加済み申込'
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

function findColumnByViewColumnDefs(viewColumnDefs, columnName, source, defaultSource) {
  const matchedDefs = viewColumnDefs.filter((columnDef) => {
    if (columnDef.name === columnName && (!source || columnDef.source === source)) {
      return true;
    }
  });
  if (matchedDefs.length === 1) {
    return matchedDefs[0];
  }
  if (matchedDefs.length === 0 || !defaultSource) {
    throw new Error(`${columnName}は未定義`);
  }
  const defaultSourceDef = viewColumnDefs.find((columnDef) => {
    if (columnDef.name === columnName && columnDef.source === defaultSource) {
      return true;
    }
  });
  if (defaultSourceDef) {
    return defaultSourceDef;
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
  throw new Error(`${columnName}は未定義`);
}

// TODO: このロジックはクラスに移せそう
function appendInheritedColumns(viewDefinition, dependentQuery) {
  if (viewDefinition.columnsInheritanceEnabled) {
    return dependentQuery.resolvedColumns.map((column) => {
      return {
        name: column.name,
        alphabetName: column.alphabetName,
        originalName: column.name // 依存先クエリで使っている名前がそのまま自クエリの名前になる
      };
    }).concat(viewDefinition.columns || []);
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
  } else if (joinDefinition.type === 'join' || joinDefinition.type === 'left_join') {
    return joinDefinition.conditions.map((joinCondition) => {
      const targetResolvedQuery = resolveQuery(resolvedQueries, joinDefinition.target);
      const leftJoinWord = joinDefinition.type === 'left_join' ? 'LEFT ' : '';
      let joinPhrase = `${leftJoinWord}JOIN ${targetResolvedQuery.resolvedSource} ON `;
      joinPhrase += `${viewAlphabetName}.${resolveColumnByViewColumns(viewColumns, joinCondition.sourceColumnName)}`;
      joinPhrase += ' = ';
      joinPhrase += `${targetResolvedQuery.resolvedSource}.${resolveColumnByResolvedQuery(targetResolvedQuery, joinCondition.targetColumnName)}`;
      return joinPhrase
    }).join(' \n ');
  }
  console.error(joinDefinition);
  throw new Error(`${joinDefinition.type}は未定義`);
}

function generateRoutineView(resolvedQueries, {name, alphabetName, routine}) {
  if (routine.name === '期間集合生成') {
    const resolvedQuery = {
      name,
      resolvedSource: alphabetName,
      resolvedColumns: [
        {
          name: '集計単位（自動生成）',
          alphabetName: 'unit_value',
        },
        {
          name: '始端日付',
          alphabetName: 'date_range_begin',
        },
        {
          name: '終端日付',
          alphabetName: 'date_range_end',
        }
      ]
    };
    const [rangeType, dateRangeBegin, dateRangeEnd] = routine.args;
    let sql = null;
    if (rangeType === '日単位') {
      resolvedQuery.sql = `SELECT FORMAT_DATE('%Y-%m-%d', unit_raw_value) as unit_value, 
        unit_raw_value AS date_range_begin, 
        unit_raw_value AS date_range_end
        FROM UNNEST(GENERATE_DATE_ARRAY(PARSE_DATE("%Y%m%d", "${dateRangeBegin}"), 
          PARSE_DATE("%Y%m%d", "${dateRangeEnd}"))) AS unit_raw_value`
    } else if (rangeType === '月単位') {
      resolvedQuery.sql = `SELECT DISTINCT FORMAT_DATE('%Y-%m', unit_raw_value) AS unit_value, 
        DATE_TRUNC(unit_raw_value, MONTH) AS date_range_begin, 
        DATE_SUB(DATE_ADD(DATE_TRUNC(unit_raw_value, MONTH), INTERVAL 1 MONTH), INTERVAL 1 DAY) AS date_range_end 
        FROM UNNEST(GENERATE_DATE_ARRAY(PARSE_DATE("%Y%m%d", "${dateRangeBegin}"), 
          PARSE_DATE("%Y%m%d", "${dateRangeEnd}"))) AS unit_raw_value`
    } else {
      throw new Error(`${rangeType}は未定義`);
    }
    return resolvedQuery;
  } else {
    throw new Error(`${routine.name}は未定義`);
  }
}

function generateAggregateView(resolvedQueries, viewDefinition) {
  // TODO: そのうちaggregateを複数指定したくなるかも
  if (viewDefinition.aggregate.groupBy.length > 1) {
    throw new Error('groupByの複数指定は未実装');
  }

  const sourceResolvedView = resolveQuery(resolvedQueries, viewDefinition.source);

  const aggregateDef = viewDefinition.aggregate;
  const groupBy = aggregateDef.groupBy[0];
  const innerGroupByColumnAlphabetName = 'aggregate_inner_group_by_value';
  const innerValueColumnAlphabetName = 'aggregate_inner_value';
  let innerQuery, outerGroupByColumnName, outerGroupByColumnAlphabetName;

  if (groupBy.type === 'value') {
    // ここでjoinsが解決できるならinner queryにする必要はない
    innerQuery = buildViewQuery(resolvedQueries, {
      name: 'Aggregate内側クエリ用',
      alphabetName: 'for_aggregate_inner_query',
      source: viewDefinition.source,
      filters: viewDefinition.filters,
      joins: viewDefinition.joins,
      conditions: viewDefinition.conditions,
      columns: [
        {
          name: groupBy.value,
          alphabetName: innerGroupByColumnAlphabetName
        },
        {
          name: aggregateDef.value,
          alphabetName: innerValueColumnAlphabetName
        }
      ]
    }, sourceResolvedView);

    // ↓join先のカラムでgroupByするとき解決できないので要修正
    outerGroupByColumnName = groupBy.value;
    outerGroupByColumnAlphabetName = resolveColumnByResolvedQuery(sourceResolvedView, groupBy.value);
  } else if (groupBy.type === 'transform') {
    const generatedUnitPhrase = buildTransformPhrase(groupBy.transform.pattern.name,
      findResolvedColumnName(sourceResolvedView, groupBy.transform.value));

    innerQuery = buildViewQuery(resolvedQueries, {
      name: 'Aggregate内側クエリ用',
      alphabetName: 'for_aggregate_inner_query',
      source: viewDefinition.source,
      filters: viewDefinition.filters,
      joins: viewDefinition.joins,
      conditions: viewDefinition.conditions,
      columns: [
        {
          name: groupBy.transform.output.name,
          type: 'raw',
          raw: `${generatedUnitPhrase} AS ${innerGroupByColumnAlphabetName}`
        },
        {
          name: aggregateDef.value,
          alphabetName: 'aggregate_inner_value'
        }
      ]
    }, sourceResolvedView);

    outerGroupByColumnName = groupBy.transform.output.name;
    outerGroupByColumnAlphabetName = groupBy.transform.output.alphabetName;
  } else {
    throw new Error(`${groupBy.type}は未定義`);
  }

  const aggregatePhrase = buildAggregatePhrase(aggregateDef.type, innerValueColumnAlphabetName);
  const outerValueColumnName = aggregateDef.output.name;
  const outerValueColumnAlphabetName = aggregateDef.output.alphabetName;

  return {
    name: viewDefinition.name,
    resolvedSource: viewDefinition.alphabetName,
    resolvedColumns: [
      {
        name: outerGroupByColumnName,
        alphabetName: outerGroupByColumnAlphabetName
      },
      {
        name: outerValueColumnName,
        alphabetName: outerValueColumnAlphabetName,
      },
    ],
    sql: `SELECT 
      ${innerGroupByColumnAlphabetName} AS ${outerGroupByColumnAlphabetName}, 
      ${aggregatePhrase} AS ${outerValueColumnAlphabetName}
      FROM (
        ${innerQuery}
      )
      GROUP BY ${innerGroupByColumnAlphabetName}
      ORDER BY ${innerGroupByColumnAlphabetName}`
  };
}

function addRootViewAvailableColumns(viewAvailableColumns, rootViewDefinition) {
  rootViewDefinition.columns.forEach(({name, alphabetName}) => {
    viewAvailableColumns.push({
      source: rootViewDefinition.name,
      sourceAlphabetName: rootViewDefinition.sourceAlias,
      name,
      alphabetName
    });
  })
}

function buildRootViewQuery(resolvedQueries, rootViewDefinition, tableDateRange) {
  // root viewはrawで対処することが多いのでviewAvailableColumnsはいらないかも
  const viewAvailableColumns = [];
  addRootViewAvailableColumns(viewAvailableColumns, rootViewDefinition);

  let joinDefs = rootViewDefinition.joins || [];
  (rootViewDefinition.filters || []).forEach((filterRef) => {
    const filter = resolveFilter(resolvedQueries, filterRef.name);
    joinDefs = joinDefs.concat(filter.joins || []);
  });
  joinDefs.forEach((joinDef) => {
    if (joinDef.type !== 'raw') {
      const joinTargetQuery = resolveQuery(resolvedQueries, joinDef.target);
      addViewAvailableColumns(viewAvailableColumns, joinTargetQuery);
    }
  });

  const joinPhrases = joinDefs.map((join) => buildJoinPhrase(resolvedQueries, join, rootViewDefinition.alphabetName, viewAvailableColumns))
    .join('\n');

  let conditionDefs = rootViewDefinition.conditions || [];
  (rootViewDefinition.filters || []).forEach((filterRef) => {
    const filter = resolveFilter(resolvedQueries, filterRef.name);
    conditionDefs = conditionDefs.concat(filter.conditions);
  });

  const conditionPhrases = conditionDefs.map((condition) => resolveCondition(resolvedQueries, condition, viewAvailableColumns));
  if (rootViewDefinition.dateSuffixEnabled) {
    conditionPhrases.push(` _TABLE_SUFFIX BETWEEN '${tableDateRange[0]}' AND '${tableDateRange[1]}' `);
  }

  const columnDefsToSelect = rootViewDefinition.columns;
  const selectColumnPhrases = [];
  columnDefsToSelect.forEach((columnDef) => {
    if (columnDef.type === 'raw') {
      selectColumnPhrases.push(columnDef.raw);
    } else {
      selectColumnPhrases.push(`${columnDef.originalName} AS ${columnDef.alphabetName} `);
    }
  });

  return `SELECT ${selectColumnPhrases.join(', ')} \n FROM ${rootViewDefinition.source} ${rootViewDefinition.sourceAlias} \n ${joinPhrases} \n WHERE ${conditionPhrases.length ? conditionPhrases.join(' AND ') : 'TRUE'} `;
}

function addViewAvailableColumns(viewAvailableColumns, sourceQuery) {
  sourceQuery.resolvedColumns.forEach((resolvedColumn) => {
    viewAvailableColumns.push({
      source: sourceQuery.name,
      sourceAlphabetName: sourceQuery.resolvedSource,
      name: resolvedColumn.name,
      alphabetName: resolvedColumn.alphabetName
    });
  });
}

function buildViewQuery(resolvedQueries, viewDefinition, dependentQuery) {
  const viewAvailableColumns = [];
  addViewAvailableColumns(viewAvailableColumns, dependentQuery);

  // このviewが持つcolumnsを確定するため先にjoinを確定する必要がある
  let joinDefs = viewDefinition.joins || [];
  (viewDefinition.filters || []).forEach((filterRef) => {
    const filterDef = resolveFilter(resolvedQueries, filterRef.name);
    joinDefs = joinDefs.concat(filterDef.joins || []);
  });
  joinDefs.forEach((joinDef) => {
    // type: rawの場合もtargetは明示すること
    const joinTargetQuery = resolveQuery(resolvedQueries, joinDef.target);
    addViewAvailableColumns(viewAvailableColumns, joinTargetQuery);
  });

  const joinPhrases = joinDefs.map((join) => buildJoinPhrase(resolvedQueries, join, dependentQuery.resolvedSource, viewAvailableColumns))
    .join('\n');

  let conditionDefs = viewDefinition.conditions || [];
  (viewDefinition.filters || []).forEach((filterRef) => {
    const filterDef = resolveFilter(resolvedQueries, filterRef.name);
    conditionDefs = conditionDefs.concat(filterDef.conditions);
  });
  const conditionPhrases = conditionDefs.map((condition) => resolveCondition(resolvedQueries, condition, viewAvailableColumns));

  const columnDefsToSelect = appendInheritedColumns(viewDefinition, dependentQuery);
  const selectColumnPhrases = [];
  columnDefsToSelect.forEach((columnDef) => {
    if (columnDef.type === 'raw') {
      selectColumnPhrases.push(columnDef.raw);
    } else {
      // originalNameが未定義の場合は元のカラム定義を継承する
      // 重複する定義が見つかった場合は継承元を最優先で使う
      const sourceColumnDef = findColumnByViewColumnDefs(viewAvailableColumns, columnDef.originalName || columnDef.name, columnDef.source, dependentQuery.name);
      selectColumnPhrases.push(`${sourceColumnDef.sourceAlphabetName}.${sourceColumnDef.alphabetName} AS ${columnDef.alphabetName || sourceColumnDef.alphabetName} `);
    }
  });

  const orderByPhrases = [];
  (viewDefinition.orderBy || []).forEach((orderByDef) => {
    const orderColumnDef = findColumnByViewColumnDefs(viewAvailableColumns, orderByDef.name, orderByDef.source, dependentQuery.name);
    const descWord = orderByDef.desc ? ' DESC' : '';
    orderByPhrases.push(`${orderColumnDef.sourceAlphabetName}.${orderColumnDef.alphabetName} ${descWord}`);
  });

  return `SELECT ${selectColumnPhrases.join(', ')} \n FROM ${dependentQuery.resolvedSource} \n ${joinPhrases} \n WHERE ${conditionPhrases.length ? conditionPhrases.join(' AND ') : 'TRUE'} ORDER BY ${orderByPhrases.length ? orderByPhrases.join(', ') : '1'} `;
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
        sql: buildRootViewQuery(resolvedQueries, rootViewDefinition, targetDateRange) // ここの引数どこから渡す？
      };
      resolvedQueries.push(result);
      return result;
    }
  }
  for (let viewDefinition of views) {
    if (viewDefinition.name === name) {
      if (viewDefinition.type === 'routine') {
        const result = generateRoutineView(resolvedQueries, viewDefinition);
        resolvedQueries.push(result);
        return result;
      } else if (viewDefinition.type === 'aggregate') {
        const result = generateAggregateView(resolvedQueries, viewDefinition);
        resolvedQueries.push(result);
        return result;
      } else {
        // NOTICE: いったんelseを通常のviewとして実装しておく
        // TODO: すべてのviewにtypeを指定したい、rootViewも統合してもいいかも
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
  if (transformType === '日抽出') {
    return `FORMAT_TIMESTAMP('%Y-%m-%d', ${columnAlphabetName}, 'Asia/Tokyo')`;
  } else if (transformType === '月抽出') {
    return `FORMAT_TIMESTAMP('%Y-%m', ${columnAlphabetName}, 'Asia/Tokyo')`;
  } else {
    throw new Error(`${transformType}は未実装`);
  }
}

function main() {
  const resolvedQueries = [];

  // このへんはPVとUUの集計用の「レポート」

  // 数値を見たいview
  // [ACTION] って付いてるのじゃないと動かない
  // TODO: interface縛りたい（「特定のカラムを持っていること」)
  const counselingTargetActions = [
    {
      source: '[ACTION]個別ケース相談TOP表示'
    },
    {
      source: '[ACTION]ケース相談詳細ページ表示'
    },
    {
      source: '[ACTION]ケース相談1次相談新規作成フォーム表示'
    },
    {
      source: '[ACTION]ケース相談1次相談編集フォーム表示'
    },
    {
      source: '[ACTION]ケース相談一次相談申込'
    },
    {
      source: '[ACTION]ケース相談相談詳細ページ表示'
    },
    {
      source: '[ACTION]ケース相談二次相談編集ページ表示'
    },
    {
      source: '[ACTION]ケース相談二次相談申込'
    },
  ];

  const studyMeetingTargetActions = [
    {
      source: '[ACTION]勉強会TOP表示'
    },
    {
      source: '[ACTION]勉強会詳細表示'
    },
    {
      source: '[ACTION]勉強会申込'
    },
    {
      source: '[ACTION]勉強会申込詳細表示'
    },
    {
      source: '[ACTION]勉強会参加'
    },
  ];

  const targetActions = studyMeetingTargetActions;

  const reportActionUnitType = '月'; // or 日
  const reportActionType = 'uu'; // or uu
  const reportActionFilters = [
    // {
    //   name: '契約後一ヶ月以内'
    // }
  ];

  // 以下の内容は動的に生成することになりそう

  const baseUnitValueView = {
    name: '列日付基準集合生成クエリ',
    alphabetName: 'row_base_unit_value',
    type: 'routine',
    routine: {
      name: '期間集合生成',
      args: [`${reportActionUnitType}単位`, '20200901', '20210119'] // ここの引数は可変
    }
  };
  views.push(baseUnitValueView);

  const endOfMonthPlusUsersView = {
    name: '各月末時点PLUSユーザ数集計',
    alphabetName: 'plus_users_count_at_each_end_of_month',
    source: '列日付基準集合生成クエリ',
    type: 'aggregate',
    joins: [
      {
        type: 'raw',
        target: 'ユーザコード付きPLUS契約',
        raw: 'JOIN plus_contracts_with_user_code ON ' +
          'DATE(usage_start_date_timestamp, "Asia/Tokyo") <= date_range_end AND ' +
          '(usage_end_date_timestamp IS NULL OR date_range_end <= DATE(usage_end_date_timestamp, "Asia/Tokyo"))'
      }
    ],
    aggregate: {
      type: 'COUNT',
      value: '契約ユーザコード',
      output: {
        name: '各月末時点PLUSユーザ数集計集計値',
        alphabetName: 'plus_users_count_at_each_end_of_month_value'
      },
      groupBy: [
        {
          type: 'value',
          value: '集計単位（自動生成）'
        }
      ]
    }
  };
  views.push(endOfMonthPlusUsersView);
  resolveQuery(resolvedQueries, '各月末時点PLUSユーザ数集計');


  function generateAggregateViewName(targetActionView, reportActionType) {
    if (reportActionType === 'pv') {
      if (targetActionView.onlyLastAction) {
        return `${targetActionView.name}_UU数_表示数利用不可`;
      } else {
        return `${targetActionView.name}_表示数`;
      }
    } else if (reportActionType === 'uu') {
      return `${targetActionView.name}_UU数`;
    } else {
      throw new Error(`${reportActionType}は未実装`);
    }
  }

  function generateAggregateViewAlphabetName(targetActionView, reportActionType) {
    if (reportActionType === 'pv') {
      if (targetActionView.onlyLastAction) {
        return `${targetActionView.alphabetName}_uu_count_pv_not_available`;
      } else {
        return `${targetActionView.alphabetName}_pv_count`;
      }
    } else if (reportActionType === 'uu') {
      return `${targetActionView.alphabetName}_uu_count`;
    } else {
      throw new Error(`${reportActionType}は未実装`);
    }
  }

  function generateAggregateViewAggreateType(targetActionView, reportActionType) {
    if (reportActionType === 'pv') {
      return 'COUNT';
    } else if (reportActionType === 'uu') {
      return 'COUNT_DISTINCT';
    } else {
      throw new Error(`${reportActionType}は未実装`);
    }
  }

  function findView(name) {
    const view = views.find((item) => item.name === name);
    if (view) {
      return view;
    }
    throw new Error(`${name}は未定義`);
  }

  const viewsForReport = [];
  targetActions.forEach((targetAction) => {
    const targetActionView = findView(targetAction.source);
    viewsForReport.push({
      name: generateAggregateViewName(targetActionView, reportActionType),
      alphabetName: generateAggregateViewAlphabetName(targetActionView, reportActionType),
      source: targetAction.source,
      type: 'aggregate',
      aggregate: {
        value: 'ユーザコード',
        type: generateAggregateViewAggreateType(targetActionView, reportActionType),
        output: {
          name: `${targetActionView.name}集計値`,
          alphabetName: `${targetActionView.alphabetName}_value`,
        },
        groupBy: [
          {
            type: 'transform',
            transform: {
              value: 'タイムスタンプ',
              pattern: {
                name: `${reportActionUnitType}抽出`,
              },
              output: {
                name: '集計単位（自動生成）',
                alphabetName: 'auto_generated_unit_name'
              }
            }
          }
        ],
      },
      filters: reportActionFilters
    });
  });

  const reportBodyView = {
    type: 'default',
    name: 'レポート本体',
    alphabetName: 'report_body',
    source: '列日付基準集合生成クエリ',
    columnsInheritanceEnabled: true,
    joins: [
      {
        type: 'join',
        target: '各月末時点PLUSユーザ数集計',
        conditions: [
          {
            sourceColumnName: '集計単位（自動生成）',
            targetColumnName: '集計単位（自動生成）'
          }
        ]
      }
    ],
    columns: [
      {
        source: '各月末時点PLUSユーザ数集計',
        name: '各月末時点PLUSユーザ数集計集計値'
      }
    ],
    orderBy: [
      {
        source: '列日付基準集合生成クエリ',
        name: '集計単位（自動生成）'
      }
    ]
  };

  viewsForReport.forEach((reportView) => {
    views.push(reportView);
    const resolvedReportView = resolveQuery(resolvedQueries, reportView.name);
    reportBodyView.columns.push({
      ...resolvedReportView.resolvedColumns[1],
      source: reportView.name
    }); // 集計基準値の次に集計値が入っている
    reportBodyView.joins.push({
      type: 'left_join',
      target: reportView.name,
      conditions: [
        {
          sourceColumnName: '集計単位（自動生成）',
          targetColumnName: '集計単位（自動生成）'
        }
      ]
    });
  });

  views.push(reportBodyView);
  resolveQuery(resolvedQueries, 'レポート本体');

  const withQueries = resolvedQueries.map((resolvedQuery) => `--- ${resolvedQuery.name} \n ${resolvedQuery.resolvedSource} AS (${resolvedQuery.sql})`);
  console.log('WITH ' + withQueries.join(', \n'));
  console.log('SELECT * FROM report_body;');
}

main();
