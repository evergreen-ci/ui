import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import AllFiltersToggle from ".";

describe("all filters toggle", () => {
  it("defaults to 'true'", () => {
    render(<AllFiltersToggle />);
    const allFiltersToggle = screen.getByDataTestId("all-filters-toggle");
    expect(allFiltersToggle).toHaveAttribute("aria-checked", "true");
  });

  it("reflects filter visibility from the URL", () => {
    render(<AllFiltersToggle />, {
      route: "?filters=000abc,000def",
    });
    expect(screen.getByDataTestId("all-filters-toggle")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("should update filters in URL appropriately", async () => {
    const user = userEvent.setup();
    const { router } = render(<AllFiltersToggle />, {
      route: "?filters=100abc,100def,100ghi",
    });
    const allFiltersToggle = screen.getByDataTestId("all-filters-toggle");

    await user.click(allFiltersToggle);
    expect(allFiltersToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("?filters=000abc,000def,000ghi");

    await user.click(allFiltersToggle);
    expect(allFiltersToggle).toHaveAttribute("aria-checked", "true");
    expect(router.state.location.search).toBe("?filters=100abc,100def,100ghi");
  });
});
