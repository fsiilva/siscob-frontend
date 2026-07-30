"use client";

import { AlertTriangle } from "lucide-react";
import { Button, EmptyState, LoadingState, Section, Skeleton } from "@/components/ui";
import { useMyNextActions } from "@/hooks/useNextActionQueries";
import { isActiveNextAction } from "./next-action-presenter";
import { NextActionList } from "./next-action-list";

export function NextActionsSection() {
  const actionsQuery = useMyNextActions();
  const actions = actionsQuery.data?.data ?? [];
  const pendingCount = actions.filter((action) => isActiveNextAction(action.status)).length;
  return (
    <Section className="space-y-4" title={`Próximas ações · ${pendingCount} pendentes`}>
      {actionsQuery.isLoading ? <LoadingState className="grid gap-4 xl:grid-cols-2" label="Carregando próximas ações"><Skeleton className="h-64" /><Skeleton className="h-64" /></LoadingState> : null}
      {actionsQuery.isError ? <EmptyState action={<Button onClick={() => void actionsQuery.refetch()}>Tentar novamente</Button>} description="Não foi possível consultar suas próximas ações." icon={AlertTriangle} title="Erro ao carregar próximas ações" /> : null}
      {actionsQuery.isSuccess ? <NextActionList actions={actions} /> : null}
    </Section>
  );
}
