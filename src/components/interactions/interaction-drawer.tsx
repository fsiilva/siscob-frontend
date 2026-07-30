"use client";

import { useState } from "react";

import { Drawer } from "@/components/ui";

import { InteractionContent } from "./interaction-content";
import { InteractionFooter } from "./interaction-footer";
import { InteractionHeader } from "./interaction-header";
import {
  InteractionContactTypeStep,
  type InteractionContactType,
} from "./steps/interaction-contact-type-step";

export interface InteractionDrawerProps {
  open: boolean;
  customerId: number;
  customerName: string;
  onClose(): void;
  onContinue(contactType: InteractionContactType): void;
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
  onContinue(contactType: InteractionContactType): void;
}

function InteractionFlow({ customerId, customerName, onCancel, onContinue }: InteractionFlowProps) {
  const [contactType, setContactType] = useState<InteractionContactType | null>(null);

  function handleContinue() {
    if (contactType) onContinue(contactType);
  }

  return (
    <div className="flex min-h-full flex-col" data-customer-id={customerId}>
      <InteractionHeader customerName={customerName} />
      <InteractionContent>
        <InteractionContactTypeStep onChange={setContactType} value={contactType} />
      </InteractionContent>
      <InteractionFooter
        continueDisabled={!contactType}
        onCancel={onCancel}
        onContinue={handleContinue}
      />
    </div>
  );
}
