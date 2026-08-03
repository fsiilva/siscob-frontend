import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(new URL("./operation-timeline.tsx", import.meta.url)), "utf8");

describe("Operation Timeline UI", () => {
  it("renderiza timeline vertical com título, descrição, usuário, data e hora", () => {
    expect(source).toContain("border-l");
    expect(source).toContain("event.title");
    expect(source).toContain("event.description");
    expect(source).toContain("event.user");
    expect(source).toContain("event.date");
    expect(source).toContain("event.time");
  });

  it("implementa loading, erro e retry", () => {
    expect(source).toContain("query.isPending");
    expect(source).toContain("query.isError");
    expect(source).toContain("query.refetch()");
    expect(source).toContain("Tentar novamente");
  });

  it("exibe a mensagem exigida para timeline vazia", () => {
    expect(source).toContain("Nenhum evento registrado.");
  });

  it("inverte a ordem cronológica recebida para mostrar o mais recente primeiro", () => {
    expect(source).toContain("[...(items ?? query.data?.items ?? [])].reverse()");
  });
});
