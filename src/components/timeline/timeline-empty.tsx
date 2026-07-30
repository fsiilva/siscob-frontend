import { Clock3 } from "lucide-react";

import { EmptyState } from "@/components/ui";

export function TimelineEmpty({ filtered = false }: { filtered?: boolean }) {
  return (
    <EmptyState
      description={filtered ? "Nenhum evento corresponde ao filtro selecionado." : "Os eventos deste cliente aparecerão aqui."}
      icon={Clock3}
      title={filtered ? "Nenhum evento encontrado" : "Timeline vazia"}
    />
  );
}
