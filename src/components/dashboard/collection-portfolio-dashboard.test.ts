import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { ApiRequestError } from "@/services/api";
import { getCollectionPortfolioErrorMessage } from "./collection-portfolio-dashboard.error";
import { collectionPortfolioCurrency, coveragePercentage } from "./collection-portfolio-dashboard.presenter";

const source = readFileSync(fileURLToPath(new URL("./collection-portfolio-dashboard.tsx", import.meta.url)), "utf8");

describe("collection portfolio dashboard UI", () => {
  it("deriva percentuais e trata divisão por zero", () => { expect(coveragePercentage(25, 100)).toBe(25); expect(coveragePercentage(1, 0)).toBe(0); });
  it("formata valores em BRL", () => expect(collectionPortfolioCurrency.format(1234.5)).toMatch(/R\$\s*1\.234,50/));
  it.each([[400, "filtro"], [401, "sessão"], [403, "apenas para administradores"]])("trata HTTP %s", (status, expected) => expect(getCollectionPortfolioErrorMessage(new ApiRequestError({ status, message: "interno", url: "/x" }))).toContain(expected));
  it("trata rede e ZodError sem detalhes técnicos", () => { expect(getCollectionPortfolioErrorMessage(new Error("ECONNRESET"))).toContain("Erro de rede"); expect(getCollectionPortfolioErrorMessage(new ZodError([]))).toContain("resposta da carteira"); });
  it("renderiza cards, estados, aging e ranking sem N+1", () => {
    for (const text of ["Total em aberto", "Total vencido", "Clientes com dívida", "Títulos em aberto", "Cobertura por valor", "Cobertura por títulos", "Aging", "Clientes com maior exposição", "Maior atraso", "Operations ativas", "Oportunidade disponível", "Nenhum recebível em aberto para os filtros selecionados.", "Tentar novamente"]) expect(source).toContain(text);
    expect(source).toContain("useCompanies({ active: true })");
    expect(source).toContain("prefetch={false}");
    expect(source).not.toMatch(/use(Customer|Receivable|Operation)\([^)]*customer/);
  });
});
