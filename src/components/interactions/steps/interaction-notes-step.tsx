import type { ChangeEvent } from "react";

interface InteractionNotesStepProps {
  value: string;
  onChange: (notes: string) => void;
}

const notesLimit = 1000;

export function InteractionNotesStep({ value, onChange }: InteractionNotesStepProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  return (
    <div>
      <label className="text-base font-semibold text-slate-950" htmlFor="interaction-notes">Observação</label>
      <p className="mt-1 text-sm text-slate-600">Registre as informações do atendimento. Este campo é obrigatório.</p>
      <textarea
        className="mt-5 min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        id="interaction-notes"
        maxLength={notesLimit}
        onChange={handleChange}
        required
        value={value}
      />
      <p aria-live="polite" className="mt-1 text-right text-xs text-slate-500">
        {value.length}/{notesLimit}
      </p>
    </div>
  );
}
