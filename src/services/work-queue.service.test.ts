import MockAdapter from "axios-mock-adapter";
import { afterEach, describe, expect, it } from "vitest";
import { api } from "./api";
import { getWorkQueue } from "./work-queue.service";

const response = { items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 };
const mock = new MockAdapter(api);
afterEach(() => mock.reset());
describe("work queue service and schema", () => {
  it("sends filters and validates the response", async () => {
    mock.onGet("/operations/work-queue").reply((config) => [200, config.params.page === 2 ? { ...response, page: 2 } : response]);
    await expect(getWorkQueue({ page: 2, pageSize: 20, status: "WAITING" })).resolves.toMatchObject({ page: 2 });
  });
  it("rejects invalid pagination and score", async () => {
    mock.onGet("/operations/work-queue").reply(200, { ...response, pageSize: 101 });
    await expect(getWorkQueue({ page: 1, pageSize: 20 })).rejects.toThrow();
  });
});
