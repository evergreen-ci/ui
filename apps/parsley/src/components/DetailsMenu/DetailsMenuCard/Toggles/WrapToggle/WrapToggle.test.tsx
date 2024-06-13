import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { logContextWrapper } from "context/LogContext/test_utils";
import { RenderFakeToastContext as InitializeFakeToastContext } from "context/toast/__mocks__";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import WrapToggle from ".";

vi.mock("js-cookie");
const mockedSet = vi.spyOn(Cookie, "set") as MockInstance;

const wrapper = logContextWrapper();

describe("wrap toggle", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
  });
  it("defaults to 'false'", () => {
    render(<WrapToggle />, { wrapper });
    const wrapToggle = screen.getByDataCy("wrap-toggle");
    expect(wrapToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should update the cookie but not the URL", async () => {
    const user = userEvent.setup();
    const { router } = render(<WrapToggle />, { wrapper });
    const wrapToggle = screen.getByDataCy("wrap-toggle");

    await user.click(wrapToggle);
    expect(wrapToggle).toHaveAttribute("aria-checked", "true");
    expect(mockedSet).toHaveBeenCalledTimes(1);
    expect(router.state.location.search).toBe("");
  });
});
