import { userEvent } from "@storybook/testing-library";
import {
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import ShowFiltersToggle from ".";

describe("highlight filter toggle", () => {
  it("defaults to 'true'", () => {
    render(<ShowFiltersToggle />);
    const showFilters = screen.getByDataCy("show-filters-toggle");
    expect(showFilters).toHaveAttribute("aria-checked", "true");
  });

  it("should update filters in URL appropriately", async () => {
    const user = userEvent.setup();
    const { router } = render(<ShowFiltersToggle />, {
      route: "?filters=100abc,100def,100ghi",
    });
    const showFilters = screen.getByDataCy("show-filters-toggle");

    await user.click(showFilters);
    expect(showFilters).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("?filters=000abc,000def,000ghi");

    await user.click(showFilters);
    expect(showFilters).toHaveAttribute("aria-checked", "true");
    expect(router.state.location.search).toBe("?filters=100abc,100def,100ghi");
  });
});
