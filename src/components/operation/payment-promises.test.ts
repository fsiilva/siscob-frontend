import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ApiRequestError } from "@/services/api";
import { paymentPromiseErrorMessage } from "./payment-promise.error";

const source = readFileSync(fileURLToPath(new URL("./payment-promises.tsx", import.meta.url)), "utf8");
describe("payment promises UI", () => {
  it("exibe cards, BRL, datas, status traduzidos e vazio", () => {
    for (const text of ["Promessas de pagamento", "Nenhuma promessa de pagamento registrada.", "currency.format", "date.format", "Pendente", "Cumprida", "Quebrada", "Cancelada", "Recebível", "Observação"]) expect(source).toContain(text);
  });
  it("mostra comandos somente para PENDING e usa a versão atual", () => {
    for (const text of ['promise.status === "PENDING"', "Marcar como cumprida", "Marcar como quebrada", "Cancelar promessa", "expectedVersion: promise.version", "mutation.isPending"]) expect(source).toContain(text);
  });
  it("preserva receivable da Operation e não pede ID manual", () => {
    expect(source).toContain("operation.receivableId ? { receivableId: operation.receivableId }");
    expect(source).toContain("disabled value={operation.receivableId");
  });
  it.each([[400, "Revise"], [401, "sessão"], [403, "permissão"], [404, "não foi encontrada"], [409, "outro usuário"], [422, "dados informados"]])("trata HTTP %s", (status, expected) => expect(paymentPromiseErrorMessage(new ApiRequestError({ status, message: "interno", url: "/x" }))).toContain(expected));
  it("trata rede", () => expect(paymentPromiseErrorMessage(new Error("ECONNRESET"))).toContain("Falha de rede"));
});
