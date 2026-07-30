import { Input } from "@/components/ui";

interface InteractionScheduleStepProps {
  value: string | null;
  onChange: (scheduledAt: string) => void;
}

export function InteractionScheduleStep({ value, onChange }: InteractionScheduleStepProps) {
  const [date = "", time = ""] = (value ?? "T").split("T");

  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-950">Quando deve acontecer?</legend>
      <p className="mt-1 text-sm text-slate-600">Informe a data e a hora da próxima ação.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Data
          <Input className="mt-1.5" onChange={(event) => onChange(`${event.target.value}T${time}`)} type="date" value={date} />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Hora
          <Input className="mt-1.5" onChange={(event) => onChange(`${date}T${event.target.value}`)} type="time" value={time} />
        </label>
      </div>
    </fieldset>
  );
}
