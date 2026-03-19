import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { EXPANDABLE_ROWS } from "constants/storageKeys";
import { logContextWrapper } from "context/LogContext/test_utils";
import ExpandableRowsToggle from ".";

const wrapper = logContextWrapper();

describe("expandable rows toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    InitializeFakeToastContext();
  });

  it("defaults to 'true' if stored value is unset", () => {
    render(<ExpandableRowsToggle />, { wrapper });
    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should read from localStorage properly", () => {
    localStorage.setItem(EXPANDABLE_ROWS, "true");
    render(<ExpandableRowsToggle />, { wrapper });
    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should update the URL correctly", async () => {
    const user = userEvent.setup();
    localStorage.setItem(EXPANDABLE_ROWS, "true");
    const { router } = render(<ExpandableRowsToggle />, { wrapper });

    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");

    await user.click(expandableRowsToggle);
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("?expandable=false");
  });

  it("url params should take precedence over stored value", () => {
    localStorage.setItem(EXPANDABLE_ROWS, "true");
    render(<ExpandableRowsToggle />, {
      route: "?expandable=false",
      wrapper,
    });
    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");
  });
});
