import { InnerJoin } from "../join/inner_join";
import { OrdinaryJoin } from "../join/ordinary_join";
import { ResolvedColumn } from "../resolved_column";
import { ResolvedReference } from "../resolved_reference";
import { ResolvedView } from "../resolved_view";
import { ViewResolver } from "../view_resolver";
import { ReferenceView, ReferenceViewArgs } from "./reference_view";

export class QueryView extends ReferenceView {
  columnsInheritanceEnabled: boolean;

  constructor({
    columnsInheritanceEnabled,
    ...args
  }: ReferenceViewArgs & { columnsInheritanceEnabled: boolean }) {
    super({ type: "query", ...args });
    this.columnsInheritanceEnabled = columnsInheritanceEnabled;
  }

  private buildResolvedColumns(resolver: ViewResolver): ResolvedColumn[] {
    throw new Error("実装中");
  }

  private buildResolvedReference(resolver: ViewResolver): ResolvedReference {
    const jointConditions = [...this.conditions];
    const jointJoins = [...this.joins];
    this.filterUsages.forEach((filterUsage) => {
      const filter = resolver.findFilter(filterUsage.name);
      jointConditions.push(...filter.conditions);
      jointJoins.push(...filter.joins);
    });

    const dependentView = resolver.resolve(this.source);
    const availableColumns: ResolvedColumn[] = [
      ...dependentView.resolvedColumns,
    ];
    jointJoins.forEach((join) => {
      if (join instanceof OrdinaryJoin) {
        const joinDependentView = resolver.resolve(join.target);
        availableColumns.push(...joinDependentView.resolvedColumns);
      }
    });

    const joinPhrases = jointJoins.map((join) => join.toSQL(resolver));
    const conditionPhrases = jointConditions.map((condition) =>
      condition.toSQL(resolver)
    );

    return new ResolvedReference({
      resolvedColumns: this.buildResolvedColumns(resolver),
      physicalSource: dependentView.physicalName,
      joinPhrases,
      conditionPhrases,
      groupPhrases: [],
      orderPhrases: [], // TODO: orderは後で
    });
  }

  resolve(resolver: ViewResolver): ResolvedView {
    const resolvedReference = this.buildResolvedReference(resolver);

    return new ResolvedView({
      publicName: this.name,
      physicalName: this.alphabetName,
      resolvedColumns: resolvedReference.resolvedColumns,
      sql: resolvedReference.toSQL(),
    });
  }
}
