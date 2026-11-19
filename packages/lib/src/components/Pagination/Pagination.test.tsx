import { renderWithRouterMatch, screen, userEvent } from "test_utils";
import { Pagination } from ".";

describe("pagination", () => {
  it("should render item range and total count", () => {
    const { rerender } = renderWithRouterMatch(
      <Pagination currentPage={0} pageSize={10} totalResults={50} />,
    );
    expect(screen.getByText("1–10 of 50 items")).toBeInTheDocument();
    rerender(<Pagination currentPage={1} pageSize={10} totalResults={50} />);
    expect(screen.getByText("11–20 of 50 items")).toBeInTheDocument();
  });

  describe("buttons", () => {
    it("should disable the back button on the first page", () => {
      renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(
        screen.getByRole("button", { name: "Previous page" }),
      ).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    });

    it("should disable the next button on the last page", () => {
      renderWithRouterMatch(
        <Pagination currentPage={4} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
      expect(
        screen.getByRole("button", { name: "Previous page" }),
      ).toBeEnabled();
    });

    it("should disable buttons if there are no results", () => {
      renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={0} />,
      );
      expect(
        screen.getByRole("button", { name: "Previous page" }),
      ).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    });

    it("should disable buttons if there is only one page", () => {
      renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={10} />,
      );
      expect(
        screen.getByRole("button", { name: "Previous page" }),
      ).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    });
  });

  describe("url updates", () => {
    it("paginating forward should update the url with the new page number by default", async () => {
      const user = userEvent.setup();
      const { router } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(router.state.location.search).toBe("");
      await user.click(screen.getByRole("button", { name: "Next page" }));
      expect(router.state.location.search).toBe("?page=1");
    });

    it("paginating backward should update the url with the new page number by default", async () => {
      const user = userEvent.setup();
      const { router } = renderWithRouterMatch(
        <Pagination currentPage={1} pageSize={10} totalResults={50} />,
      );
      expect(router.state.location.search).toBe("");
      await user.click(screen.getByRole("button", { name: "Previous page" }));
      expect(router.state.location.search).toBe("?page=0");
    });

    it("changing the page size away from the first page should keep the new limit and reset the page", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      const { router } = renderWithRouterMatch(
        <Pagination
          currentPage={2}
          onPageChange={onPageChange}
          pageSize={10}
          totalResults={50}
        />,
      );
      await user.click(screen.getByRole("button", { name: /Items per page/ }));
      await user.click(screen.getByRole("option", { name: "20" }));
      expect(router.state.location.search).toBe("?limit=20&page=0");
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe("callbacks", () => {
    it("should call the onPageChange callback when the page changes", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      renderWithRouterMatch(
        <Pagination
          currentPage={0}
          onPageChange={onPageChange}
          pageSize={10}
          totalResults={50}
        />,
      );
      await user.click(screen.getByRole("button", { name: "Next page" }));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it("should call the onPageSizeChange callback when the page size changes", async () => {
      const user = userEvent.setup();
      const onPageSizeChange = vi.fn();
      renderWithRouterMatch(
        <Pagination
          currentPage={0}
          onPageSizeChange={onPageSizeChange}
          pageSize={10}
          totalResults={50}
        />,
      );
      await user.click(screen.getByRole("button", { name: /Items per page/ }));
      await user.click(screen.getByRole("option", { name: "20" }));
      expect(onPageSizeChange).toHaveBeenCalledWith(20);
    });
  });

  describe("prevTotalResults", () => {
    it("should persist the page count while loading", () => {
      const { rerender } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByText("1–10 of 50 items")).toBeInTheDocument();
      rerender(
        <Pagination currentPage={0} loading pageSize={10} totalResults={0} />,
      );
      expect(screen.getByText("1–10 of 50 items")).toBeInTheDocument();
    });

    it("should update the page count to 0 when not loading", () => {
      const { rerender } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByText("1–10 of 50 items")).toBeInTheDocument();
      rerender(
        <Pagination
          currentPage={0}
          loading={false}
          pageSize={10}
          totalResults={0}
        />,
      );
      expect(screen.getByText("0 of 0 items")).toBeInTheDocument();
    });

    it("should update the page count when totalResults changes to a new value", () => {
      const { rerender } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByText("1–10 of 50 items")).toBeInTheDocument();
      rerender(<Pagination currentPage={0} pageSize={10} totalResults={30} />);
      expect(screen.getByText("1–10 of 30 items")).toBeInTheDocument();
    });

    it("should update the page count after loading completes", () => {
      const { rerender } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByText("1–10 of 50 items")).toBeInTheDocument();
      rerender(
        <Pagination currentPage={0} loading pageSize={10} totalResults={0} />,
      );
      expect(screen.getByText("1–10 of 50 items")).toBeInTheDocument();
      rerender(<Pagination currentPage={0} pageSize={10} totalResults={20} />);
      expect(screen.getByText("1–10 of 20 items")).toBeInTheDocument();
    });
  });

  describe("countLimit", () => {
    it("should display 'many' when totalResults >= countLimit", () => {
      renderWithRouterMatch(
        <Pagination
          countLimit={100}
          currentPage={0}
          pageSize={10}
          totalResults={100}
        />,
      );
      expect(screen.getByText("1 of many")).toBeInTheDocument();
      expect(screen.queryByText(/100 items/)).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    });

    it("should display the normal item count when totalResults < countLimit", () => {
      renderWithRouterMatch(
        <Pagination
          countLimit={100}
          currentPage={0}
          pageSize={10}
          totalResults={50}
        />,
      );
      expect(screen.getByText("1–10 of 50 items")).toBeInTheDocument();
    });
  });
});
