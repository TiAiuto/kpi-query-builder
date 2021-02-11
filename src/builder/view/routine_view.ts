import { ResolvedView } from "../resolved_view";
import { ResolvedViewColumn } from "../resolved_view_column";
import { RoutinePattern } from "../routine_pattern";
import { ViewResolver } from "../view_resolver";
import { View, ViewArgs } from "./view";

export class RoutineView extends View {
  pattern: RoutinePattern;

  constructor({ pattern, ...args }: ViewArgs & { pattern: RoutinePattern }) {
    super({ ...args, type: "routine" });
    this.pattern = pattern;
  }

  resolve(resolver: ViewResolver): ResolvedView {
    if (this.pattern.name === '期間集合生成') {
      const [rangeType, dateRangeBegin, dateRangeEnd] = this.pattern.args;
      let sql = '';
      if (rangeType === '日単位') {
        sql = `SELECT FORMAT_DATE('%Y-%m-%d', unit_raw_value) as unit_value, 
          unit_raw_value AS date_range_begin, 
          unit_raw_value AS date_range_end
          FROM UNNEST(GENERATE_DATE_ARRAY(PARSE_DATE("%Y%m%d", "${dateRangeBegin}"), 
            PARSE_DATE("%Y%m%d", "${dateRangeEnd}"))) AS unit_raw_value`
      } else if (rangeType === '週単位') {
        // TODO: (MONDAY)は可変にしてもよさそう
        sql = `SELECT DISTINCT FORMAT_DATE('%Y-%m-%dW', DATE_TRUNC(unit_raw_value, WEEK(MONDAY))) AS unit_value, 
          DATE_TRUNC(unit_raw_value, WEEK(MONDAY)) AS date_range_begin, 
          DATE_SUB(DATE_ADD(DATE_TRUNC(unit_raw_value, WEEK(MONDAY)), INTERVAL 1 WEEK), INTERVAL 1 DAY) AS date_range_end 
          FROM UNNEST(GENERATE_DATE_ARRAY(PARSE_DATE("%Y%m%d", "${dateRangeBegin}"), 
            PARSE_DATE("%Y%m%d", "${dateRangeEnd}"))) AS unit_raw_value`
      } else if (rangeType === '月単位') {
        sql = `SELECT DISTINCT FORMAT_DATE('%Y-%m', unit_raw_value) AS unit_value, 
          DATE_TRUNC(unit_raw_value, MONTH) AS date_range_begin, 
          DATE_SUB(DATE_ADD(DATE_TRUNC(unit_raw_value, MONTH), INTERVAL 1 MONTH), INTERVAL 1 DAY) AS date_range_end 
          FROM UNNEST(GENERATE_DATE_ARRAY(PARSE_DATE("%Y%m%d", "${dateRangeBegin}"), 
            PARSE_DATE("%Y%m%d", "${dateRangeEnd}"))) AS unit_raw_value`
      } else {
        throw new Error(`${rangeType}は未定義`);
      }

      return new ResolvedView({
        publicName: this.name,
        physicalName: this.alphabetName,
        columns: [
          new ResolvedViewColumn({
            publicName: '期間生成値',
            physicalName: 'unit_value',
          }),
          new ResolvedViewColumn({
            publicName: '始端日付',
            physicalName: 'date_range_begin',
          }),
          new ResolvedViewColumn({
            publicName: '終端日付',
            physicalName: 'date_range_end',
          })
        ],
        sql
      });
    } else {
      throw new Error(`${this.pattern.name}は未実装`);
    }
  }
}
