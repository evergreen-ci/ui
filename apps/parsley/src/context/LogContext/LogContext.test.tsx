import Cookie from "js-cookie";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MockInstance } from "vitest";
import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import { act, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { LogRenderingTypes } from "constants/enums";
import { RowType } from "types/logs";
import { isSectionHeaderRow, isSkippedLinesRow } from "utils/logRowTypes";
import { logContextWrapper } from "./test_utils";
import { DIRECTION } from "./types";
import { useLogContext } from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const Router = ({
  children,
  route = "/",
}: {
  children: React.ReactNode;
  route?: string;
}) => (
  <MemoryRouter initialEntries={[route]}>
    <Routes>
      <Route element={children} path="/" />
    </Routes>
  </MemoryRouter>
);

const wrapper = (loglines: string[] = [], route: string = "/") => {
  const LogContextWrapper = logContextWrapper(loglines);
  const renderContent = ({ children }: { children: React.ReactNode }) => (
    <Router route={route}>
      <LogContextWrapper>{children}</LogContextWrapper>
    </Router>
  );
  return renderContent;
};

describe("useLogContext", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
  });
  it("should initialized with an empty list of logs", () => {
    const { result } = renderHook(() => useLogContext(), {
      wrapper: wrapper(),
    });
    expect(result.current.processedLogLines).toStrictEqual([]);
    expect(result.current.lineCount).toBe(0);
  });

  describe("ingesting logs", () => {
    const lines = [
      "foo",
      "baz",
      "bar",
      "[2023/01/02 10:42:29.414] Command 'shell.exec' in function 'check-codegen' (step 2 of 2) failed: shell script encountered problem: exit code 1.",
      "hello",
      "world",
    ];
    it("should add ingested logs to the list of logs", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(),
      });
      act(() => {
        result.current.ingestLines(lines, LogRenderingTypes.Default);
      });
      expect(result.current.processedLogLines).toStrictEqual([
        0, 1, 2, 3, 4, 5,
      ]);
      expect(result.current.lineCount).toBe(lines.length);
      for (let i = 0; i < lines.length; i++) {
        const line = result.current.processedLogLines[i];
        expect(isSkippedLinesRow(line)).toBe(false);
        expect(isSectionHeaderRow(line)).toBe(false);
        // line is not an object we confirmed it above
        expect(result.current.getLine(line as number)).toStrictEqual(lines[i]);
      }
    });

    it("should save the failing log line number", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(),
      });
      act(() => {
        result.current.ingestLines(
          lines,
          LogRenderingTypes.Default,
          "'shell.exec' in function 'check-codegen' (step 2 of 2)",
        );
      });
      expect(result.current.failingLine).toBe(3);
      act(() => {
        result.current.ingestLines(lines, LogRenderingTypes.Default);
      });
      expect(result.current.failingLine).toBeUndefined();
    });

    it("should set hasLogs to true if logs exist and false otherwise.", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(),
      });
      expect(result.current.hasLogs).toBeNull();
      act(() => {
        result.current.ingestLines(lines, LogRenderingTypes.Default);
      });
      expect(result.current.hasLogs).toBe(true);
      act(() => {
        result.current.ingestLines([], LogRenderingTypes.Default);
      });
      expect(result.current.hasLogs).toBe(false);
    });
  });

  it("saving a filename should save it to the context", () => {
    const { result } = renderHook(() => useLogContext(), {
      wrapper: wrapper(),
    });
    act(() => {
      result.current.setFileName("foo.txt");
    });
    expect(result.current.logMetadata?.fileName).toBe("foo.txt");
  });
  it("should be able to clear the list of logs", () => {
    const { result } = renderHook(() => useLogContext(), {
      wrapper: wrapper(["foo", "bar"]),
    });
    expect(result.current.lineCount).toBe(2);
    act(() => {
      result.current.clearLogs();
    });
    expect(result.current.lineCount).toBe(0);
  });
  describe("resmoke logs", () => {
    it("ingesting a resmoke log should transform it before adding it to the list of logs", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(),
      });
      const lines = [
        `[j0:s0:n1] {"t":{"$date":"2022-09-13T16:57:46.852+00:00"},"s":"D2", "c":"REPL_HB",  "id":4615670, "ctx":"ReplCoord-1","msg":"Sending heartbeat","attr":{"requestId":3705,"target":"localhost:20003","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":3,"hbv":1,"from":"localhost:20004","fromId":1,"term":3,"primaryId":1}}}`,
        `[j0:s0] {"t":{"$date":"2022-09-13T16:57:46.855+00:00"},"s":"I",  "c":"-",        "id":20883,   "ctx":"conn188","msg":"Interrupted operation as its client disconnected","attr":{"opId":6047}}`,
      ];
      act(() => {
        result.current.ingestLines(lines, LogRenderingTypes.Resmoke);
      });
      const resmokeLines = [
        `[j0:s0:n1] | 2022-09-13T16:57:46.852+00:00 D2 REPL_HB  4615670     [ReplCoord-1] "Sending heartbeat","attr":{"requestId":3705,"target":"localhost:20003","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":3,"hbv":1,"from":"localhost:20004","fromId":1,"term":3,"primaryId":1}}`,
        `[j0:s0] | 2022-09-13T16:57:46.855+00:00 I  -        20883       [conn188] "Interrupted operation as its client disconnected","attr":{"opId":6047}`,
      ];
      expect(result.current.processedLogLines).toStrictEqual([0, 1]);
      for (let i = 0; i < lines.length; i++) {
        const line = result.current.processedLogLines[i];
        // Expect the line not to be an object
        expect(isSkippedLinesRow(line)).toBe(false);
        expect(isSectionHeaderRow(line)).toBe(false);
        expect(result.current.getLine(line as number)).toStrictEqual(
          resmokeLines[i],
        );
      }
    });
    it("ingesting a resmoke log should return a color for syntax highlighting", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(),
      });
      const lines = [
        `[j0:s0:n1] {"t":{"$date":"2022-09-13T16:57:46.852+00:00"},"s":"D2", "c":"REPL_HB",  "id":4615670, "ctx":"ReplCoord-1","msg":"Sending heartbeat","attr":{"requestId":3705,"target":"localhost:20003","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":3,"hbv":1,"from":"localhost:20004","fromId":1,"term":3,"primaryId":1}}}`,
        `[j0:s0] {"t":{"$date":"2022-09-13T16:57:46.855+00:00"},"s":"I",  "c":"-",        "id":20883,   "ctx":"conn188","msg":"Interrupted operation as its client disconnected","attr":{"opId":6047}}`,
      ];
      act(() => {
        result.current.ingestLines(lines, LogRenderingTypes.Resmoke);
      });
      expect(result.current.getResmokeLineColor(0)).toBe("#00A35C");
      expect(result.current.getResmokeLineColor(1)).toBeUndefined();
    });
  });
  describe("filters", () => {
    it("applying a filter should filter the list of logs and collapse unmatching ones", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["foo", "bar", "baz"], "?filters=100bar"),
      });
      expect(result.current.lineCount).toBe(3);

      expect(result.current.processedLogLines).toHaveLength(3);
      expect(result.current.processedLogLines).toStrictEqual([
        { range: { end: 1, start: 0 }, rowType: RowType.SkippedLines },
        1,
        { range: { end: 3, start: 2 }, rowType: RowType.SkippedLines },
      ]);
    });
    it("non matching filters should collapse all of the logs", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["foo", "bar", "baz"], "?filters=100wrong"),
      });
      expect(result.current.lineCount).toBe(3);

      expect(result.current.processedLogLines).toHaveLength(1);
      expect(result.current.processedLogLines).toStrictEqual([
        { range: { end: 3, start: 0 }, rowType: RowType.SkippedLines },
      ]);
    });
    describe("applying multiple filters should filter the list of logs and collapse unmatching ones", () => {
      it("should `AND` filters by default", () => {
        const { result } = renderHook(() => useLogContext(), {
          wrapper: wrapper(
            ["A line 1", "B line 2", "C line 3"],
            "?filters=100A,1003",
          ),
        });
        expect(result.current.lineCount).toBe(3);
        expect(result.current.processedLogLines).toHaveLength(1);
        expect(result.current.processedLogLines).toStrictEqual([
          { range: { end: 3, start: 0 }, rowType: RowType.SkippedLines },
        ]);
      });
      it("should `AND` filters if the query param specifies it", () => {
        const { result } = renderHook(() => useLogContext(), {
          wrapper: wrapper(
            ["A line 1", "B line 2", "C line 3"],
            "?filters=100A,1003&filterLogic=and",
          ),
        });
        expect(result.current.lineCount).toBe(3);
        expect(result.current.processedLogLines).toHaveLength(1);
        expect(result.current.processedLogLines).toStrictEqual([
          { range: { end: 3, start: 0 }, rowType: RowType.SkippedLines },
        ]);
      });
      it("should `OR` filters if the query param specifies it", () => {
        const { result } = renderHook(() => useLogContext(), {
          wrapper: wrapper(
            ["A line 1", "B line 2", "C line 3"],
            "?filters=100A,1003&filterLogic=or",
          ),
        });
        expect(result.current.lineCount).toBe(3);
        expect(result.current.processedLogLines).toHaveLength(3);
        expect(result.current.processedLogLines).toStrictEqual([
          0,
          { range: { end: 2, start: 1 }, rowType: RowType.SkippedLines },
          2,
        ]);
      });
    });
  });

  describe("search", () => {
    it("shouldn't return any matching searches if a search hasn't been placed", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      expect(result.current.searchState.searchRange).toBeUndefined();
      expect(result.current.searchState.hasSearch).toBe(false);
    });
    it("should return the correct number of matching searches", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("A line");
      });
      expect(result.current.searchState.searchRange).toBe(1);
      expect(result.current.searchState.hasSearch).toBe(true);
    });
    it("should allow regex searches", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("[a-b] line");
      });
      expect(result.current.searchState.searchRange).toBe(2);
      expect(result.current.searchState.hasSearch).toBe(true);
    });
    it("should allow case insensitive searches", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      expect(result.current.searchState.caseSensitive).toBeFalsy();
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("a line");
      });
      expect(result.current.searchState.searchRange).toBe(1);
      expect(result.current.searchState.hasSearch).toBe(true);
    });
    it("should allow case sensitive searches", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      expect(result.current.searchState.caseSensitive).toBeFalsy();
      expect(result.current.lineCount).toBe(3);
      act(() => {
        result.current.setSearch("a line");
      });
      act(() => {
        result.current.preferences.setCaseSensitive(true);
      });
      expect(result.current.searchState.searchRange).toBeUndefined();
      expect(result.current.searchState.hasSearch).toBe(true);
    });
    it("should only search non filtered out lines", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(
          ["A line 1", "B line 2", "C line 3"],
          "?filters=100A,1003&filterLogic=or",
        ),
      });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("A line");
      });
      expect(result.current.searchState.searchRange).toBe(1);
      act(() => {
        result.current.setSearch("B line");
      });
      expect(result.current.searchState.searchRange).toBeUndefined();
    });
    it("should only search within our bounds", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"], "?upper=1"),
      });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("line");
      });
      expect(result.current.searchState.searchRange).toBe(2);
    });
  });
  describe("pagination", () => {
    it("should reset search index to 0 when a new search is applied", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("line");
      });
      expect(result.current.searchState.hasSearch).toBe(true);
      expect(result.current.searchState.searchRange).toBe(3);
      expect(result.current.searchState.searchIndex).toBe(0);
    });
    it("paginating should increment and decrement the search index", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("line");
      });
      expect(result.current.searchState.searchIndex).toBe(0);
      act(() => {
        result.current.paginate(DIRECTION.NEXT);
      });
      expect(result.current.searchState.searchIndex).toBe(1);
      act(() => {
        result.current.paginate(DIRECTION.PREVIOUS);
      });
      expect(result.current.searchState.searchIndex).toBe(0);
    });
    it("paginating past the searchRange should jump to the opposite end", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("line");
      });
      expect(result.current.searchState.searchIndex).toBe(0);
      act(() => {
        result.current.paginate(DIRECTION.PREVIOUS);
      });
      expect(result.current.searchState.searchIndex).toBe(2);
      act(() => {
        result.current.paginate(DIRECTION.NEXT);
      });
      expect(result.current.searchState.searchIndex).toBe(0);
    });
  });
  describe("preferences", () => {
    it("word wrap should default to false", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      expect(result.current.preferences.wrap).toBe(false);
    });
    it("word wrap format should default to `standard` if it has not been set", () => {
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      expect(result.current.preferences.wordWrapFormat).toBe("standard");
    });
    it("word wrap format should default to the cookie value if its been previously been set", async () => {
      mockedGet.mockImplementation(() => "aggressive");
      const { result } = renderHook(() => useLogContext(), {
        wrapper: wrapper(["A line 1", "B line 2", "C line 3"]),
      });
      await waitFor(() => {
        expect(result.current.preferences.wordWrapFormat).toBe("aggressive");
      });
    });
  });
});
