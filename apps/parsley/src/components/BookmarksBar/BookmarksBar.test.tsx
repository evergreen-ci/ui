import {
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import BookmarksBar from ".";

describe("bookmarks bar", () => {
  it("should not add bookmarks if there are no log lines", async () => {
    const { router } = renderWithRouterMatch(
      <BookmarksBar lineCount={0} scrollToLine={vi.fn()} />,
    );
    await waitFor(() => {
      expect(router.state.location.search).toBe("");
    });
  });

  it("should add a single bookmark of 0 if there is only a single log line", async () => {
    const { router } = renderWithRouterMatch(
      <BookmarksBar lineCount={1} scrollToLine={vi.fn()} />,
    );
    await waitFor(() => {
      expect(router.state.location.search).toBe("?bookmarks=0");
    });
  });

  it("should set 0 and last log line as the initial bookmarks", async () => {
    const { router } = renderWithRouterMatch(
      <BookmarksBar lineCount={11} scrollToLine={vi.fn()} />,
    );
    await waitFor(() => {
      expect(router.state.location.search).toBe("?bookmarks=0,10");
    });
  });

  it("should properly display sorted bookmarks, shareLine, and failingLine", () => {
    renderWithRouterMatch(
      <BookmarksBar failingLine={3} lineCount={11} scrollToLine={vi.fn()} />,
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
      screen.getByDataCy("link-icon"),
    );
  });

  it("should be able to clear all bookmarks without removing share line", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(
      <BookmarksBar lineCount={11} scrollToLine={vi.fn()} />,
      {
        route: "?bookmarks=1,3&shareLine=5",
      },
    );
    await user.click(screen.getByDataCy("clear-bookmarks"));
    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to clear all bookmarks?"),
      ).toBeVisible();
    });
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(router.state.location.search).toBe("?shareLine=5");
  });

  it("should call scrollToLine when clicking on a log line", async () => {
    const user = userEvent.setup();
    const scrollToLine = vi.fn();
    renderWithRouterMatch(
      <BookmarksBar lineCount={5} scrollToLine={scrollToLine} />,
      {
        route: "?bookmarks=1,3",
      },
    );
    await user.click(screen.getByDataCy("bookmark-3"));
    expect(scrollToLine).toHaveBeenCalledTimes(1);
    expect(scrollToLine).toHaveBeenCalledWith(3);
  });
});
