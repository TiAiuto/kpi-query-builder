import {View, ViewArgs} from './view';
import {ViewResolver} from '../view_resolver';
import {ResolvedView} from '../resolved_view';

export class ActionReportView extends View {
    // 期間を使う場合はここで基準集合も指定
    // 基準アクションを指定（契約ユーザを基準にする場合は「[ACTION]契約開始」を基準にすればOK）
    // いかに基準アクションに「関連する」他のアクションを指定
    // 「関連」のレベルは、①同一ユーザによるもの、②基準アクションに関する条件、③基準アクションに関連するアクションにに関する条件
    // いったん①と②だけ対応すれば困りはしなさそう
    // 条件の指定は抽象化した記述で済ませたい（JOINをそんなに意識したくない）
    // [基準アクション日, 基準アクションユーザ識別子, 関連アクション1アクション日]

    periodViewName: string; // 本当は事前にView作るんじゃなくて自動生成したい
    baseActionName: string;

    constructor({periodViewName, baseActionName, ...args}: ViewArgs & {
        periodViewName: string;
        baseActionName: string;
    }) {
        super({...args, type: 'action_report'});
        this.periodViewName = periodViewName;
        this.baseActionName = baseActionName;
    }

    resolve(resolver: ViewResolver): ResolvedView {
        throw new Error('未実装');
    }
}
