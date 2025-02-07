import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { LogTypes } from "constants/enums";
import {
  LOG_FILE_DOWNLOAD_TOO_LARGE_WARNING,
  LOG_LINE_TOO_LARGE_WARNING,
} from "constants/errors";
import { LOG_LINE_SIZE_LIMIT } from "constants/logs";
import { useLogDownloader } from ".";

const API_URL = "/some/endpoint";

const textMessage =
  "Fetched a multiline log file\nSome more lines\nAnd some more";

describe("useLogDownloader", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("gets a good response from the log source and returns the array of log lines", async () => {
    const readableStream = createReadableStream([textMessage]);

    const response = new Response(readableStream, { status: 200 });

    mockFetch.mockResolvedValue(response);

    // RenderFakeToastContext is a mock of the ToastContext
    RenderFakeToastContext();
    const { result } = renderHook(() =>
      useLogDownloader({ logType: LogTypes.LOGKEEPER_LOGS, url: API_URL }),
    );
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toStrictEqual([
      "Fetched a multiline log file",
      "Some more lines",
      "And some more",
    ]);
  });
  it("gets a bad response from the api and returns an error", async () => {
    const mockFetchPromise = vi
      .fn()
      .mockRejectedValue(new Error("Something went wrong"));
    vi.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    // RenderFakeToastContext is a mock of the ToastContext
    RenderFakeToastContext();
    const { result } = renderHook(() =>
      useLogDownloader({ logType: LogTypes.EVERGREEN_TASK_LOGS, url: API_URL }),
    );
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBe("Something went wrong");
  });
  it("should update the progress bar as the log is downloaded", async () => {
    const readableStream = createReadableStream(["chunk1", "chunk2"]);

    const response = new Response(readableStream, { status: 200 });

    mockFetch.mockResolvedValue(response);

    // RenderFakeToastContext is a mock of the ToastContext
    RenderFakeToastContext();
    const { result } = renderHook(() =>
      useLogDownloader({ logType: LogTypes.LOGKEEPER_LOGS, url: API_URL }),
    );
    expect(result.current.isLoading).toBe(true);
    expect(result.current.fileSize).toBe(0);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.fileSize).toBe(12);
  });
  it("should remove the last log line if it is empty", async () => {
    const readableStream = createReadableStream(["chunk1\n", "chunk2\n", ""]);

    const response = new Response(readableStream, { status: 200 });

    mockFetch.mockResolvedValue(response);

    // RenderFakeToastContext is a mock of the ToastContext
    RenderFakeToastContext();
    const { result } = renderHook(() =>
      useLogDownloader({ logType: LogTypes.LOGKEEPER_LOGS, url: API_URL }),
    );
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toStrictEqual(["chunk1", "chunk2"]);
  });

  it("should throw a FILE_TOO_LARGE error if the file is too large and only download the file partially", async () => {
    const readableStream = createReadableStream(["chunk1\n", "chunk2\n"]);

    const response = new Response(readableStream, { status: 200 });

    mockFetch.mockResolvedValue(response);

    // RenderFakeToastContext is a mock of the ToastContext
    const { dispatchToast } = RenderFakeToastContext();
    const { result } = renderHook(() =>
      useLogDownloader({
        downloadSizeLimit: 5,
        logType: LogTypes.LOGKEEPER_LOGS,
        url: API_URL,
      }),
    );
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toStrictEqual(["chunk1"]);
    expect(dispatchToast.warning).toHaveBeenCalledWith(
      LOG_FILE_DOWNLOAD_TOO_LARGE_WARNING,
      true,
      { shouldTimeout: false, title: "Log not fully downloaded" },
    );
  });
  it("should throw a LINE_TOO_LARGE error if a line in the file is too large and needed to be trimmed", async () => {
    const readableStream = createReadableStream([
      `${"a".repeat(LOG_LINE_SIZE_LIMIT * 2)}`,
    ]);

    const response = new Response(readableStream, { status: 200 });

    mockFetch.mockResolvedValue(response);

    // RenderFakeToastContext is a mock of the ToastContext
    const { dispatchToast } = RenderFakeToastContext();
    const { result } = renderHook(() =>
      useLogDownloader({ logType: LogTypes.LOGKEEPER_LOGS, url: API_URL }),
    );
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toStrictEqual([
      `${"a".repeat(LOG_LINE_SIZE_LIMIT)}…`,
    ]);
    expect(dispatchToast.warning).toHaveBeenCalledWith(
      LOG_LINE_TOO_LARGE_WARNING,
      true,
      { shouldTimeout: false, title: "Log not fully downloaded" },
    );
  });
});

const createReadableStream = (chunks: string[]) => {
  const encoder = new TextEncoder();
  const encodedChunks = chunks.map((chunk) => encoder.encode(chunk));
  const readableStream = new ReadableStream({
    start(controller) {
      encodedChunks.forEach((chunk) => controller.enqueue(chunk));
      controller.close();
    },
  });
  return readableStream;
};
