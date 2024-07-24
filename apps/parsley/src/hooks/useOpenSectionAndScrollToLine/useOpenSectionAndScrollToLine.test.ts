import { act, renderHook, waitFor } from "test_utils";
import { ProcessedLogLines, RowType } from "types/logs";
import { useOpenSectionAndScrollToLine } from ".";

describe("useOpenSectionAndScrollToLine", () => {
  it("Should scroll to the line number in 1 render if section state is not updated.", async () => {
    const openSectionContainingLineNumberMock = vi.fn().mockReturnValue(false);
    const scrollMock = vi.fn();
    const { result } = renderHook(() =>
      useOpenSectionAndScrollToLine(
        processedLogLines,
        openSectionContainingLineNumberMock,
        scrollMock,
      ),
    );
    act(() => {
      result.current(4);
    });
    await waitFor(() => {
      expect(openSectionContainingLineNumberMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(scrollMock).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(scrollMock).toHaveBeenCalledWith(5);
    });
  });

  it("Should scroll to the line number in 2 renders if section state is updated. The second update occurs after processedLogLines is updated due to section state changing.", async () => {
    const openSectionContainingLineNumberMock = vi.fn().mockReturnValue(true);
    const scrollMock = vi.fn();
    const { rerender, result } = renderHook(
      (props) =>
        useOpenSectionAndScrollToLine(
          props.processedLogLines,
          openSectionContainingLineNumberMock,
          scrollMock,
        ),
      {
        initialProps: {
          processedLogLines,
        },
      },
    );
    act(() => {
      result.current(4);
    });
    await waitFor(() => {
      expect(openSectionContainingLineNumberMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(scrollMock).toHaveBeenCalledTimes(0);
    });
    await waitFor(() => {
      expect(scrollMock).toHaveBeenCalledTimes(0);
    });
    rerender({ processedLogLines: [...processedLogLines] });
    await waitFor(() => {
      expect(scrollMock).toHaveBeenCalledOnce();
    });
    await waitFor(() => {
      expect(scrollMock).toHaveBeenCalledWith(5);
    });
  });

  const processedLogLines: ProcessedLogLines = [
    1,
    2,
    3,
    {
      functionID: "function-4",
      functionName: "test",
      isOpen: true,
      range: { end: 6, start: 4 },
      rowType: RowType.SectionHeader,
    },
    {
      commandID: "command-4",
      commandName: "shell.exec",
      functionID: "function-4",
      isOpen: true,
      range: { end: 6, start: 4 },
      rowType: RowType.SubsectionHeader,
      step: "1 of 4",
    },
    4,
    5,
    6,
  ];
});
