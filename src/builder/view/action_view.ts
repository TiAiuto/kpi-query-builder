import { Condition } from "../condition/condition";
import { Join } from "../join/join";
import { MixinUsage } from "../mixin_usage";
import { ValueSurface } from "../value_surface";
import { QueryView } from "./query_view";

// 最適化のためにACTIONの定義はQueryViewに縛る
export class ActionView extends QueryView {
  constructor({
    actionName, // 一応命名気をつけてねということでキー名も変える
    actionAlphabetName,
    source,
    columns = [],
    mixinUsages = [],
    conditions = [],
    joins = [],
    inheritAllColumnsEnabled = false,
    inheritColumns = [],
  }: {
    actionName: string;
    actionAlphabetName: string;
    columns?: ValueSurface[];
    source: string;
    mixinUsages?: MixinUsage[];
    conditions?: Condition[];
    joins?: Join[];
    inheritAllColumnsEnabled?: boolean;
    inheritColumns?: string[];
  }) {
    // ここで必要なカラム（時間とユーザID？）を持っているか縛るのもあり

    super({
      name: actionName,
      alphabetName: actionAlphabetName,
      source,
      columns,
      mixinUsages,
      conditions,
      joins,
      orders: [],
      inheritAllColumnsEnabled,
      inheritColumns,
    });
  }
}
