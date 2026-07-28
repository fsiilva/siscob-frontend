"use client";

import { Drawer } from "@/components/ui";

import { InteractionContent } from "./interaction-content";
import { InteractionFooter } from "./interaction-footer";
import { InteractionHeader } from "./interaction-header";

export interface InteractionDrawerProps {
  open: boolean;
  customerId: number;
  customerName: string;
  onClose(): void;
}

export function InteractionDrawer({
  open,
  customerId,
  customerName,
  onClose,
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
      <div className="flex min-h-full flex-col" data-customer-id={customerId}>
        <InteractionHeader customerName={customerName} />
        <InteractionContent />
        <InteractionFooter onCancel={onClose} />
      </div>
    </Drawer>
  );
}
