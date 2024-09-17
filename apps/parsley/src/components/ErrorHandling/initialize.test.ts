import { init, isInitialized } from "@sentry/react";
import { initializeErrorHandling } from ".";

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
    vi.unstubAllEnvs();
  });

  it("development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("REACT_APP_RELEASE_STAGE", "production");
    initializeErrorHandling();

    expect(vi.mocked(init)).not.toHaveBeenCalled();
  });

  it("production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("REACT_APP_RELEASE_STAGE", "production");
    vi.stubEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
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
    vi.stubEnv("REACT_APP_RELEASE_STAGE", "beta");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
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
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("REACT_APP_RELEASE_STAGE", "staging");
    vi.stubEnv("REACT_APP_PARSLEY_SENTRY_DSN", "fake-sentry-key");
    initializeErrorHandling();

    expect(vi.mocked(init)).toHaveBeenCalledWith({
      beforeBreadcrumb: expect.any(Function),
      beforeSend: expect.any(Function),
      debug: true,
      dsn: "fake-sentry-key",
      environment: "staging",
      maxValueLength: 500,
      normalizeDepth: 5,
      sampleRate: 0.5,
    });
  });
});

describe("should not initialize if the client is already running", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("does not initialize Sentry twice", () => {
    vi.mocked(isInitialized).mockReturnValue(true);
    initializeErrorHandling();
    expect(vi.mocked(init)).not.toHaveBeenCalled();
  });
});
