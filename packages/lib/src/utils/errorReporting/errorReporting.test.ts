import {
  isInitialized,
  captureException,
  setTags,
  addBreadcrumb,
} from "@sentry/react";
import { reportError, leaveBreadcrumb, SentryBreadcrumbTypes } from ".";

vi.mock("@sentry/react", async () => {
  // Grab original module to keep other Sentry functions intact
  const original =
    await vi.importActual<typeof import("@sentry/react")>("@sentry/react");
  return {
    ...original,
    // Override just `isInitialized`
    isInitialized: vi.fn(() => false),
    captureException: vi.fn(),
    setTags: vi.fn(),
    addBreadcrumb: vi.fn(),
  };
});

describe("error reporting", () => {
  describe("reportError", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
      vi.unstubAllEnvs();
      vi.restoreAllMocks();
    });

    it("should log errors into console when sentry has not been initialized", () => {
      const err = new Error("test error");
      const result = reportError(err);
      result.severe();
      expect(console.error).toHaveBeenCalledWith({
        err,
        severity: "severe",
      });
      result.warning();
      expect(console.error).toHaveBeenLastCalledWith({
        err,
        severity: "warning",
      });
      expect(vi.mocked(captureException)).not.toHaveBeenCalled();
    });

    it("should report errors to Sentry when sentry has been initialized", () => {
      vi.mocked(isInitialized).mockReturnValue(true);

      const err = new Error("test error");
      const result = reportError(err);
      result.severe();
      expect(vi.mocked(captureException)).toHaveBeenCalledWith(err);
      result.warning();
      expect(vi.mocked(captureException)).toHaveBeenCalledWith(err);
    });

    it("supports context field", () => {
      const err = {
        message: "GraphQL Error",
        name: "Error Name",
      };
      vi.mocked(isInitialized).mockReturnValue(true);

      const context = { anything: "foo" };
      const result = reportError(err, { context });
      result.severe();
      expect(vi.mocked(captureException)).toHaveBeenCalledWith(err);
      result.warning();
      expect(vi.mocked(captureException)).toHaveBeenCalledWith(err);
    });

    it("supports tags", () => {
      const err = {
        message: "GraphQL Error",
        name: "Error Name",
      };
      vi.mocked(isInitialized).mockReturnValue(true);

      const tags = { spruce: "true" };
      const result = reportError(err, { tags });
      result.severe();
      expect(vi.mocked(captureException)).toHaveBeenCalledWith(err);
      expect(vi.mocked(setTags)).toHaveBeenCalledWith(tags);
      result.warning();
      expect(vi.mocked(captureException)).toHaveBeenCalledWith(err);
      expect(vi.mocked(setTags)).toHaveBeenCalledWith(tags);
    });
  });
});

describe("breadcrumbs", () => {
  beforeEach(() => {
    vi.spyOn(console, "debug").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("should log breadcrumbs into console when sentry is not initialized", () => {
    const message = "my message";
    const type = SentryBreadcrumbTypes.Error;
    const metadata = { foo: "bar" };

    leaveBreadcrumb(message, metadata, type);
    expect(console.debug).toHaveBeenLastCalledWith({
      message,
      metadata,
      type,
    });
    expect(vi.mocked(addBreadcrumb)).not.toHaveBeenCalled();
  });

  it("should report breadcrumbs to Sentry when sentry has been initialized", () => {
    vi.useFakeTimers().setSystemTime(new Date("2020-01-01"));
    vi.mocked(isInitialized).mockReturnValue(true);

    const message = "my message";
    const type = SentryBreadcrumbTypes.Info;
    const metadata = { status_code: 401 };

    leaveBreadcrumb(message, metadata, type);
    expect(vi.mocked(addBreadcrumb)).toHaveBeenCalledWith({
      data: { status_code: 401 },
      message,
      timestamp: 1577836800,
      type: "info",
    });
    vi.useRealTimers();
  });
});
