import * as useDropzoneModule from "react-dropzone";
import { MemoryRouter } from "react-router-dom";
import { MockedFunction } from "vitest";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import { act, render, screen, waitFor } from "@evg-ui/lib/test_utils";
import * as streamUtils from "@evg-ui/lib/utils/streams";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import * as fileUtils from "utils/file";
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
  let mockUseDropzone: MockedFunction<typeof useDropzoneModule.useDropzone>;

  beforeEach(() => {
    mockUseLogContext = vi.mocked(useLogContext);
    mockUseLogContext.mockReturnValue({
      ingestLines: mockIngestLines,
      setFileName: mockSetFileName,
      setLogMetadata: mockSetLogMetadata,
    } as unknown as ReturnType<typeof useLogContext>);

    mockUseDropzone = vi.mocked(useDropzoneModule.useDropzone);
    mockUseDropzone.mockReturnValue({
      getInputProps: () => ({}),
      getRootProps: () => ({}),
      isDragActive: false,
      open: vi.fn(),
    } as unknown as ReturnType<typeof useDropzoneModule.useDropzone>);

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

    const mockOnDropAccepted = vi.fn();
    mockUseDropzone.mockReturnValue({
      getInputProps: () => ({}),
      getRootProps: () => ({}),
      isDragActive: false,
      onDropAccepted: mockOnDropAccepted,
      open: vi.fn(),
    } as unknown as ReturnType<typeof useDropzoneModule.useDropzone>);

    const { Component } = RenderFakeToastContext(<FileDropper />);
    render(<Component />, { wrapper: CustomWrapper() });

    act(() => {
      const options = mockUseDropzone.mock.calls[0][0];
      if (options && options.onDropAccepted) {
        options.onDropAccepted([mockFile], new Event("drop"));
      }
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      file: mockFile,
      type: "DROPPED_FILE",
    });
  });

  it("should process file and update log context when parsing method is selected", async () => {
    const mockDispatch = vi.fn();
    const mockFileContent = "line1\nline2\nline3";
    const mockFileName = "test-file.txt";
    const expectedLines = mockFileContent.split("\n");

    vi.spyOn(fileUtils, "fileToStream").mockResolvedValue(new ReadableStream());
    vi.spyOn(streamUtils, "decodeStream").mockResolvedValue({
      result: expectedLines,
      trimmedLines: false,
    });

    vi.mock("@leafygreen-ui/select", () => ({
      Option: ({ children }: { children: React.ReactNode }) => (
        <div data-testid={`option-${children}`}>{children}</div>
      ),
      Select: ({
        children,
        onChange,
      }: {
        children: React.ReactNode;
        onChange: (value: string) => void;
      }) => (
        <div>
          <button
            aria-label="Select Default option"
            aria-selected={false}
            data-testid="select-default"
            onClick={() => onChange(LogRenderingTypes.Default)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onChange(LogRenderingTypes.Default);
              }
            }}
            role="option"
            tabIndex={0}
            type="button"
          >
            Default
          </button>
          {children}
        </div>
      ),
    }));

    vi.spyOn(useLogDropStateModule, "default").mockReturnValue({
      dispatch: mockDispatch,
      state: {
        currentState: "PROMPT_FOR_PARSING_METHOD",
        file: { name: mockFileName, text: mockFileContent } as File & {
          text: string;
        },
        text: null,
        type: LogDropType.FILE,
      },
    });

    const { Component } = RenderFakeToastContext(<FileDropper />);
    render(<Component />, { wrapper: CustomWrapper() });

    const defaultOption = screen.getByTestId("select-default");
    act(() => {
      defaultOption.click();
    });

    const processLogButton = screen.getByText("Process Log");
    expect(processLogButton).toBeInTheDocument();

    act(() => {
      processLogButton.click();
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: "PARSE_FILE" });
    expect(mockSetLogMetadata).toHaveBeenCalledWith({
      logType: LogTypes.LOCAL_UPLOAD,
      renderingType: LogRenderingTypes.Default,
    });

    await waitFor(() => {
      expect(mockSetFileName).toHaveBeenCalledWith(mockFileName);
    });

    await waitFor(() => {
      expect(mockIngestLines).toHaveBeenCalledWith(
        expectedLines,
        LogRenderingTypes.Default,
      );
    });
  });
});
