"use client";

import { useState } from "react";

import { Button, Input, Select } from "@/components/ui";
import { useOperators } from "@/hooks/useOperators";

export function OperatorSelect({
  enabled = true,
  emptyLabel = "Selecione um operador",
  excludeOperatorId,
  onChange,
  value,
}: {
  enabled?: boolean;
  emptyLabel?: string;
  excludeOperatorId?: string | null;
  onChange(value: string | undefined): void;
  value?: string;
}) {
  const [search, setSearch] = useState("");
  const query = useOperators(search, enabled);
  const operators = query.data?.items.filter((operator) => operator.id !== excludeOperatorId) ?? [];

  return <div className="space-y-2">
    <Input aria-label="Buscar operador" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou e-mail" value={search} />
    <Select aria-label="Selecionar operador" disabled={!enabled || query.isLoading} onChange={(event) => onChange(event.target.value || undefined)} value={value ?? ""}>
      <option value="">{emptyLabel}</option>
      {operators.map((operator) => <option key={operator.id} value={operator.id}>{operator.name} — {operator.email}</option>)}
    </Select>
    {query.isError ? <div className="flex flex-wrap items-center gap-2 text-sm text-red-700" role="alert"><span>Não foi possível carregar os operadores.</span><Button onClick={() => void query.refetch()} variant="secondary">Tentar novamente</Button></div> : null}
  </div>;
}
