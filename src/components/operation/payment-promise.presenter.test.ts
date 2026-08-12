import { describe, expect, it } from "vitest";

import { formatPaymentPromiseAmount, formatPaymentPromiseDate, paymentPromiseStatusLabels } from "./payment-promise.presenter";

describe("payment promise presenter", () => {
  it("formata BRL e data-only sem deslocamento de fuso", () => {
    expect(formatPaymentPromiseAmount(3790)).toMatch(/R\$\s*3\.790,00/);
    expect(formatPaymentPromiseDate("2026-08-20")).toBe("20/08/2026");
  });

  it.each([["PENDING", "Pendente"], ["FULFILLED", "Cumprida"], ["BROKEN", "Quebrada"], ["CANCELLED", "Cancelada"]] as const)("apresenta %s como %s", (status, label) => {
    expect(paymentPromiseStatusLabels[status]).toBe(label);
  });
});
