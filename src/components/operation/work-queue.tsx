"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { Badge, Button, Card, CardContent, EmptyState, LoadingState, Skeleton } from "@/components/ui";
import type { BadgeVariant } from "@/components/ui";
import { useOperationQueue } from "@/hooks/useOperationQueue";
import type { OperationQueueItem, OperationQueuePriority } from "@/types/operation";

interface WorkQueueCustomerCardProps {
  item: OperationQueueItem;
  onOpenCustomer: () => void;
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

export function WorkQueueCustomerCard({ item, onOpenCustomer }: WorkQueueCustomerCardProps) {
  return (
    <Card>
      <CardContent className="flex min-w-0 flex-col gap-5">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="break-words text-sm font-medium text-slate-500">{item.company}</p>
            <h3 className="mt-1 break-words text-lg font-semibold text-slate-950">{item.customer}</h3>
          </div>
          <Badge className="w-fit shrink-0" variant={priorityVariants[item.priority]}>
            Prioridade {priorityLabels[item.priority]}
          </Badge>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Valor em aberto</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">{currencyFormatter.format(item.openAmount)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Maior atraso</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">{item.greatestDelayDays} dias</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Último contato</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">{item.lastContact ?? "Não disponível"}</dd>
          </div>
        </dl>

        <Button className="w-full sm:w-fit sm:self-end" onClick={onOpenCustomer}>
          Abrir Customer 360
        </Button>
      </CardContent>
    </Card>
  );
}

export function WorkQueue() {
  const router = useRouter();
  const queueQuery = useOperationQueue();

  return (
    <section aria-labelledby="work-queue-title" className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-950" id="work-queue-title">Fila de cobrança</h2>

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

      {queueQuery.data?.map((item) => (
        <WorkQueueCustomerCard
          item={item}
          key={item.id}
          onOpenCustomer={() => router.push(`/customers/${item.customerId}`)}
        />
      ))}
    </section>
  );
}
