import { renderWithRouterMatch, screen, userEvent } from "test_utils";
import { Pagination } from ".";

describe("pagination", () => {
  it("should render item range and total count", () => {
    const { rerender } = renderWithRouterMatch(
      <Pagination currentPage={0} pageSize={10} totalResults={50} />,
    );
    expect(screen.getByText(/1 - 10 of 50/)).toBeInTheDocument();
    rerender(<Pagination currentPage={1} pageSize={10} totalResults={50} />);
    expect(screen.getByText(/11 - 20 of 50/)).toBeInTheDocument();
  });

  describe("buttons", () => {
    it("should disable the back button on the first page", () => {
      renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      const prevButton = screen.getByRole("button", { name: "Previous page" });
      expect(prevButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should disable the next button on the last page", () => {
      renderWithRouterMatch(
        <Pagination currentPage={4} pageSize={10} totalResults={50} />,
      );
      const nextButton = screen.getByRole("button", { name: "Next page" });
      expect(nextButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should disable buttons if there are no results", () => {
      renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={0} />,
      );
      const prevButton = screen.getByRole("button", { name: "Previous page" });
      expect(prevButton).toHaveAttribute("aria-disabled", "true");
      const nextButton = screen.getByRole("button", { name: "Next page" });
      expect(nextButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should disable buttons if there is only one page", () => {
      renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={10} />,
      );
      const prevButton = screen.getByRole("button", { name: "Previous page" });
      expect(prevButton).toHaveAttribute("aria-disabled", "true");
      const nextButton = screen.getByRole("button", { name: "Next page" });
      expect(nextButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("url updates", () => {
    it("paginating forward should update the url with the new page number by default", async () => {
      const user = userEvent.setup();
      const { router } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(router.state.location.search).toBe("");
      const nextButton = screen.getByRole("button", { name: "Next page" });
      await user.click(nextButton);
      expect(router.state.location.search).toBe("?page=1");
    });

    it("paginating backward should update the url with the new page number by default", async () => {
      const user = userEvent.setup();
      const { router } = renderWithRouterMatch(
        <Pagination currentPage={1} pageSize={10} totalResults={50} />,
      );
      expect(router.state.location.search).toBe("");
      const prevButton = screen.getByRole("button", { name: "Previous page" });
      await user.click(prevButton);
      expect(router.state.location.search).toBe("?page=0");
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
      const nextButton = screen.getByRole("button", { name: "Next page" });
      await user.click(nextButton);
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
      const pageSizeSelect = screen.getByRole("button", {
        name: /Items per page/,
      });
      await user.click(pageSizeSelect);
      const option = screen.getByText(/20/);
      await user.click(option);
      expect(onPageSizeChange).toHaveBeenCalledWith(20);
    });
  });

  describe("prevTotalResults", () => {
    it("should persist the page count while loading", () => {
      const { rerender } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByText(/1 - 10 of 50/)).toBeInTheDocument();
      rerender(
        <Pagination currentPage={0} loading pageSize={10} totalResults={0} />,
      );
      expect(screen.getByText(/1 - 10 of 50/)).toBeInTheDocument();
    });

    it("should update the page count to 0 when not loading", () => {
      const { rerender } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByText(/1 - 10 of 50/)).toBeInTheDocument();
      rerender(
        <Pagination
          currentPage={0}
          loading={false}
          pageSize={10}
          totalResults={0}
        />,
      );
      expect(screen.getByText(/0 - 0 of 0 items/)).toBeInTheDocument();
    });

    it("should update the page count when totalResults changes to a new value", () => {
      const { rerender } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByText(/1 - 10 of 50/)).toBeInTheDocument();
      rerender(<Pagination currentPage={0} pageSize={10} totalResults={30} />);
      expect(screen.getByText(/1 - 10 of 30/)).toBeInTheDocument();
    });

    it("should update the page count after loading completes", () => {
      const { rerender } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByText(/1 - 10 of 50/)).toBeInTheDocument();

      // Start loading — count should be preserved.
      rerender(
        <Pagination currentPage={0} loading pageSize={10} totalResults={0} />,
      );
      expect(screen.getByText(/1 - 10 of 50/)).toBeInTheDocument();

      // Loading completes with new results.
      rerender(<Pagination currentPage={0} pageSize={10} totalResults={20} />);
      expect(screen.getByText(/1 - 10 of 20/)).toBeInTheDocument();
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
      expect(screen.getByText(/1 - 10 of many/)).toBeInTheDocument();
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
      expect(screen.getByText(/50/)).toBeInTheDocument();
    });
  });
});
