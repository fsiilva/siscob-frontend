import { CalendarClock, ListChecks, PhoneCall, UsersRound } from "lucide-react";

import { Card, EmptyState, PageHeader, StatCard } from "@/components/ui";

const operationKpis = [
  { label: "Clientes prioritários", value: 12, icon: UsersRound },
  { label: "Promessas vencendo hoje", value: 4, icon: CalendarClock },
  { label: "Retornos agendados", value: 7, icon: PhoneCall },
] as const;

export function OperationPage() {
  return (
    <div className="mx-auto flex min-w-0 w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <PageHeader
        description="Acompanhe sua carteira e priorize as cobranças do dia."
        eyebrow="Operação"
        icon={ListChecks}
        title="Minha Operação"
      />

      <section aria-label="Indicadores da operação">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {operationKpis.map(({ icon, label, value }) => (
            <StatCard icon={icon} key={label} label={label} value={value} />
          ))}
        </div>
      </section>

      <Card>
        <EmptyState
          className="border-0"
          title="Sua fila de cobrança será exibida aqui nas próximas sprints."
        />
      </Card>
    </div>
  );
}
