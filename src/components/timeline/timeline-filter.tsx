"use client";

import { Button } from "@/components/ui";

export type TimelineFilterValue = "all" | "interaction" | "next_action" | "system";

interface TimelineFilterProps {
  value: TimelineFilterValue;
  onChange(value: TimelineFilterValue): void;
}

const filters: readonly { value: TimelineFilterValue; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "interaction", label: "Atendimentos" },
  { value: "next_action", label: "Next Actions" },
  { value: "system", label: "Sistema" },
];

export function TimelineFilter({ value, onChange }: TimelineFilterProps) {
  return (
    <div aria-label="Filtrar timeline" className="flex flex-wrap gap-2" role="group">
      {filters.map((filter) => (
        <Button
          aria-pressed={value === filter.value}
          key={filter.value}
          onClick={() => onChange(filter.value)}
          variant={value === filter.value ? "primary" : "secondary"}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
