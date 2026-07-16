import { post } from "./post";
import { fetchWithRetry } from ".";

describe("request utils", () => {
  describe("fetchWithRetry", () => {
    beforeEach(() => {
      vi.spyOn(global, "fetch");
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("successfully fetches data on the first try", async () => {
      const mockData = { success: true };
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
        ok: true,
      } as Response);

      const result = await fetchWithRetry<{ success: boolean }>(
        "https://example.com",
        {},
      );
      expect(result).toStrictEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("retries the specified number of times on failure, then succeeds", async () => {
      const mockData = { success: true };
      vi.mocked(global.fetch)
        .mockRejectedValueOnce(new Error("Network failure"))
        .mockRejectedValueOnce(new Error("Network failure"))
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockData),
          ok: true,
        } as Response);

      const result = await fetchWithRetry<{ success: boolean }>(
        "https://example.com",
        {},
        2,
      );
      expect(result).toStrictEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it("fails after the specified number of retries", async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error("Network failure"));

      await expect(
        fetchWithRetry("https://example.com", {}, 2),
      ).rejects.toThrow("Network failure");
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it("rejects if the response is not ok and does not retry fetch", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);
      let error = null;
      try {
        await fetchWithRetry("https://example.com", {});
      } catch (err) {
        error = err;
      }
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty("message");
      expect((error as Error).message).toBe(
        "GET Error: 500 - Internal Server Error",
      );
      expect(error).toHaveProperty("cause");
      expect((error as Error).cause).toStrictEqual({
        message: "Internal Server Error",
        statusCode: 500,
      });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("post", () => {
    beforeAll(() => {
      expect.extend({
        // We need a custom matcher because Headers don't behave as a standard object
        toBeHeader(received: Headers, expected: object) {
          const receivedString = JSON.stringify(
            Object.fromEntries(received.entries()),
          );
          const expectedString = JSON.stringify(expected);
          const { equals, isNot } = this;
          return {
            message: () =>
              `${receivedString} is${isNot ? " not" : ""} ${expectedString}`,
            pass: equals(receivedString, expectedString),
          };
        },
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should make a POST request and return the response for a successful request", async () => {
      const url = "/api/resource";
      const body = { key: "value" };
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
      });

      vi.spyOn(global, "fetch").mockImplementation(fetchMock);

      const response = await post(url, body);

      expect(fetchMock).toHaveBeenCalledWith("/api/resource", {
        body: JSON.stringify(body),
        credentials: "include",
        headers: expect.toBeHeader({ "content-type": "application/json" }),
        method: "POST",
      });
      expect(response).toStrictEqual({ ok: true });
    });

    it("should handle and report an error for a failed request", async () => {
      const url = "/api/resource";
      const body = { key: "value" };
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });
      const errorReportingMock = vi.fn();
      vi.spyOn(console, "error").mockImplementation(errorReportingMock);
      vi.spyOn(global, "fetch").mockImplementation(fetchMock);

      await post(url, body);

      expect(fetchMock).toHaveBeenCalledWith("/api/resource", {
        body: JSON.stringify(body),
        credentials: "include",
        headers: expect.toBeHeader({ "content-type": "application/json" }),
        method: "POST",
      });
      expect(errorReportingMock).toHaveBeenCalledTimes(1);
    });
  });
});
