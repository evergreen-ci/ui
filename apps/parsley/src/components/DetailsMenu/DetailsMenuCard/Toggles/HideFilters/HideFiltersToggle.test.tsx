import { userEvent } from "@storybook/testing-library";
import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import HideFiltersToggle from ".";

const wrapper = logContextWrapper();

describe("highlight filter toggle", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
  });

  it("defaults to 'false'", () => {
    render(<HideFiltersToggle />, { wrapper });
    const hideFilters = screen.getByDataCy("hide-filters-toggle");
    expect(hideFilters).toHaveAttribute("aria-checked", "false");
  });

  it("should update filters in URL appropriately", async () => {
    const user = userEvent.setup();
    const { router } = render(<HideFiltersToggle />, {
      route: "?filters=100abc,100def,100ghi",
      wrapper,
    });
    const hideFilters = screen.getByDataCy("hide-filters-toggle");

    await user.click(hideFilters);
    expect(hideFilters).toHaveAttribute("aria-checked", "true");
    expect(router.state.location.search).toBe("?filters=000abc,000def,000ghi");

    await user.click(hideFilters);
    expect(hideFilters).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("?filters=100abc,100def,100ghi");
  });
});
