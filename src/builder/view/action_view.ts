import { Condition } from "../condition/condition";
import { Join } from "../join/join";
import { MixinUsage } from "../mixin_usage";
import { ValueSurface } from "../value_surface";
import { QueryView } from "./query_view";

export class ActionView extends QueryView {
  constructor({
    actionName, // 一応命名気をつけてねということでキー名も変える
    actionAlphabetName,
    source,
    columns,
    mixinUsages,
    conditions,
    joins,
  }: {
    actionName: string;
    actionAlphabetName: string;
    columns: ValueSurface[];
    source: string;
    mixinUsages: MixinUsage[];
    conditions: Condition[];
    joins: Join[];
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
      columnsInheritanceEnabled: false, // 継承は不許可
    });
  }
}
