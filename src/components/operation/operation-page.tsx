import { ListChecks } from "lucide-react";

import { NextActionsSection } from "@/components/next-actions";
import { PageHeader } from "@/components/ui";

import { WorkQueue } from "./work-queue";

export function OperationPage() {
  return (
    <div className="mx-auto flex min-w-0 w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <PageHeader
        description="Acompanhe sua carteira e priorize as cobranças do dia."
        eyebrow="Operação"
        icon={ListChecks}
        title="Minha Operação"
      />

      <WorkQueue />
      <NextActionsSection />
    </div>
  );
}
