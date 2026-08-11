import type { BadgeVariant } from "@/components/ui";
import type { CollectionCadenceAttention } from "@/types/collection-cadence";

const attentionLabels: Record<CollectionCadenceAttention, string> = {
  OK: "Em dia",
  WARNING: "Atenção",
  CRITICAL: "Crítico",
};

const attentionVariants: Record<CollectionCadenceAttention, BadgeVariant> = {
  OK: "success",
  WARNING: "warning",
  CRITICAL: "danger",
};

export function presentCadenceAttention(attention: CollectionCadenceAttention) {
  return attentionLabels[attention];
}

export function cadenceAttentionVariant(attention: CollectionCadenceAttention) {
  return attentionVariants[attention];
}
