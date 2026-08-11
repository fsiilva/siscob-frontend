import type { BadgeVariant } from "@/components/ui";
import type { CollectionAlertItemSeverity } from "@/types/collection-alert";

const severityLabels: Record<CollectionAlertItemSeverity, string> = {
  INFO: "Informativo",
  WARNING: "Atenção",
  CRITICAL: "Crítico",
};

const severityVariants: Record<CollectionAlertItemSeverity, BadgeVariant> = {
  INFO: "canceled",
  WARNING: "warning",
  CRITICAL: "danger",
};

export function presentAlertSeverity(severity: CollectionAlertItemSeverity) {
  return severityLabels[severity];
}

export function alertSeverityVariant(severity: CollectionAlertItemSeverity) {
  return severityVariants[severity];
}
