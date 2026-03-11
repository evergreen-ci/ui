import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { WRAP } from "constants/storageKeys";
import { logContextWrapper } from "context/LogContext/test_utils";
import WrapToggle from ".";

const wrapper = logContextWrapper();

describe("wrap toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    InitializeFakeToastContext();
  });
  it("defaults to 'false'", () => {
    render(<WrapToggle />, { wrapper });
    const wrapToggle = screen.getByDataCy("wrap-toggle");
    expect(wrapToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should update localStorage but not the URL", async () => {
    const user = userEvent.setup();
    const { router } = render(<WrapToggle />, { wrapper });
    const wrapToggle = screen.getByDataCy("wrap-toggle");

    await user.click(wrapToggle);
    expect(wrapToggle).toHaveAttribute("aria-checked", "true");
    expect(localStorage.getItem(WRAP)).toBe("true");
    expect(router.state.location.search).toBe("");
  });
});
