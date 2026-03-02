import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import CaseSensitiveToggle from ".";

const wrapper = logContextWrapper();

describe("case sensitivity toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    InitializeFakeToastContext();
  });

  it("defaults to 'false' if stored value is unset", () => {
    render(<CaseSensitiveToggle />, { wrapper });
    const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");
    expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from localStorage properly", () => {
    localStorage.setItem("case-sensitive", "true");
    render(<CaseSensitiveToggle />, { wrapper });
    const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");
    expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should not update the URL", async () => {
    const user = userEvent.setup();
    localStorage.setItem("case-sensitive", "true");
    const { router } = render(<CaseSensitiveToggle />, { wrapper });
    const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");

    await user.click(caseSensitiveToggle);
    expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("");
  });
});
