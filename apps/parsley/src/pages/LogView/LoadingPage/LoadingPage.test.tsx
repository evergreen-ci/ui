import { MemoryRouter } from "react-router-dom";
import {
  RenderFakeToastContext,
  render,
  waitFor,
} from "@evg-ui/lib/test_utils";
import * as ErrorReporting from "@evg-ui/lib/utils";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { slugs } from "constants/routes";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import LoadingPage from ".";

const TEST_BUILD_ID = "test-build-id";
const TEST_EXECUTION = "0";
const TEST_TASK_ID = "test-task-id";
const TEST_TEST_ID = "test-test-id";
const TEST_RAW_LOG_URL = "test-raw-log-url";
const TEST_HTML_LOG_URL = "test-html-log-url";
const TEST_JOB_LOGS_URL = "test-job-logs-url";
const TEST_LOG_LINES = ["line 1", "line 2", "line 3"];

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({
      [slugs.buildID]: TEST_BUILD_ID,
      [slugs.execution]: TEST_EXECUTION,
      [slugs.taskID]: TEST_TASK_ID,
      [slugs.testID]: TEST_TEST_ID,
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
    data: TEST_LOG_LINES,
    error: "",
    fileSize: 1024,
    isLoading: false,
  }),
}));

vi.mock("./useResolveLogURLAndRenderingType", () => ({
  useResolveLogURLAndRenderingType: () => ({
    downloadURL: "test-download-url",
    htmlLogURL: TEST_HTML_LOG_URL,
    jobLogsURL: TEST_JOB_LOGS_URL,
    loading: false,
    rawLogURL: TEST_RAW_LOG_URL,
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
    } as unknown as ReturnType<typeof useLogContext>);

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
      expect(mockSetLogMetadata).toHaveBeenCalledWith({
        buildID: TEST_BUILD_ID,
        execution: TEST_EXECUTION,
        fileName: undefined,
        groupID: undefined,
        htmlLogURL: TEST_HTML_LOG_URL,
        jobLogsURL: TEST_JOB_LOGS_URL,
        logType: LogTypes.EVERGREEN_TEST_LOGS,
        origin: undefined,
        rawLogURL: TEST_RAW_LOG_URL,
        renderingType: LogRenderingTypes.Default,
        taskID: TEST_TASK_ID,
        testID: TEST_TEST_ID,
      });
    });

    expect(mockIngestLines).toHaveBeenCalledWith(
      TEST_LOG_LINES,
      LogRenderingTypes.Default,
      undefined,
    );
    expect(TEST_LOG_LINES).toEqual(["line 1", "line 2", "line 3"]);
  });
});
