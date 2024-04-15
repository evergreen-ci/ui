import { createRef } from "react";
import { MockedProvider } from "@apollo/client/testing";
import Cookie from "js-cookie";
import { VirtuosoMockContext } from "react-virtuoso";
import { LogContextProvider } from "context/LogContext";
import * as logContext from "context/LogContext";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { parsleySettingsMock } from "test_data/parsleySettings";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
import LogPane from ".";

const list = Array.from({ length: 100 }, (_, i) => `${i}`);

const RowRenderer = (index: number) => (
  <pre key={index}>Some Line: {index}</pre>
);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[parsleySettingsMock]}>
    <VirtuosoMockContext.Provider
      value={{ itemHeight: 10, viewportHeight: 500 }}
    >
      <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
    </VirtuosoMockContext.Provider>
  </MockedProvider>
);

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

describe("logPane", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("should render the virtualized list with the passed in row type", () => {
    RenderFakeToastContext();
    render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
      wrapper,
    });
    expect(screen.getByText("Some Line: 0")).toBeInTheDocument();
    expect(screen.queryByText("Some Line: 99")).not.toBeInTheDocument();
  });

  it("should execute wrap functionality after log pane loads", async () => {
    jest.useFakeTimers();
    const mockedLogContext = jest.spyOn(logContext, "useLogContext");
    const mockedSetWrap = jest.fn();

    // @ts-ignore-error - Only mocking a subset of useLogContext needed for this test.
    mockedLogContext.mockImplementation(() => ({
      listRef: createRef<null>(),
      preferences: {
        setWrap: mockedSetWrap,
      },
      processedLogLines: Array.from(list.keys()),
    }));

    RenderFakeToastContext();
    render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
      wrapper,
    });
    jest.advanceTimersByTime(100);
    await waitFor(() => {
      expect(mockedSetWrap).toHaveBeenCalledTimes(1);
    });
  });

  describe("should execute scroll functionality after log pane loads", () => {
    it("scrolls to failing line if jumpToFailingLineEnabled is true", async () => {
      jest.useFakeTimers();
      const mockedLogContext = jest.spyOn(logContext, "useLogContext");
      const mockedScrollToLine = jest.fn();

      // @ts-ignore-error - Only mocking a subset of useLogContext needed for this test.
      mockedLogContext.mockImplementation(() => ({
        failingLine: 22,
        listRef: createRef<null>(),
        preferences: {
          setWrap: jest.fn(),
        },
        processedLogLines: Array.from(list.keys()),
        scrollToLine: mockedScrollToLine,
      }));

      RenderFakeToastContext();
      render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
        wrapper,
      });
      jest.advanceTimersByTime(100);
      await waitFor(() => {
        expect(mockedScrollToLine).toHaveBeenCalledTimes(1);
      });
      expect(mockedScrollToLine).toHaveBeenCalledWith(22);
    });

    it("scrolls to share line, which takes precedence over failing line", async () => {
      jest.useFakeTimers();
      const mockedLogContext = jest.spyOn(logContext, "useLogContext");
      const mockedScrollToLine = jest.fn();

      // @ts-ignore-error - Only mocking a subset of useLogContext needed for this test.
      mockedLogContext.mockImplementation(() => ({
        failingLine: 22,
        listRef: createRef<null>(),
        preferences: {
          setWrap: jest.fn(),
        },
        processedLogLines: Array.from(list.keys()),
        scrollToLine: mockedScrollToLine,
      }));

      RenderFakeToastContext();
      render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
        route: "?shareLine=5",
        wrapper,
      });
      jest.advanceTimersByTime(100);
      await waitFor(() => {
        expect(mockedScrollToLine).toHaveBeenCalledTimes(1);
      });
      expect(mockedScrollToLine).toHaveBeenCalledWith(5);
    });
  });
});
