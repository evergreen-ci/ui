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
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1 }),
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
        ok: true,
        status: 201,
        json: () => Promise.resolve({ id: 2 }),
      });
      const body = { name: "my-agent" };
      await new SageClient(BASE_URL).post("/agents", body);
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://sage-api.test/agents",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(body),
        }),
      );
    });
  });

  it("returns ok=true with parsed JSON on a 2xx response", async () => {
    const data = { agentId: "abc123" };
    mockFetch({
      ok: true,
      status: 200,
      json: () => Promise.resolve(data),
    });
    const result = await new SageClient(BASE_URL).get("/agents/abc123");
    expect(result).toStrictEqual({ ok: true, data });
  });

  it("sends credentials=include on every request", async () => {
    const fetchSpy = mockFetch({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
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
      ok: true,
      status: 201,
      json: () => Promise.resolve({}),
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
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: () => Promise.resolve({ error: "something" }),
      });
      const result = await new SageClient(BASE_URL).get("/agents/missing");
      expect(result).toStrictEqual({
        ok: false,
        type: "client",
        status: 404,
        message: "Not Found",
      });
    });

    it("falls back to statusText when body is not JSON", async () => {
      mockFetch({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () => Promise.reject(new Error("not json")),
      });
      const result = await new SageClient(BASE_URL).get("/agents/bad");
      expect(result).toStrictEqual({
        ok: false,
        type: "client",
        status: 400,
        message: "Bad Request",
      });
    });

    it("returns body message when present", async () => {
      mockFetch({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () => Promise.resolve({ message: "invalid agent ID format" }),
      });
      const result = await new SageClient(BASE_URL).get("/agents/bad");
      expect(result).toStrictEqual({
        ok: false,
        type: "client",
        status: 400,
        message: "invalid agent ID format",
      });
    });
  });

  describe("5xx error handling", () => {
    it("returns server error type for 500", async () => {
      mockFetch({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.resolve({}),
      });
      const result = await new SageClient(BASE_URL).get("/agents");
      expect(result).toStrictEqual({
        ok: false,
        type: "server",
        status: 500,
        message: "Internal Server Error",
      });
    });

    it("returns server error type for 503", async () => {
      mockFetch({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
        json: () => Promise.resolve({}),
      });
      const result = await new SageClient(BASE_URL).get("/agents");
      expect(result).toStrictEqual({
        ok: false,
        type: "server",
        status: 503,
        message: "Service Unavailable",
      });
    });
  });

  describe("network error handling", () => {
    it("returns network error and calls reportError on fetch throw", async () => {
      mockFetchError(new Error("Failed to fetch"));
      const result = await new SageClient(BASE_URL).get("/agents");
      expect(result).toStrictEqual({
        ok: false,
        type: "network",
        message: "Failed to fetch",
      });
      expect(reportError).toHaveBeenCalledTimes(1);
    });
  });

  it("leaves a breadcrumb on every request", async () => {
    mockFetch({ ok: true, status: 200, json: () => Promise.resolve({}) });
    await new SageClient(BASE_URL).get("/agents");
    expect(leaveBreadcrumb).toHaveBeenCalledWith(
      "sageRequest",
      expect.objectContaining({ url: "https://sage-api.test/agents" }),
      expect.anything(),
    );
  });
});
