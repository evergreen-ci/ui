import { renderWithRouterMatch, screen, userEvent } from "test_utils";
import { Pagination } from ".";

describe("pagination", () => {
  it("should render item range and total count", () => {
    const { rerender } = renderWithRouterMatch(
      <Pagination currentPage={0} pageSize={10} totalResults={50} />,
    );
    const itemRange = screen.getByTestId("lg-pagination-item-range");
    expect(itemRange).toHaveTextContent("1 - 10 of 50");
    rerender(<Pagination currentPage={1} pageSize={10} totalResults={50} />);
    expect(screen.getByTestId("lg-pagination-item-range")).toHaveTextContent(
      "11 - 20 of 50",
    );
  });

  describe("buttons", () => {
    it("should disable the back button on the first page", () => {
      renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByTestId("lg-pagination-back-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("should disable the next button on the last page", () => {
      renderWithRouterMatch(
        <Pagination currentPage={4} pageSize={10} totalResults={50} />,
      );
      expect(screen.getByTestId("lg-pagination-next-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("should disable buttons if there are no results", () => {
      renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={0} />,
      );
      expect(screen.getByTestId("lg-pagination-back-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      expect(screen.getByTestId("lg-pagination-next-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("should disable buttons if there is only one page", () => {
      renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={10} />,
      );
      expect(screen.getByTestId("lg-pagination-back-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      expect(screen.getByTestId("lg-pagination-next-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });
  });

  describe("url updates", () => {
    it("paginating forward should update the url with the new page number by default", async () => {
      const user = userEvent.setup();
      const { router } = renderWithRouterMatch(
        <Pagination currentPage={0} pageSize={10} totalResults={50} />,
      );
      expect(router.state.location.search).toBe("");
      await user.click(screen.getByTestId("lg-pagination-next-button"));
      expect(router.state.location.search).toBe("?page=1");
    });

    it("paginating backward should update the url with the new page number by default", async () => {
      const user = userEvent.setup();
      const { router } = renderWithRouterMatch(
        <Pagination currentPage={1} pageSize={10} totalResults={50} />,
      );
      expect(router.state.location.search).toBe("");
      await user.click(screen.getByTestId("lg-pagination-back-button"));
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
      await user.click(screen.getByTestId("lg-pagination-next-button"));
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
      await user.click(screen.getByTestId("leafygreen-ui-select-menubutton"));
      await user.click(screen.getByText("20"));
      expect(onPageSizeChange).toHaveBeenCalledWith(20);
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
      expect(screen.getByTestId("lg-pagination-item-range")).toHaveTextContent(
        "1 - 10 of many",
      );
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
