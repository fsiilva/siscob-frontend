import { Badge } from "@/components/ui";
import type { CollectionAlert, CollectionAlertSeverity } from "@/types/collection-alert";

import { alertSeverityVariant, presentAlertSeverity } from "./collection-alert.presenter";

export function CollectionAlertsPanel({ alerts, highestSeverity }: { alerts: CollectionAlert[]; highestSeverity: CollectionAlertSeverity }) {
  if (alerts.length === 0) return null;

  return <section aria-label="Alertas operacionais" className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Alertas</p>{highestSeverity !== "NONE" ? <Badge variant={alertSeverityVariant(highestSeverity)}>{presentAlertSeverity(highestSeverity)}</Badge> : null}</div>
    <ul className="mt-3 space-y-3">{alerts.map((alert, index) => <li className="min-w-0" key={index}><div className="flex flex-wrap items-center gap-2"><p className="break-words text-sm font-semibold text-slate-950">{alert.label}</p><Badge variant={alertSeverityVariant(alert.severity)}>{presentAlertSeverity(alert.severity)}</Badge></div><p className="mt-1 break-words text-sm text-slate-700">{alert.reason}</p></li>)}</ul>
  </section>;
}
