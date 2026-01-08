import { createRef } from "react";
import { MockedProvider } from "@apollo/client/testing";
import Cookie from "js-cookie";
import { VirtuosoMockContext } from "react-virtuoso";
import { MockInstance } from "vitest";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { LogContextProvider } from "context/LogContext";
import * as logContext from "context/LogContext";
import { parsleySettingsMock } from "test_data/parsleySettings";
import { RowType } from "types/logs";
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
    (vi.spyOn(Cookie, "get") as MockInstance).mockReturnValue("false");

    vi.useFakeTimers();
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    const mockedSetWrap = vi.fn();
    const mockedSetPrettyPrint = vi.fn();

    mockedLogContext.mockImplementation(() => ({
      listRef: createRef(),
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      preferences: {
        setPrettyPrint: mockedSetPrettyPrint,
        setWrap: mockedSetWrap,
        stickyHeaders: false,
        zebraStriping: false,
      },
      processedLogLines: Array.from(list.keys()),
      // @ts-expect-error - Only mocking a subset of sectioning needed for this test.
      sectioning: {
        sectioningEnabled: false,
      },
    }));

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
    (vi.spyOn(Cookie, "get") as MockInstance).mockReturnValue("true");

    vi.useFakeTimers();
    const mockedLogContext = vi.spyOn(logContext, "useLogContext");
    const mockedSetWrap = vi.fn();
    const mockedSetPrettyPrint = vi.fn();

    mockedLogContext.mockImplementation(() => ({
      listRef: createRef(),
      // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
      preferences: {
        setPrettyPrint: mockedSetPrettyPrint,
        setWrap: mockedSetWrap,
        stickyHeaders: false,
        zebraStriping: false,
      },
      processedLogLines: Array.from(list.keys()),
      // @ts-expect-error - Only mocking a subset of sectioning needed for this test.
      sectioning: {
        sectioningEnabled: false,
      },
    }));

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
      mockedLogContext.mockImplementation(() => ({
        failingLine: 22,
        listRef: createRef(),
        // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
        preferences: {
          setPrettyPrint: vi.fn(),
          setWrap: vi.fn(),
          stickyHeaders: false,
          zebraStriping: false,
        },
        processedLogLines: Array.from(list.keys()),
        scrollToLine: mockedScrollToLine,
        // @ts-expect-error - Only mocking a subset of sectioning needed for this test.
        sectioning: {
          sectioningEnabled: false,
        },
      }));

      RenderFakeToastContext();
      render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
        wrapper,
      });
      vi.advanceTimersByTime(100);
      await waitFor(() => {
        expect(mockedScrollToLine).toHaveBeenCalledTimes(1);
      });
      expect(mockedScrollToLine).toHaveBeenCalledWith(22);
    });

    it("scrolls to share line, which takes precedence over failing line", async () => {
      vi.useFakeTimers();
      const mockedLogContext = vi.spyOn(logContext, "useLogContext");
      const mockedScrollToLine = vi.fn();
      mockedLogContext.mockImplementation(() => ({
        failingLine: 22,
        listRef: createRef(),
        // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
        preferences: {
          setPrettyPrint: vi.fn(),
          setWrap: vi.fn(),
          stickyHeaders: false,
          zebraStriping: false,
        },
        processedLogLines: Array.from(list.keys()),
        scrollToLine: mockedScrollToLine,
        // @ts-expect-error - Only mocking a subset of sectioning needed for this test.
        sectioning: {
          sectioningEnabled: false,
        },
      }));

      RenderFakeToastContext();
      render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
        route: "?shareLine=5",
        wrapper,
      });
      vi.advanceTimersByTime(100);
      await waitFor(() => {
        expect(mockedScrollToLine).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockedScrollToLine).toHaveBeenCalledWith(5);
      });
    });
  });

  describe("sticky headers", () => {
    it("should render sticky headers when stickyHeaders is enabled and sectioning is enabled", () => {
      const mockedLogContext = vi.spyOn(logContext, "useLogContext");
      mockedLogContext.mockImplementation(() => ({
        listRef: createRef(),
        // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
        preferences: {
          setPrettyPrint: vi.fn(),
          setWrap: vi.fn(),
          stickyHeaders: true,
          zebraStriping: false,
        },
        processedLogLines: [
          {
            functionID: "function-1",
            functionName: "setup",
            isOpen: true,
            range: { end: 10, start: 0 },
            rowType: RowType.SectionHeader,
          },
          1,
          2,
          3,
        ],
        // @ts-expect-error - Only mocking a subset of sectioning needed for this test.
        sectioning: {
          sectioningEnabled: true,
        },
      }));

      RenderFakeToastContext();
      render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
        wrapper,
      });
      expect(screen.getByDataCy("sticky-headers")).toBeInTheDocument();
    });

    it("should not render sticky headers when stickyHeaders is disabled", () => {
      const mockedLogContext = vi.spyOn(logContext, "useLogContext");
      mockedLogContext.mockImplementation(() => ({
        listRef: createRef(),
        // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
        preferences: {
          setPrettyPrint: vi.fn(),
          setWrap: vi.fn(),
          stickyHeaders: false,
          zebraStriping: false,
        },
        processedLogLines: Array.from(list.keys()),
        // @ts-expect-error - Only mocking a subset of sectioning needed for this test.
        sectioning: {
          sectioningEnabled: true,
        },
      }));

      RenderFakeToastContext();
      render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
        wrapper,
      });
      expect(screen.queryByDataCy("sticky-headers")).not.toBeInTheDocument();
    });

    it("should not render sticky headers when sectioning is disabled", () => {
      const mockedLogContext = vi.spyOn(logContext, "useLogContext");
      mockedLogContext.mockImplementation(() => ({
        listRef: createRef(),
        // @ts-expect-error - Only mocking a subset of useLogContext needed for this test.
        preferences: {
          setPrettyPrint: vi.fn(),
          setWrap: vi.fn(),
          stickyHeaders: true,
          zebraStriping: false,
        },
        processedLogLines: Array.from(list.keys()),
        // @ts-expect-error - Only mocking a subset of sectioning needed for this test.
        sectioning: {
          sectioningEnabled: false,
        },
      }));

      RenderFakeToastContext();
      render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
        wrapper,
      });
      expect(screen.queryByDataCy("sticky-headers")).not.toBeInTheDocument();
    });
  });
});
