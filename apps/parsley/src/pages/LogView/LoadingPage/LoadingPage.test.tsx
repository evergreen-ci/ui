import { waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import { render } from "@evg-ui/lib/test_utils";
import * as ErrorReporting from "@evg-ui/lib/utils/errorReporting";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import LoadingPage from ".";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({
      buildID: "test-build-id",
      execution: "0",
      logType: LogTypes.EVERGREEN_TEST_LOGS,
      taskID: "test-task-id",
      testID: "test-test-id",
    }),
  };
});

vi.mock("context/LogContext", async () => {
  const actual = await vi.importActual("context/LogContext");
  return {
    ...actual,
    useLogContext: vi.fn(),
  };
});

vi.mock("hooks/useFetch", () => ({
  useFetch: () => ({ data: null, error: null, isLoading: false }),
}));

vi.mock("hooks", () => ({
  useLogDownloader: () => ({
    data: ["line 1", "line 2", "line 3"],
    error: "",
    fileSize: 1024,
    isLoading: false,
  }),
}));

vi.mock("./useResolveLogURLAndRenderingType", () => ({
  useResolveLogURLAndRenderingType: () => ({
    loading: false,
    rawLogURL: "test-url",
    renderingType: LogRenderingTypes.Default,
  }),
}));

vi.mock("react-error-boundary", () => ({
  withErrorBoundary: (Component: React.ComponentType) => Component,
}));

describe("LoadingPage", () => {
  const mockIngestLines = vi.fn();
  const mockSetLogMetadata = vi.fn();

  beforeEach(() => {
    vi.spyOn(ErrorReporting, "reportError");

    vi.mocked(useLogContext).mockReturnValue({
      hasLogs: null,
      ingestLines: mockIngestLines,
      lineCount: 0,
      setLogMetadata: mockSetLogMetadata,
    } as any); // Type assertion needed for test mocks

    mockIngestLines.mockReset();
    mockSetLogMetadata.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should set log metadata and ingest lines when data is loaded", async () => {
    const { Component } = RenderFakeToastContext(
      <LoadingPage logType={LogTypes.EVERGREEN_TEST_LOGS} />,
    );
    const CustomWrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>{logContextWrapper()({ children })}</MemoryRouter>
    );

    render(<Component />, { wrapper: CustomWrapper });

    await waitFor(() => {
      expect(mockSetLogMetadata).toHaveBeenCalled();
    });

    expect(mockIngestLines).toHaveBeenCalled();
  });
});
