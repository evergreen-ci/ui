import * as Sentry from "@sentry/react";
import { mockEnvironmentVariables } from "test_utils/utils";
import { initializeErrorHandling } from ".";

const { cleanup, mockEnv } = mockEnvironmentVariables();

describe("should initialize error handlers according to release stage", () => {
  beforeEach(() => {
    vi.spyOn(Sentry, "init").mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("development", () => {
    mockEnv("NODE_ENV", "development");
    mockEnv("REACT_APP_RELEASE_STAGE", "production");
    initializeErrorHandling();

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("production", () => {
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_RELEASE_STAGE", "production");
    mockEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Sentry.init).toHaveBeenCalledWith({
      beforeBreadcrumb: expect.any(Function),
      debug: false,
      dsn: "fake-sentry-key",
      environment: "production",
      normalizeDepth: 5,
    });
  });

  it("beta", () => {
    mockEnv("REACT_APP_RELEASE_STAGE", "beta");
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Sentry.init).toHaveBeenCalledWith({
      beforeBreadcrumb: expect.any(Function),
      debug: true,
      dsn: "fake-sentry-key",
      environment: "beta",
      normalizeDepth: 5,
    });
  });

  it("staging", () => {
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_RELEASE_STAGE", "staging");
    mockEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(Sentry.init).toHaveBeenCalledWith({
      beforeBreadcrumb: expect.any(Function),
      debug: true,
      dsn: "fake-sentry-key",
      environment: "staging",
      normalizeDepth: 5,
    });
  });
});

describe("should not initialize if the client is already running", () => {
  beforeEach(() => {
    vi.spyOn(Sentry, "init").mockImplementation(vi.fn());
    mockEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("does not initialize Sentry twice", () => {
    vi.spyOn(Sentry, "isInitialized").mockReturnValue(true);
    initializeErrorHandling();
    expect(Sentry.init).not.toHaveBeenCalled();
  });
});
