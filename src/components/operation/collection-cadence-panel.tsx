import { Badge } from "@/components/ui";
import type { CollectionCadence } from "@/types/collection-cadence";

import { cadenceAttentionVariant, presentCadenceAttention } from "./collection-cadence.presenter";

export function CollectionCadencePanel({ cadence }: { cadence: CollectionCadence }) {
  return <section aria-label="Acompanhamento" className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Acompanhamento</p>
    <div className="mt-2 flex flex-wrap items-center gap-2"><p className="min-w-0 break-words font-semibold text-slate-950">{cadence.label}</p><Badge variant={cadenceAttentionVariant(cadence.attention)}>{presentCadenceAttention(cadence.attention)}</Badge></div>
    {cadence.reasons.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">{cadence.reasons.map((reason, index) => <li className="break-words" key={index}>{reason}</li>)}</ul> : null}
  </section>;
}
