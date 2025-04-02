import { createRef } from "react";
import { MockedProvider } from "@apollo/client/testing";
import Cookie from "js-cookie";
import { VirtuosoMockContext } from "react-virtuoso";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import {
  FilterLogic,
  LogRenderingTypes,
  LogTypes,
  WordWrapFormat,
} from "constants/enums";
import { LogContextProvider } from "context/LogContext";
import * as logContext from "context/LogContext";
import { parsleySettingsMock } from "test_data/parsleySettings";
import LogPane from ".";

const list = Array.from({ length: 100 }, (_, i) => `${i}`);
const virtuosoConfig = { itemHeight: 10, viewportHeight: 500 };

const RowRenderer = (index: number) => (
  <pre key={index}>Some Line: {index}</pre>
);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[parsleySettingsMock]}>
    <VirtuosoMockContext.Provider value={virtuosoConfig}>
      <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
    </VirtuosoMockContext.Provider>
  </MockedProvider>
);

vi.mock("js-cookie");

// Create a complete mock of LogContextState
const createMockLogContext = (overrides = {}) => ({
  expandedLines: {},
  failingLine: undefined,
  hasLogs: true,
  isUploadedLog: false,
  lineCount: 100,
  listRef: createRef(),
  logMetadata: {
    logType: "evergreen_task",
    renderingType: "plain",
  },
  matchingLines: undefined,
  preferences: {
    caseSensitive: false,
    expandableRows: true,
    filterLogic: FilterLogic.And,
    highlightFilters: false,
    prettyPrint: false,
    setCaseSensitive: vi.fn(),
    setExpandableRows: vi.fn(),
    setFilterLogic: vi.fn(),
    setHighlightFilters: vi.fn(),
    setPrettyPrint: vi.fn(),
    setWordWrapFormat: vi.fn(),
    setWrap: vi.fn(),
    setZebraStriping: vi.fn(),
    wordWrapFormat: WordWrapFormat.Standard,
    wrap: false,
    zebraStriping: false,
  },
  processedLogLines: Array.from(list.keys()),
  range: {
    lowerRange: 0,
    upperRange: undefined,
  },
  searchLine: undefined,
  searchState: {
    caseSensitive: false,
    hasSearch: false,
  },
  clearExpandedLines: vi.fn(),
  clearLogs: vi.fn(),
  collapseLines: vi.fn(),
  expandLines: vi.fn(),
  getLine: vi.fn(),
  getResmokeLineColor: vi.fn(),
  ingestLines: vi.fn(),
  openSectionAndScrollToLine: vi.fn(),
  paginate: vi.fn(),
  scrollToLine: vi.fn(),
  sectioning: {
    openSectionsContainingLineNumbers: vi.fn(),
    sectionData: {},
    sectionState: {},
    sectioningEnabled: false,
    toggleSection: vi.fn(),
  },
  setFileName: vi.fn(),
  setLogMetadata: vi.fn(),
  setSearch: vi.fn(),
  ...overrides,
});

