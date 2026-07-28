import { describe, expect, it } from "vitest";

import type { OperationQueueItem } from "@/types/operation";

import {
  calculateBalanceScore,
  calculateDelayScore,
  calculateOperationPriority,
  classifyOperationPriority,
  sortOperationQueueItems,
} from "./operation.service";

function createQueueItem(overrides: Partial<OperationQueueItem>): OperationQueueItem {
  return {
    id: 1,
    customerId: 1,
    companyName: "Empresa",
    customerName: "Cliente",
    outstandingAmount: 1_000,
    daysOverdue: 0,
    priorityScore: 10,
    priority: "LOW",
    ...overrides,
  };
}

describe("score de prioridade operacional", () => {
  it.each([
    [-1, 0],
    [0, 0],
    [1, 10],
    [29, 10],
    [30, 25],
    [59, 25],
    [60, 40],
    [89, 40],
    [90, 50],
  ])("calcula %i dias de atraso como %i pontos", (daysOverdue, expected) => {
    expect(calculateDelayScore(daysOverdue)).toBe(expected);
  });

  it.each([
    [0, 5],
    [999.99, 5],
    [1_000, 10],
    [9_999.99, 10],
    [10_000, 20],
    [49_999.99, 20],
    [50_000, 30],
  ])("calcula saldo %d como %i pontos", (balance, expected) => {
    expect(calculateBalanceScore(balance)).toBe(expected);
  });

  it.each([
    [0, "LOW"],
    [39, "LOW"],
    [40, "MEDIUM"],
    [69, "MEDIUM"],
    [70, "HIGH"],
  ] as const)("classifica score %i como %s", (score, expected) => {
    expect(classifyOperationPriority(score)).toBe(expected);
  });

  it("combina atraso e saldo no score final", () => {
    expect(calculateOperationPriority(95, 50_000)).toEqual({
      priorityScore: 80,
      priority: "HIGH",
    });
  });
});

describe("ordenação da fila operacional", () => {
  it("ordena por score, atraso, saldo e nome do cliente", () => {
    const items = [
      createQueueItem({ id: 4, priorityScore: 50, daysOverdue: 30, outstandingAmount: 1_000, customerName: "Zulu" }),
      createQueueItem({ id: 2, priorityScore: 50, daysOverdue: 60, outstandingAmount: 1_000, customerName: "Cliente B" }),
      createQueueItem({ id: 1, priorityScore: 80, daysOverdue: 90, outstandingAmount: 50_000, customerName: "Cliente A" }),
      createQueueItem({ id: 5, priorityScore: 50, daysOverdue: 30, outstandingAmount: 1_000, customerName: "Alfa" }),
      createQueueItem({ id: 3, priorityScore: 50, daysOverdue: 30, outstandingAmount: 2_000, customerName: "Cliente C" }),
    ];

    expect(sortOperationQueueItems(items).map(({ id }) => id)).toEqual([1, 2, 3, 5, 4]);
  });

  it("não modifica o array original", () => {
    const items = [
      createQueueItem({ id: 1, priorityScore: 10 }),
      createQueueItem({ id: 2, priorityScore: 80 }),
    ];
    const originalOrder = [...items];
    const sortedItems = sortOperationQueueItems(items);

    expect(items).toEqual(originalOrder);
    expect(sortedItems).not.toBe(items);
    expect(sortedItems.map(({ id }) => id)).toEqual([2, 1]);
  });
});
