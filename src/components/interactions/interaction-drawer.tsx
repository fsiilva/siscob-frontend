"use client";

import { useRef, useState } from "react";

import { Drawer } from "@/components/ui";
import { getSafeApiErrorMessage } from "@/lib/api-error-message";

import { InteractionContent } from "./interaction-content";
import { InteractionFooter } from "./interaction-footer";
import { InteractionHeader } from "./interaction-header";
import { runSingleSubmission } from "./interaction-submission";
import {
  InteractionContactOutcomeStep,
  type InteractionContactAttemptOutcome,
} from "./steps/interaction-contact-outcome-step";
import {
  getConversationOutcomes,
  InteractionConversationOutcomeStep,
  type InteractionConversationOutcome,
} from "./steps/interaction-conversation-outcome-step";
import {
  InteractionContactTypeStep,
  type InteractionContactType,
} from "./steps/interaction-contact-type-step";
import {
  InteractionNextActionStep,
  nextActionRequiresSchedule,
  type InteractionNextAction,
} from "./steps/interaction-next-action-step";
import { InteractionNotesStep } from "./steps/interaction-notes-step";
import { InteractionScheduleStep } from "./steps/interaction-schedule-step";
import { InteractionSummaryStep } from "./steps/interaction-summary-step";

export interface InteractionFlow {
  contactType: InteractionContactType;
  contactAttemptOutcome: InteractionContactAttemptOutcome;
  conversationOutcome: InteractionConversationOutcome;
  nextAction: InteractionNextAction;
  scheduledAt: string | null;
  notes: string;
}

interface InteractionFlowDraft {
  contactType: InteractionContactType | null;
  contactAttemptOutcome: InteractionContactAttemptOutcome | null;
  conversationOutcome: InteractionConversationOutcome | null;
  nextAction: InteractionNextAction | null;
  scheduledAt: string | null;
  notes: string;
}

export interface InteractionDrawerProps {
  open: boolean;
  customerId: number;
  customerName: string;
  operationContext?: {
    company: string;
    portfolio: string;
    receivable?: string;
    objective: string;
  };
  onClose(): void;
  onSave(interactionFlow: InteractionFlow): Promise<void>;
}

const initialFlow: InteractionFlowDraft = {
  contactType: null,
  contactAttemptOutcome: null,
  conversationOutcome: null,
  nextAction: null,
  scheduledAt: null,
  notes: "",
};

type InteractionStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function InteractionDrawer({
  open,
  customerId,
  customerName,
  operationContext,
  onClose,
  onSave,
}: InteractionDrawerProps) {
  return (
    <Drawer
      closeLabel="Fechar registro de cobrança"
      contentClassName="p-0"
      eyebrow="Cobrança"
      onClose={onClose}
      open={open}
      title="Registrar Cobrança"
    >
      <InteractionEngine
        customerId={customerId}
        customerName={customerName}
        operationContext={operationContext}
        onCancel={onClose}
        onSave={onSave}
      />
    </Drawer>
  );
}

interface InteractionEngineProps {
  customerId: number;
  customerName: string;
  operationContext?: InteractionDrawerProps["operationContext"];
  onCancel(): void;
  onSave(interactionFlow: InteractionFlow): Promise<void>;
}

