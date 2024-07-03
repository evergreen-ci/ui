import { init, isInitialized } from "@sentry/react";
import { mockEnvironmentVariables } from "test_utils/utils";
import { initializeErrorHandling } from ".";

const { cleanup, mockEnv } = mockEnvironmentVariables();

vi.mock("@sentry/react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // @ts-expect-error
    ...actual,
    init: vi.fn(),
    isInitialized: vi.fn().mockReturnValue(false),
  };
});

describe("should initialize error handlers according to release stage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("development", () => {
    mockEnv("NODE_ENV", "development");
    mockEnv("REACT_APP_RELEASE_STAGE", "production");
    initializeErrorHandling();

    expect(vi.mocked(init)).not.toHaveBeenCalled();
  });

  it("production", () => {
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_RELEASE_STAGE", "production");
    mockEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(vi.mocked(init)).toHaveBeenCalledWith({
      beforeBreadcrumb: expect.any(Function),
      beforeSend: expect.any(Function),
      debug: false,
      dsn: "fake-sentry-key",
      environment: "production",
      maxValueLength: 500,
      normalizeDepth: 5,
      sampleRate: 0.5,
    });
  });

  it("beta", () => {
    mockEnv("REACT_APP_RELEASE_STAGE", "beta");
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(vi.mocked(init)).toHaveBeenCalledWith({
      beforeBreadcrumb: expect.any(Function),
      beforeSend: expect.any(Function),
      debug: true,
      dsn: "fake-sentry-key",
      environment: "beta",
      maxValueLength: 500,
      normalizeDepth: 5,
      sampleRate: 0.5,
    });
  });

  it("staging", () => {
    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_RELEASE_STAGE", "staging");
    mockEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(vi.mocked(init)).toHaveBeenCalledWith({
      beforeBreadcrumb: expect.any(Function),
      beforeSend: expect.any(Function),
      debug: true,
      dsn: "fake-sentry-key",
      environment: "staging",
      normalizeDepth: 5,
      sampleRate: 0.5,
    });
  });
});

describe("should not initialize if the client is already running", () => {
  beforeEach(() => {
    mockEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("does not initialize Sentry twice", () => {
    vi.mocked(isInitialized).mockReturnValue(true);
    initializeErrorHandling();
    expect(vi.mocked(init)).not.toHaveBeenCalled();
  });
});
