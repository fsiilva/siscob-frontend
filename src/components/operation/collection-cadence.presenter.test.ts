import { describe, expect, it } from "vitest";

import { cadenceAttentionVariant, presentCadenceAttention } from "./collection-cadence.presenter";

describe("collection cadence presenter", () => {
  it.each([["OK", "Em dia", "success"], ["WARNING", "Atenção", "warning"], ["CRITICAL", "Crítico", "danger"]] as const)("apresenta %s sem alterar o valor técnico", (attention, label, variant) => {
    expect(presentCadenceAttention(attention)).toBe(label);
    expect(cadenceAttentionVariant(attention)).toBe(variant);
  });
});