function InteractionEngine({ customerId, customerName, operationContext, onCancel, onSave }: InteractionEngineProps) {
  const [step, setStep] = useState<InteractionStep>(1);
  const [flow, setFlow] = useState<InteractionFlowDraft>(initialFlow);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const submissionLock = useRef(false);

  function changeContactType(contactType: InteractionContactType) {
    setFlow((current) => current.contactType === contactType ? current : {
      ...initialFlow,
      contactType,
    });
  }

  function changeAttemptOutcome(contactAttemptOutcome: InteractionContactAttemptOutcome) {
    setFlow((current) => current.contactAttemptOutcome === contactAttemptOutcome ? current : {
      ...current,
      contactAttemptOutcome,
      conversationOutcome: null,
      nextAction: null,
      scheduledAt: null,
      notes: "",
    });
  }

  function changeConversationOutcome(conversationOutcome: InteractionConversationOutcome) {
    setFlow((current) => current.conversationOutcome === conversationOutcome ? current : {
      ...current,
      conversationOutcome,
      nextAction: null,
      scheduledAt: null,
      notes: "",
    });
  }

  function changeNextAction(nextAction: InteractionNextAction) {
    setFlow((current) => current.nextAction === nextAction ? current : {
      ...current,
      nextAction,
      scheduledAt: null,
      notes: "",
    });
  }

  function continueFlow() {
    if (step === 1 && flow.contactType) setStep(2);
    if (step === 2 && flow.contactAttemptOutcome) setStep(3);
    if (step === 3 && flow.conversationOutcome) setStep(4);
    if (step === 4 && flow.nextAction) setStep(nextActionRequiresSchedule(flow.nextAction) ? 5 : 6);
    if (step === 5 && hasCompleteSchedule(flow.scheduledAt)) setStep(6);
    if (step === 6) setStep(7);
    if (step === 7) void saveFlow();
  }

  function back() {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
    if (step === 4) setStep(3);
    if (step === 5) setStep(4);
    if (step === 6) setStep(flow.nextAction && nextActionRequiresSchedule(flow.nextAction) ? 5 : 4);
    if (step === 7) setStep(6);
  }

  async function saveFlow() {
    const { contactType, contactAttemptOutcome, conversationOutcome, nextAction } = flow;
    if (!contactType || !contactAttemptOutcome || !conversationOutcome || !nextAction || submissionLock.current) return;

    setSaveError(null);
    setIsSaving(true);
    try {
      await runSingleSubmission(submissionLock, () => onSave({
        ...flow,
        contactType,
        contactAttemptOutcome,
        conversationOutcome,
        nextAction,
      }));
    } catch (error) {
      setSaveError(getSafeApiErrorMessage(error, {
        defaultMessage: "Não foi possível registrar o atendimento. Tente novamente.",
        byStatus: {
          400: "Revise os dados do atendimento e tente novamente.",
          401: "Sua sessão expirou. Entre novamente para continuar.",
          403: "Você não tem permissão para registrar este atendimento.",
          404: "A Operation não foi encontrada. Atualize a fila e tente novamente.",
          409: "Os dados foram alterados. Atualize a página e tente novamente.",
          422: "A Operation não corresponde ao cliente ou recebível selecionado.",
        },
      }));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col" data-customer-id={customerId}>
      <InteractionHeader context={operationContext} customerName={customerName} />
      <InteractionContent>{renderStep(step, flow, {
        changeAttemptOutcome,
        changeContactType,
        changeConversationOutcome,
        changeNextAction,
        changeNotes: (notes) => setFlow((current) => ({ ...current, notes })),
        changeSchedule: (scheduledAt) => setFlow((current) => ({ ...current, scheduledAt })),
      })}</InteractionContent>
      {saveError ? (
        <p className="mx-5 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-6" role="alert">
          {saveError}
        </p>
      ) : null}
      <InteractionFooter
        continueDisabled={!canContinue(step, flow)}
        continueLoading={isSaving}
        onBack={step > 1 ? back : undefined}
        onCancel={onCancel}
        onContinue={continueFlow}
        primaryLabel={step === 7 ? "Salvar" : "Continuar"}
        showCancel={step !== 7}
      />
    </div>
  );
}

interface StepChanges {
  changeContactType(value: InteractionContactType): void;
  changeAttemptOutcome(value: InteractionContactAttemptOutcome): void;
  changeConversationOutcome(value: InteractionConversationOutcome): void;
  changeNextAction(value: InteractionNextAction): void;
  changeSchedule(value: string): void;
  changeNotes(value: string): void;
}

function renderStep(step: InteractionStep, flow: InteractionFlowDraft, changes: StepChanges) {
  if (step === 1) return <InteractionContactTypeStep onChange={changes.changeContactType} value={flow.contactType} />;
  if (step === 2 && flow.contactType) return <InteractionContactOutcomeStep contactType={flow.contactType} onChange={changes.changeAttemptOutcome} value={flow.contactAttemptOutcome} />;
  if (step === 3 && flow.contactAttemptOutcome) return <InteractionConversationOutcomeStep contactAttemptOutcome={flow.contactAttemptOutcome} onChange={changes.changeConversationOutcome} value={flow.conversationOutcome} />;
  if (step === 4) return <InteractionNextActionStep onChange={changes.changeNextAction} value={flow.nextAction} />;
  if (step === 5) return <InteractionScheduleStep onChange={changes.changeSchedule} value={flow.scheduledAt} />;
  if (step === 6) return <InteractionNotesStep onChange={changes.changeNotes} value={flow.notes} />;
  if (step === 7) return <InteractionSummaryStep interaction={flow as InteractionFlow} />;
  return null;
}

function canContinue(step: InteractionStep, flow: InteractionFlowDraft) {
  if (step === 1) return Boolean(flow.contactType);
  if (step === 2) return Boolean(flow.contactAttemptOutcome);
  if (step === 3) return Boolean(flow.conversationOutcome && flow.contactAttemptOutcome && getConversationOutcomes(flow.contactAttemptOutcome).some((outcome) => outcome.value === flow.conversationOutcome));
  if (step === 4) return Boolean(flow.nextAction);
  if (step === 5) return hasCompleteSchedule(flow.scheduledAt);
  if (step === 6) return flow.notes.trim().length > 0;
  return true;
}

function hasCompleteSchedule(scheduledAt: string | null) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(scheduledAt ?? "");
}