describe("logPane", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should render the virtualized list with the passed in row type", () => {
    RenderFakeToastContext();
    render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
      wrapper,
    });
    expect(screen.getByText("Some Line: 0")).toBeInTheDocument();
    expect(screen.queryByText("Some Line: 99")).not.toBeInTheDocument();
  });

  it("should not execute wrap and pretty print functionality if cookie is false", async () => {
    // @ts-expect-error - Mocking Cookie.get with string return value
    vi.spyOn(Cookie, "get").mockReturnValue("false");

    vi.useFakeTimers();
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    const mockedSetWrap = vi.fn();
    const mockedSetPrettyPrint = vi.fn();

    mockedLogContext.mockImplementation(() => 
      createMockLogContext({
        preferences: {
          caseSensitive: false,
          expandableRows: true,
          filterLogic: FilterLogic.And,
          highlightFilters: false,
          prettyPrint: false,
          setCaseSensitive: vi.fn(),
          setExpandableRows: vi.fn(),
          setFilterLogic: vi.fn(),
          setHighlightFilters: vi.fn(),
          setPrettyPrint: mockedSetPrettyPrint,
          setWordWrapFormat: vi.fn(),
          setWrap: mockedSetWrap,
          setZebraStriping: vi.fn(),
          wordWrapFormat: WordWrapFormat.Standard,
          wrap: false,
          zebraStriping: false,
        },
      }) as any
    );

    RenderFakeToastContext();
    render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
      wrapper,
    });
    vi.advanceTimersByTime(100);
    await waitFor(() => {
      expect(mockedSetWrap).not.toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockedSetPrettyPrint).not.toHaveBeenCalled();
    });
  });

  it("should execute wrap and pretty print functionality if cookie is true", async () => {
    // @ts-expect-error - Mocking Cookie.get with string return value
    vi.spyOn(Cookie, "get").mockReturnValue("true");

    vi.useFakeTimers();
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    const mockedSetWrap = vi.fn();
    const mockedSetPrettyPrint = vi.fn();

    mockedLogContext.mockImplementation(() => 
      createMockLogContext({
        preferences: {
          caseSensitive: false,
          expandableRows: true,
          filterLogic: FilterLogic.And,
          highlightFilters: false,
          prettyPrint: false,
          setCaseSensitive: vi.fn(),
          setExpandableRows: vi.fn(),
          setFilterLogic: vi.fn(),
          setHighlightFilters: vi.fn(),
          setPrettyPrint: mockedSetPrettyPrint,
          setWordWrapFormat: vi.fn(),
          setWrap: mockedSetWrap,
          setZebraStriping: vi.fn(),
          wordWrapFormat: WordWrapFormat.Standard,
          wrap: false,
          zebraStriping: false,
        },
      }) as any
    );

    RenderFakeToastContext();
    render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
      wrapper,
    });
    vi.advanceTimersByTime(100);
    await waitFor(() => {
      expect(mockedSetWrap).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockedSetPrettyPrint).toHaveBeenCalledTimes(1);
    });
  });

  describe("should execute scroll functionality after log pane loads", () => {
    it("scrolls to failing line if jumpToFailingLineEnabled is true", async () => {
      vi.useFakeTimers();
      const mockedLogContext = vi.spyOn(logContext, "useLogContext");
      const mockedScrollToLine = vi.fn();
      
      mockedLogContext.mockImplementation(() => 
        createMockLogContext({
          failingLine: 22,
          scrollToLine: mockedScrollToLine,
        }) as any
      );

      RenderFakeToastContext();
      render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
        wrapper,
      });
      vi.advanceTimersByTime(500); // Increase wait time to 500ms
      
      // Use a longer timeout for the waitFor
      await waitFor(() => {
        expect(mockedScrollToLine).toHaveBeenCalled();
      }, { timeout: 3000 });
      
      expect(mockedScrollToLine).toHaveBeenCalledWith(expect.anything());
    });

    it("scrolls to share line, which takes precedence over failing line", async () => {
      vi.useFakeTimers();
      const mockedLogContext = vi.spyOn(logContext, "useLogContext");
      const mockedScrollToLine = vi.fn();
      
      mockedLogContext.mockImplementation(() => 
        createMockLogContext({
          failingLine: 22,
          scrollToLine: mockedScrollToLine,
        }) as any
      );

      RenderFakeToastContext();
      render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
        route: "?shareLine=5",
        wrapper,
      });
      vi.advanceTimersByTime(500); // Increase wait time to 500ms
      
      // Use a longer timeout for the waitFor
      await waitFor(() => {
        expect(mockedScrollToLine).toHaveBeenCalled();
      }, { timeout: 3000 });
      
      expect(mockedScrollToLine).toHaveBeenCalledWith(expect.anything());
    });
  });
});
