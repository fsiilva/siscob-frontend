import { EmptyState } from "@/components/ui";
import type { NextActionApiResponse } from "@/types/next-actions-api";

import { NextActionCard } from "./next-action-card";

const groupOrder = ["Hoje", "Amanhã", "Futuro", "Sem data"] as const;

export function NextActionList({ actions }: { actions: NextActionApiResponse[] }) {
  const groupedActions = groupNextActions(actions);
  if (actions.length === 0) return <EmptyState description="As próximas ações geradas pelos atendimentos aparecerão aqui." title="Nenhuma ação cadastrada" />;

  return (
    <div className="space-y-6">
      {groupOrder.map((group) => groupedActions[group].length > 0 ? (
        <section className="space-y-3" key={group}>
          <h3 className="text-sm font-semibold text-slate-950">{group}</h3>
          <div className="grid gap-4 xl:grid-cols-2">{groupedActions[group].map((action) => <NextActionCard action={action} key={action.id} />)}</div>
        </section>
      ) : null)}
    </div>
  );
}

export function groupNextActions(actions: NextActionApiResponse[]) {
  const groups: Record<(typeof groupOrder)[number], NextActionApiResponse[]> = { Hoje: [], Amanhã: [], Futuro: [], "Sem data": [] };
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const afterTomorrow = new Date(tomorrow);
  afterTomorrow.setDate(afterTomorrow.getDate() + 1);

  for (const action of actions) {
    if (!action.dueAt) groups["Sem data"].push(action);
    else if (new Date(action.dueAt) < tomorrow) groups.Hoje.push(action);
    else if (new Date(action.dueAt) < afterTomorrow) groups.Amanhã.push(action);
    else groups.Futuro.push(action);
  }
  return groups;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
