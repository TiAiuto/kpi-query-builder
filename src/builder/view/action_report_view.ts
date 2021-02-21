import {View, ViewArgs} from './view';
import {ViewResolver} from '../view_resolver';
import {ResolvedView} from '../resolved_view';
import {ActionReportViewActionReference} from '../action_report_view_action_reference';

export class ActionReportView extends View {
    // 期間を使う場合はここで基準集合も指定
    // 基準アクションを指定（契約ユーザを基準にする場合は「[ACTION]契約開始」を基準にすればOK）
    // いかに基準アクションに「関連する」他のアクションを指定
    // 「関連」のレベルは、①同一ユーザによるもの、②基準アクションに関する条件、③基準アクションに関連するアクションにに関する条件
    // いったん①と②だけ対応すれば困りはしなさそう
    // 条件の指定は抽象化した記述で済ませたい（JOINをそんなに意識したくない）
    // [基準アクション日, 基準アクションユーザ識別子, 関連アクション1アクション日]

    /**
     * 使用例イメージ：
     * 基準アクション：サービス利用開始
     * 関連アクション：ケース相談申込、条件：基準アクションから一か月以内（内部で結合：基準アクションとユーザコードで結合）
     * 追加情報：基準アクションの月を追加
     * 集計：月ごとに基準アクション、関連アクション数を集計
     */

    periodViewName: string; // 本当は事前にView作るんじゃなくて自動生成したい
    baseAction: ActionReportViewActionReference;
    relatedActions: ActionReportViewActionReference[];

    constructor({periodViewName, baseAction, relatedActions, ...args}: ViewArgs & {
        periodViewName: string;
        baseAction: ActionReportViewActionReference;
        relatedActions: ActionReportViewActionReference[];
    }) {
        super({...args, type: 'action_report'});
        this.periodViewName = periodViewName;
        this.baseAction = baseAction;
        this.relatedActions = relatedActions;
    }

    resolve(resolver: ViewResolver): ResolvedView {
        return new ResolvedView({
            publicName: this.name,
            physicalName: this.alphabetName,
            columns: [],
            sql: '' // TODO: 実装
        });
    }
}
