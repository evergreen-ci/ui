import * as Sentry from "@sentry/react";
import { overwriteFakeTimers } from "test_utils";
import { mockEnvironmentVariables } from "test_utils/utils";
import {
  SentryBreadcrumb,
  leaveBreadcrumb,
  reportError,
} from "utils/errorReporting";

const { cleanup, mockEnv } = mockEnvironmentVariables();

describe("error reporting", () => {
  beforeAll(() => {
    overwriteFakeTimers();
  });

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(Sentry, "captureException");
  });
  afterEach(() => {
    cleanup();
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
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("should report errors to Sentry when in production", () => {
    mockEnv("NODE_ENV", "production");
    vi.spyOn(Sentry, "captureException").mockImplementation(vi.fn());

    const err = new Error("test error");
    const result = reportError(err);
    result.severe();
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
    result.warning();
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
  });

  it("supports context field", () => {
    mockEnv("NODE_ENV", "production");
    vi.spyOn(Sentry, "captureException").mockImplementation(vi.fn());
    const err = {
      message: "GraphQL Error",
      name: "Error Name",
    };

    const context = { anything: "foo" };
    const result = reportError(err, { context });
    result.severe();
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
    result.warning();
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
  });

  it("supports tags", () => {
    mockEnv("NODE_ENV", "production");
    vi.spyOn(Sentry, "captureException").mockImplementation(vi.fn());
    vi.spyOn(Sentry, "setTags").mockImplementation(vi.fn());
    const err = {
      message: "GraphQL Error",
      name: "Error Name",
    };

    const tags = { spruce: "true" };
    const result = reportError(err, { tags });
    result.severe();
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
    expect(Sentry.setTags).toHaveBeenCalledWith(tags);
    result.warning();
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
    expect(Sentry.setTags).toHaveBeenCalledWith(tags);
  });
});

describe("breadcrumbs", () => {
  beforeEach(() => {
    vi.spyOn(console, "debug").mockImplementation(() => {});
    vi.spyOn(Sentry, "addBreadcrumb");
  });
  afterEach(() => {
    cleanup();
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
    expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
  });

  it("should report breadcrumbs to Sentry when in production", () => {
    vi.useFakeTimers().setSystemTime(new Date("2020-01-01"));
    mockEnv("NODE_ENV", "production");
    vi.spyOn(Sentry, "addBreadcrumb").mockImplementation(vi.fn());

    const message = "my message";
    const type = SentryBreadcrumb.Info;
    const metadata = { status_code: 401 };

    leaveBreadcrumb(message, metadata, type);
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
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
    mockEnv("NODE_ENV", "production");
    vi.spyOn(Sentry, "addBreadcrumb").mockImplementation(vi.fn());

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
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      data: {},
      message,
      timestamp: 1577836800,
      type,
    });
    vi.useRealTimers();
  });
});
