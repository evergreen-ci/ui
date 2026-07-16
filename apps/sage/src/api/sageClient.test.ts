import { leaveBreadcrumb, reportError } from "@evg-ui/lib/utils/errorReporting";
import { SageClient } from "./sageClient";

vi.mock("@evg-ui/lib/utils/errorReporting", () => ({
  leaveBreadcrumb: vi.fn(),
  reportError: vi.fn(() => ({ severe: vi.fn() })),
}));

const BASE_URL = "https://sage-api.test";

const mockFetch = (response: Partial<Response>) =>
  vi.spyOn(global, "fetch").mockResolvedValueOnce(response as Response);

const mockFetchError = (error: Error) =>
  vi.spyOn(global, "fetch").mockRejectedValueOnce(error);

describe("SageClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("get", () => {
    it("calls fetch with method GET", async () => {
      const fetchSpy = mockFetch({
        json: () => Promise.resolve({ id: 1 }),
        ok: true,
        status: 200,
      });
      await new SageClient(BASE_URL).get("/agents");
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://sage-api.test/agents",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("post", () => {
    it("calls fetch with method POST and serialized body", async () => {
      const fetchSpy = mockFetch({
        json: () => Promise.resolve({ id: 2 }),
        ok: true,
        status: 201,
      });
      const body = { name: "my-agent" };
      await new SageClient(BASE_URL).post("/agents", body);
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://sage-api.test/agents",
        expect.objectContaining({
          body: JSON.stringify(body),
          method: "POST",
        }),
      );
    });
  });

  it("returns ok=true with parsed JSON on a 2xx response", async () => {
    const data = { agentId: "abc123" };
    mockFetch({
      json: () => Promise.resolve(data),
      ok: true,
      status: 200,
    });
    const result = await new SageClient(BASE_URL).get("/agents/abc123");
    expect(result).toStrictEqual({ data, ok: true });
  });

  it("sends credentials=include on every request", async () => {
    const fetchSpy = mockFetch({
      json: () => Promise.resolve({}),
      ok: true,
      status: 200,
    });
    await new SageClient(BASE_URL).get("/agents");
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://sage-api.test/agents",
      expect.objectContaining({
        credentials: "include",
      }),
    );
  });

  it("sends Content-Type=application/json on POST requests", async () => {
    const fetchSpy = mockFetch({
      json: () => Promise.resolve({}),
      ok: true,
      status: 201,
    });
    await new SageClient(BASE_URL).post("/agents", { name: "a" });
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://sage-api.test/agents",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  describe("401 handling", () => {
    it("calls logout and returns unauthenticated", async () => {
      mockFetch({ ok: false, status: 401, statusText: "Unauthorized" });
      const logout = vi.fn();
      const result = await new SageClient(BASE_URL, logout).get("/agents");
      expect(logout).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({ ok: false, type: "unauthenticated" });
    });

    it("does not throw when no logout is provided", async () => {
      mockFetch({ ok: false, status: 401, statusText: "Unauthorized" });
      const result = await new SageClient(BASE_URL).get("/agents");
      expect(result).toStrictEqual({ ok: false, type: "unauthenticated" });
    });
  });

  describe("4xx error handling", () => {
    it("falls back to statusText when body has no message field", async () => {
      mockFetch({
        json: () => Promise.resolve({ error: "something" }),
        ok: false,
        status: 404,
        statusText: "Not Found",
      });
      const result = await new SageClient(BASE_URL).get("/agents/missing");
      expect(result).toStrictEqual({
        message: "Not Found",
        ok: false,
        status: 404,
        type: "client",
      });
    });

    it("falls back to statusText when body is not JSON", async () => {
      mockFetch({
        json: () => Promise.reject(new Error("not json")),
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });
      const result = await new SageClient(BASE_URL).get("/agents/bad");
      expect(result).toStrictEqual({
        message: "Bad Request",
        ok: false,
        status: 400,
        type: "client",
      });
    });

    it("returns body message when present", async () => {
      mockFetch({
        json: () => Promise.resolve({ message: "invalid agent ID format" }),
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });
      const result = await new SageClient(BASE_URL).get("/agents/bad");
      expect(result).toStrictEqual({
        message: "invalid agent ID format",
        ok: false,
        status: 400,
        type: "client",
      });
    });
  });

  describe("5xx error handling", () => {
    it("returns server error type for 500", async () => {
      mockFetch({
        json: () => Promise.resolve({}),
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });
      const result = await new SageClient(BASE_URL).get("/agents");
      expect(result).toStrictEqual({
        message: "Internal Server Error",
        ok: false,
        status: 500,
        type: "server",
      });
    });

    it("returns server error type for 503", async () => {
      mockFetch({
        json: () => Promise.resolve({}),
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
      });
      const result = await new SageClient(BASE_URL).get("/agents");
      expect(result).toStrictEqual({
        message: "Service Unavailable",
        ok: false,
        status: 503,
        type: "server",
      });
    });
  });

  describe("network error handling", () => {
    it("returns network error and calls reportError on fetch throw", async () => {
      mockFetchError(new Error("Failed to fetch"));
      const result = await new SageClient(BASE_URL).get("/agents");
      expect(result).toStrictEqual({
        message: "Failed to fetch",
        ok: false,
        type: "network",
      });
      expect(reportError).toHaveBeenCalledTimes(1);
    });
  });

  it("leaves a breadcrumb on every request", async () => {
    mockFetch({ json: () => Promise.resolve({}), ok: true, status: 200 });
    await new SageClient(BASE_URL).get("/agents");
    expect(leaveBreadcrumb).toHaveBeenCalledWith(
      "sageRequest",
      expect.objectContaining({ url: "https://sage-api.test/agents" }),
      expect.anything(),
    );
  });
});
