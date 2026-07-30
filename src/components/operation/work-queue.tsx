"use client";

import { AlertTriangle, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { InteractionDrawer, type InteractionFlow } from "@/components/interactions";
import { buildInteractionPayload } from "@/components/interactions/interaction-api-mapper";
import { Badge, Button, Card, CardContent, EmptyState, LoadingState, Skeleton } from "@/components/ui";
import type { BadgeVariant } from "@/components/ui";
import { useOperationQueue } from "@/hooks/useOperationQueue";
import { useCreateInteraction } from "@/hooks/useCreateInteraction";
import type { OperationQueueItem, OperationQueuePriority } from "@/types/operation";

interface WorkQueueCustomerCardProps {
  item: OperationQueueItem;
  featured?: boolean;
  onOpenCustomer: () => void;
  onRegisterInteraction: () => void;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const priorityVariants: Record<OperationQueuePriority, BadgeVariant> = {
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "success",
};

const priorityLabels: Record<OperationQueuePriority, string> = {
  HIGH: "alta",
  MEDIUM: "média",
  LOW: "baixa",
};

function formatDelay(daysOverdue: number) {
  if (daysOverdue > 365) return "365+ dias";
  if (daysOverdue <= 0) return "Sem atraso";
  return `${daysOverdue} dias`;
}

function getPriorityReasons(item: OperationQueueItem) {
  const delayReason = item.daysOverdue >= 90
    ? "Atraso de 90 dias ou mais"
    : item.daysOverdue >= 60
      ? "Atraso entre 60 e 89 dias"
      : item.daysOverdue >= 30
        ? "Atraso entre 30 e 59 dias"
        : item.daysOverdue > 0
          ? "Atraso inferior a 30 dias"
          : "Sem atraso";
  const balanceReason = item.outstandingAmount >= 50_000
    ? "Valor em aberto elevado"
    : item.outstandingAmount >= 10_000
      ? "Valor em aberto relevante"
      : item.outstandingAmount >= 1_000
        ? "Valor em aberto moderado"
        : "Valor em aberto reduzido";

  return [delayReason, balanceReason, `Score ${priorityLabels[item.priority]}`];
}

export function WorkQueueCustomerCard({
  item,
  featured = false,
  onOpenCustomer,
  onRegisterInteraction,
}: WorkQueueCustomerCardProps) {
  const priorityReasons = getPriorityReasons(item);

  return (
    <Card className={featured ? "border-amber-300 bg-amber-50/40 ring-1 ring-amber-200" : undefined}>
      <CardContent className={`flex min-w-0 flex-col ${featured ? "gap-5" : "gap-3 p-4"}`}>
        {featured ? (
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-800">
            <Flame aria-hidden="true" className="size-4 fill-current" />
            Cobre agora
          </p>
        ) : null}
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="break-words text-sm font-medium text-slate-500">{item.companyName}</p>
            <h3 className="mt-1 break-words text-lg font-semibold text-slate-950">{item.customerName}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Score {item.priorityScore}</span>
            <Badge variant={priorityVariants[item.priority]}>
              Prioridade {priorityLabels[item.priority]}
            </Badge>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Valor em aberto</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">{currencyFormatter.format(item.outstandingAmount)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Maior atraso</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">{formatDelay(item.daysOverdue)}</dd>
          </div>
        </dl>

        <ul aria-label="Motivos da prioridade" className="flex flex-wrap gap-2">
          {priorityReasons.map((reason) => (
            <li className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600" key={reason}>
              {reason}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button className="w-full sm:w-auto" onClick={onRegisterInteraction}>Registrar Cobrança</Button>
          <Button className="w-full sm:w-auto" onClick={onOpenCustomer} variant="secondary">
            Abrir Customer 360
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function WorkQueue() {
  const router = useRouter();
  const queueQuery = useOperationQueue();
  const [selectedItem, setSelectedItem] = useState<OperationQueueItem | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const createInteractionMutation = useCreateInteraction(selectedItem?.customerId ?? 0);

  async function saveInteraction(interaction: InteractionFlow) {
    if (!selectedItem) return;
    await createInteractionMutation.mutateAsync(
      buildInteractionPayload(interaction, String(selectedItem.id)),
    );
    setSuccessMessage("Atendimento registrado com sucesso.");
    setSelectedItem(null);
  }

  return (
    <section aria-labelledby="work-queue-title" className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-950" id="work-queue-title">Fila de cobrança</h2>

      {successMessage ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
          {successMessage}
        </p>
      ) : null}

      {queueQuery.isLoading ? (
        <LoadingState className="space-y-4" label="Carregando fila de cobrança">
          {Array.from({ length: 3 }, (_, index) => <Skeleton className="h-60" key={index} />)}
        </LoadingState>
      ) : null}

      {queueQuery.isError ? (
        <EmptyState
          action={<Button onClick={() => void queueQuery.refetch()}>Tentar novamente</Button>}
          description="Verifique sua conexão e tente novamente."
          icon={AlertTriangle}
          title="Não foi possível carregar a fila de cobrança"
        />
      ) : null}

      {queueQuery.data?.length === 0 ? (
        <EmptyState
          description="Não há recebíveis em aberto para priorizar neste momento."
          title="Fila de cobrança vazia"
        />
      ) : null}

      {queueQuery.data?.map((item, index) => (
        <WorkQueueCustomerCard
          featured={index === 0}
          item={item}
          key={item.id}
          onOpenCustomer={() => router.push(`/customers/${item.customerId}`)}
          onRegisterInteraction={() => {
            setSuccessMessage(null);
            setSelectedItem(item);
          }}
        />
      ))}

      {selectedItem ? (
        <InteractionDrawer
          customerId={selectedItem.customerId}
          customerName={selectedItem.customerName}
          onClose={() => setSelectedItem(null)}
          onSave={saveInteraction}
          open
        />
      ) : null}
    </section>
  );
}
