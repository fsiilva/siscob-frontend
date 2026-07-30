"use client";

import { AlertTriangle } from "lucide-react";
import { Button, Card, CardContent, EmptyState, LoadingState, Section, Skeleton } from "@/components/ui";
import { useCustomerNextActions } from "@/hooks/useNextActionQueries";
import { NextActionCard } from "./next-action-card";
import { isActiveNextAction } from "./next-action-presenter";

export function CustomerNextAction({ customerId }: { customerId: number }) {
  const actionsQuery = useCustomerNextActions(customerId);
  const nextAction = actionsQuery.data?.data.find((action) => isActiveNextAction(action.status));
  return (
    <Section className="space-y-4" title="Próxima ação">
      {actionsQuery.isLoading ? <LoadingState label="Carregando próxima ação"><Skeleton className="h-64" /></LoadingState> : null}
      {actionsQuery.isError ? <EmptyState action={<Button onClick={() => void actionsQuery.refetch()}>Tentar novamente</Button>} description="Não foi possível consultar as próximas ações deste cliente." icon={AlertTriangle} title="Erro ao carregar próxima ação" /> : null}
      {actionsQuery.isSuccess && nextAction ? <NextActionCard action={nextAction} /> : null}
      {actionsQuery.isSuccess && !nextAction ? <Card><CardContent className="text-sm text-slate-600">Nenhuma ação pendente.</CardContent></Card> : null}
    </Section>
  );
}
