import { post } from "./request";

describe("request utils", () => {
  describe("post", () => {
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

      expect(response).toStrictEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledWith("/api/resource", {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
      });
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
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
      });
      expect(errorReportingMock).toHaveBeenCalledTimes(1);
    });
  });
});
