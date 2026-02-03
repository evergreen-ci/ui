import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import {
  RenderFakeToastContext as InitializeFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import ExpandableRowsToggle from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = logContextWrapper();

describe("expandable rows toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
    InitializeFakeToastContext();
  });

  it("defaults to 'true' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<ExpandableRowsToggle />, { wrapper });
    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should read from the cookie properly", () => {
    render(<ExpandableRowsToggle />, { wrapper });
    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should update the URL correctly", async () => {
    const user = userEvent.setup();
    const { router } = render(<ExpandableRowsToggle />, { wrapper });

    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");

    await user.click(expandableRowsToggle);
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("?expandable=false");
  });

  it("url params should take precedence over cookie value", () => {
    render(<ExpandableRowsToggle />, {
      route: "?expandable=false",
      wrapper,
    });
    const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
    expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");
  });
});
