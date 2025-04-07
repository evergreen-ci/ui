import { act } from "@testing-library/react";
import * as useDropzoneModule from "react-dropzone";
import { MemoryRouter } from "react-router-dom";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import { render, screen } from "@evg-ui/lib/test_utils";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import { LogDropType } from "./constants";
import FileDropper from "./FileDropper";
import * as useLogDropStateModule from "./state";

vi.mock("context/LogContext", async () => {
  const actual = await vi.importActual("context/LogContext");
  return {
    ...actual,
    useLogContext: vi.fn(),
  };
});

vi.mock("react-dropzone", async () => {
  const actual = await vi.importActual("react-dropzone");
  return {
    ...actual,
    useDropzone: vi.fn(),
  };
});

const CustomWrapper = (logs: string[] = []) => {
  const LogContextWrapper = logContextWrapper(logs);
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <LogContextWrapper>{children}</LogContextWrapper>
    </MemoryRouter>
  );
  Wrapper.displayName = "CustomWrapper";
  return Wrapper;
};

describe("FileDropper", () => {
  const mockIngestLines = vi.fn();
  const mockSetFileName = vi.fn();
  const mockSetLogMetadata = vi.fn();
  let mockUseLogContext;
  let mockUseDropzone: any;

  beforeEach(() => {
    mockUseLogContext = vi.mocked(useLogContext);
    mockUseLogContext.mockReturnValue({
      ingestLines: mockIngestLines,
      setFileName: mockSetFileName,
      setLogMetadata: mockSetLogMetadata,
    } as any);

    mockUseDropzone = vi.mocked(useDropzoneModule.useDropzone);
    mockUseDropzone.mockReturnValue({
      getInputProps: () => ({ type: "file" }),
      getRootProps: () => ({ role: "button" }),
      isDragActive: false,
      open: vi.fn(),
    });

    mockIngestLines.mockReset();
    mockSetFileName.mockReset();
    mockSetLogMetadata.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should show the initial waiting-for-file state", () => {
    vi.spyOn(useLogDropStateModule, "default").mockReturnValue({
      dispatch: vi.fn(),
      state: {
        currentState: "WAITING_FOR_FILE",
        file: null,
        text: null,
        type: null,
      },
    });

    const { Component } = RenderFakeToastContext(<FileDropper />);
    render(<Component />, { wrapper: CustomWrapper() });

    expect(screen.getByText(/Drag and Drop a log file/i)).toBeInTheDocument();
    expect(
      screen.getByText(/paste text from your clipboard/i),
    ).toBeInTheDocument();
  });

  it("should show parsing method selection when a file is dropped", () => {
    vi.spyOn(useLogDropStateModule, "default").mockReturnValue({
      dispatch: vi.fn(),
      state: {
        currentState: "PROMPT_FOR_PARSING_METHOD",
        file: { name: "test-file.txt" } as File,
        text: null,
        type: LogDropType.FILE,
      },
    });

    const { Component } = RenderFakeToastContext(<FileDropper />);
    render(<Component />, { wrapper: CustomWrapper() });

    expect(
      screen.getByText(/How would you like to parse/i),
    ).toBeInTheDocument();
    expect(screen.getByText("test-file.txt")).toBeInTheDocument();
  });

  it("should show parsing state when processing a file", () => {
    vi.spyOn(useLogDropStateModule, "default").mockReturnValue({
      dispatch: vi.fn(),
      state: {
        currentState: "LOADING_FILE",
        file: { name: "test-file.txt" } as File,
        text: null,
        type: LogDropType.FILE,
      },
    });

    const { Component } = RenderFakeToastContext(<FileDropper />);
    render(<Component />, { wrapper: CustomWrapper() });

    expect(screen.getByText(/Loading log/i)).toBeInTheDocument();
  });

  it("should handle file drops correctly", async () => {
    const mockDispatch = vi.fn();

    vi.spyOn(useLogDropStateModule, "default").mockReturnValue({
      dispatch: mockDispatch,
      state: {
        currentState: "WAITING_FOR_FILE",
        file: null,
        text: null,
        type: null,
      },
    });

    const mockFile = new File(["test file content"], "test.txt", {
      type: "text/plain",
    });

    mockUseDropzone.mockReturnValue({
      getInputProps: () => ({ type: "file" }),
      getRootProps: () => ({ role: "button" }),
      isDragActive: false,
      open: vi.fn(),
    });

    const { Component } = RenderFakeToastContext(<FileDropper />);
    render(<Component />, { wrapper: CustomWrapper() });

    const { onDropAccepted } = mockUseDropzone.mock.calls[0][0];

    act(() => {
      onDropAccepted([mockFile]);
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      file: mockFile,
      type: "DROPPED_FILE",
    });
  });

  it("should process file and update log context when parsing method is selected", async () => {
    const mockDispatch = vi.fn();

    vi.spyOn(useLogDropStateModule, "default").mockReturnValue({
      dispatch: mockDispatch,
      state: {
        currentState: "PROMPT_FOR_PARSING_METHOD",
        file: { name: "test-file.txt", text: "line1\nline2\nline3" } as any,
        text: null,
        type: LogDropType.FILE,
      },
    });

    const { Component } = RenderFakeToastContext(<FileDropper />);
    render(<Component />, { wrapper: CustomWrapper() });

    const processLogButton = screen.getByText("Process Log");
    expect(processLogButton).toBeInTheDocument();

    const onParse = (renderingType: LogRenderingTypes) => {
      mockDispatch({ type: "PARSE_FILE" });
      mockSetLogMetadata({
        logType: LogTypes.LOCAL_UPLOAD,
        renderingType,
      });
      mockIngestLines(["line1", "line2", "line3"], renderingType);
    };

    act(() => {
      onParse(LogRenderingTypes.Default);
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: "PARSE_FILE" });
    expect(mockSetLogMetadata).toHaveBeenCalledWith({
      logType: LogTypes.LOCAL_UPLOAD,
      renderingType: LogRenderingTypes.Default,
    });
    expect(mockIngestLines).toHaveBeenCalledWith(
      ["line1", "line2", "line3"],
      LogRenderingTypes.Default,
    );
  });
});
