import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import FilterLogicToggle from ".";

const wrapper = logContextWrapper();

describe("filter logic toggle", () => {
  beforeAll(() => {
    InitializeFakeToastContext();
  });
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to 'and' if stored value is unset", () => {
    render(<FilterLogicToggle />, { wrapper });
    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from localStorage properly", () => {
    localStorage.setItem("filter-logic", "or");
    render(<FilterLogicToggle />, { wrapper });
    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should update the URL correctly", async () => {
    const user = userEvent.setup();
    const { router } = render(<FilterLogicToggle />, {
      route: "?filterLogic=or",
      wrapper,
    });

    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");

    await user.click(filterLogicToggle);
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("?filterLogic=and");

    await user.click(filterLogicToggle);
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");
    expect(router.state.location.search).toBe("?filterLogic=or");
  });

  it("url params should take precedence over stored value", () => {
    localStorage.setItem("filter-logic", "or");
    render(<FilterLogicToggle />, {
      route: "?filterLogic=and",
      wrapper,
    });
    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
  });
});
