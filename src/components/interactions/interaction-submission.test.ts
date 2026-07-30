import { describe, expect, it, vi } from "vitest";

import { runSingleSubmission } from "./interaction-submission";

describe("envio da interação", () => {
  it("impede envio duplicado enquanto existe uma requisição em andamento", async () => {
    let resolveSubmission: (() => void) | undefined;
    const submission = vi.fn(() => new Promise<void>((resolve) => {
      resolveSubmission = resolve;
    }));
    const lock = { current: false };

    const first = runSingleSubmission(lock, submission);
    const duplicate = await runSingleSubmission(lock, submission);

    expect(duplicate).toBe(false);
    expect(submission).toHaveBeenCalledOnce();
    resolveSubmission?.();
    await expect(first).resolves.toBe(true);
  });

  it("libera nova tentativa depois de erro", async () => {
    const submission = vi.fn()
      .mockRejectedValueOnce(new Error("Falha temporária"))
      .mockResolvedValueOnce(undefined);
    const lock = { current: false };

    await expect(runSingleSubmission(lock, submission)).rejects.toThrow("Falha temporária");
    await expect(runSingleSubmission(lock, submission)).resolves.toBe(true);
    expect(submission).toHaveBeenCalledTimes(2);
  });
});
