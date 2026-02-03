import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import {
  RenderFakeToastContext as InitializeFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import FilterLogicToggle from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = logContextWrapper();

describe("filter logic toggle", () => {
  beforeAll(() => {
    InitializeFakeToastContext();
  });
  beforeEach(() => {
    mockedGet.mockImplementation(() => "or");
  });

  it("defaults to 'and' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<FilterLogicToggle />, { wrapper });
    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<FilterLogicToggle />, { wrapper });
    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should update the URL correctly", async () => {
    const user = userEvent.setup();
    const { router } = render(<FilterLogicToggle />, { wrapper });

    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");

    await user.click(filterLogicToggle);
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("?filterLogic=and");

    await user.click(filterLogicToggle);
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");
    expect(router.state.location.search).toBe("?filterLogic=or");
  });

  it("url params should take precedence over cookie value", () => {
    render(<FilterLogicToggle />, {
      route: "?filterLogic=and",
      wrapper,
    });
    const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
    expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
  });
});
