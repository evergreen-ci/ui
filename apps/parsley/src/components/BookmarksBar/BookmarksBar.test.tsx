import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import BookmarksBar from ".";

describe("bookmarks bar", () => {
  it("should not add bookmarks if there are no log lines", async () => {
    const { router } = renderWithRouterMatch(
      <BookmarksBar
        lineCount={0}
        processedLogLines={[]}
        scrollToLine={vi.fn()}
      />,
    );
    await waitFor(() => {
      expect(router.state.location.search).toBe("");
    });
  });

  it("should add a single bookmark of 0 if there is only a single log line", async () => {
    const { router } = renderWithRouterMatch(
      <BookmarksBar
        lineCount={1}
        processedLogLines={[1]}
        scrollToLine={vi.fn()}
      />,
    );
    await waitFor(() => {
      expect(router.state.location.search).toBe("?bookmarks=0");
    });
  });

  it("should set 0 and last log line as the initial bookmarks", async () => {
    const { router } = renderWithRouterMatch(
      <BookmarksBar
        lineCount={11}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        scrollToLine={vi.fn()}
      />,
    );
    await waitFor(() => {
      expect(router.state.location.search).toBe("?bookmarks=0,10");
    });
  });

  it("should properly display sorted bookmarks, shareLine, and failingLine", () => {
    renderWithRouterMatch(
      <BookmarksBar
        failingLine={3}
        lineCount={11}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        scrollToLine={vi.fn()}
      />,
      {
        route: "?bookmarks=1&shareLine=5",
      },
    );
    const { children } = screen.getByDataCy("bookmark-list");
    expect(children).toHaveLength(3);
    expect((children.item(0) as Element).textContent).toContain("1");
    expect((children.item(1) as Element).textContent).toContain("3");
    expect((children.item(2) as Element).textContent).toContain("5");
    expect((children.item(2) as Element).children.item(1)).toStrictEqual(
      screen.getByLabelText("Link Icon"),
    );
  });

  it("should be able to clear all bookmarks without removing share line", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(
      <BookmarksBar
        lineCount={11}
        processedLogLines={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        scrollToLine={vi.fn()}
      />,
      {
        route: "?bookmarks=1,3&shareLine=5",
      },
    );
    await user.click(screen.getByDataCy("clear-bookmarks"));
    expect(
      screen.queryByText("Are you sure you want to clear all bookmarks?"),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(router.state.location.search).toBe("?shareLine=5");
  });

  it("should call scrollToLine when clicking on a log line (with no collapsed lines)", async () => {
    const user = userEvent.setup();
    const scrollToLine = vi.fn();
    renderWithRouterMatch(
      <BookmarksBar
        lineCount={5}
        processedLogLines={[0, 1, 2, 3, 4]}
        scrollToLine={scrollToLine}
      />,
      {
        route: "?bookmarks=1,3",
      },
    );
    await user.click(screen.getByDataCy("bookmark-3"));
    expect(scrollToLine).toHaveBeenCalledTimes(1);
    expect(scrollToLine).toHaveBeenCalledWith(3);
  });

  it("should call scrollToLine when clicking on a log line (with collapsed lines)", async () => {
    const user = userEvent.setup();
    const scrollToLine = vi.fn();
    renderWithRouterMatch(
      <BookmarksBar
        lineCount={5}
        processedLogLines={[
          { range: { end: 3, start: 0 }, rowType: "SkippedLines" },
          3,
          4,
        ]}
        scrollToLine={scrollToLine}
      />,
      {
        route: "?bookmarks=1,3",
      },
    );
    await user.click(screen.getByDataCy("bookmark-3"));
    expect(scrollToLine).toHaveBeenCalledTimes(1);
    expect(scrollToLine).toHaveBeenCalledWith(1);
  });
});
