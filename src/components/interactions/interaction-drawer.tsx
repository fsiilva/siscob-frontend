"use client";

import { useState } from "react";

import { Drawer } from "@/components/ui";

import { InteractionContent } from "./interaction-content";
import { InteractionFooter } from "./interaction-footer";
import { InteractionHeader } from "./interaction-header";
import {
  InteractionContactOutcomeStep,
  type InteractionContactOutcome,
} from "./steps/interaction-contact-outcome-step";
import {
  InteractionContactTypeStep,
  type InteractionContactType,
} from "./steps/interaction-contact-type-step";

export interface InteractionData {
  contactType: InteractionContactType;
  contactOutcome: InteractionContactOutcome;
}

export interface InteractionDrawerProps {
  open: boolean;
  customerId: number;
  customerName: string;
  onClose(): void;
  onContinue(interaction: InteractionData): void;
}

export function InteractionDrawer({
  open,
  customerId,
  customerName,
  onClose,
  onContinue,
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
      <InteractionFlow
        customerId={customerId}
        customerName={customerName}
        onCancel={onClose}
        onContinue={onContinue}
      />
    </Drawer>
  );
}

interface InteractionFlowProps {
  customerId: number;
  customerName: string;
  onCancel(): void;
  onContinue(interaction: InteractionData): void;
}

function InteractionFlow({ customerId, customerName, onCancel, onContinue }: InteractionFlowProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [contactType, setContactType] = useState<InteractionContactType | null>(null);
  const [contactOutcome, setContactOutcome] = useState<InteractionContactOutcome | null>(null);

  function handleContactTypeChange(nextContactType: InteractionContactType) {
    if (nextContactType !== contactType) setContactOutcome(null);
    setContactType(nextContactType);
  }

  function handleContinue() {
    if (step === 1 && contactType) {
      setStep(2);
      return;
    }

    if (contactType && contactOutcome) onContinue({ contactType, contactOutcome });
  }

  return (
    <div className="flex min-h-full flex-col" data-customer-id={customerId}>
      <InteractionHeader customerName={customerName} />
      <InteractionContent>
        {step === 1 ? (
          <InteractionContactTypeStep onChange={handleContactTypeChange} value={contactType} />
        ) : contactType ? (
          <InteractionContactOutcomeStep
            contactType={contactType}
            onChange={setContactOutcome}
            value={contactOutcome}
          />
        ) : null}
      </InteractionContent>
      <InteractionFooter
        continueDisabled={step === 1 ? !contactType : !contactOutcome}
        onBack={step === 2 ? () => setStep(1) : undefined}
        onCancel={onCancel}
        onContinue={handleContinue}
      />
    </div>
  );
}
