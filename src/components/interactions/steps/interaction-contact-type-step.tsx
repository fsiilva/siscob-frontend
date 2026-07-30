export const interactionContactTypes = [
  { value: "phone", label: "Ligação" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "E-mail" },
  { value: "in_person", label: "Presencial" },
] as const;

export type InteractionContactType = (typeof interactionContactTypes)[number]["value"];

interface InteractionContactTypeStepProps {
  value: InteractionContactType | null;
  onChange: (contactType: InteractionContactType) => void;
}

export function InteractionContactTypeStep({ value, onChange }: InteractionContactTypeStepProps) {
  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-950">Como o contato foi realizado?</legend>
      <p className="mt-1 text-sm text-slate-600">Selecione uma opção para continuar.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {interactionContactTypes.map((contactType) => (
          <label key={contactType.value}>
            <input
              checked={value === contactType.value}
              className="peer sr-only"
              name="interaction-contact-type"
              onChange={() => onChange(contactType.value)}
              type="radio"
              value={contactType.value}
            />
            <span className="flex min-h-14 cursor-pointer items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50 peer-checked:border-blue-700 peer-checked:bg-blue-50 peer-checked:text-blue-800 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-700">
              {contactType.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
