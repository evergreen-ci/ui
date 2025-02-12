import { addBreadcrumb, captureException, setTags } from "@sentry/react";
import {
  SentryBreadcrumb,
  leaveBreadcrumb,
  reportError,
} from "utils/errorReporting";

vi.mock("@sentry/react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // @ts-expect-error: Not necessary to mock the entire object for the test.
    ...actual,
    addBreadcrumb: vi.fn(),
    captureException: vi.fn(),
    setTags: vi.fn(),
  };
});

describe("error reporting", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("should log errors into console when not in production", () => {
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

  it("should report errors to Sentry when in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    const err = new Error("test error");
    const result = reportError(err);
    result.severe();
    expect(vi.mocked(captureException)).toHaveBeenCalledWith(err);
    result.warning();
    expect(vi.mocked(captureException)).toHaveBeenCalledWith(err);
  });

  it("supports context field", () => {
    vi.stubEnv("NODE_ENV", "production");
    const err = {
      message: "GraphQL Error",
      name: "Error Name",
    };

    const context = { anything: "foo" };
    const result = reportError(err, { context });
    result.severe();
    expect(vi.mocked(captureException)).toHaveBeenCalledWith(err);
    result.warning();
    expect(vi.mocked(captureException)).toHaveBeenCalledWith(err);
  });

  it("supports tags", () => {
    vi.stubEnv("NODE_ENV", "production");
    const err = {
      message: "GraphQL Error",
      name: "Error Name",
    };

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

describe("breadcrumbs", () => {
  beforeEach(() => {
    vi.spyOn(console, "debug").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("should log breadcrumbs into console when not in production", () => {
    const message = "my message";
    const type = SentryBreadcrumb.Error;
    const metadata = { foo: "bar" };

    leaveBreadcrumb(message, metadata, type);
    expect(console.debug).toHaveBeenLastCalledWith({
      message,
      metadata,
      type,
    });
    expect(vi.mocked(addBreadcrumb)).not.toHaveBeenCalled();
  });

  it("should report breadcrumbs to Sentry when in production", () => {
    vi.useFakeTimers().setSystemTime(new Date("2020-01-01"));
    vi.stubEnv("NODE_ENV", "production");

    const message = "my message";
    const type = SentryBreadcrumb.Info;
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

  it("warns when 'from' or 'to' fields are missing with a navigation breadcrumb", () => {
    vi.useFakeTimers().setSystemTime(new Date("2020-01-01"));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "production");

    const message = "navigation message";
    const type = SentryBreadcrumb.Navigation;
    const metadata = {};

    leaveBreadcrumb(message, metadata, type);
    expect(console.warn).toHaveBeenNthCalledWith(
      1,
      "Navigation breadcrumbs should include a 'from' metadata field.",
    );
    expect(console.warn).toHaveBeenNthCalledWith(
      2,
      "Navigation breadcrumbs should include a 'to' metadata field.",
    );
    expect(vi.mocked(addBreadcrumb)).toHaveBeenCalledWith({
      data: {},
      message,
      timestamp: 1577836800,
      type,
    });
    vi.useRealTimers();
  });
});
