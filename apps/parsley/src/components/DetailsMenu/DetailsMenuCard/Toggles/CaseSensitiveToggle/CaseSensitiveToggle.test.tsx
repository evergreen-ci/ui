import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import {
  RenderFakeToastContext as InitializeFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import CaseSensitiveToggle from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = logContextWrapper();

describe("case sensitivity toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
    InitializeFakeToastContext();
  });

  it("defaults to 'false' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<CaseSensitiveToggle />, { wrapper });
    const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");
    expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<CaseSensitiveToggle />, { wrapper });
    const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");
    expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should not update the URL", async () => {
    const user = userEvent.setup();
    const { router } = render(<CaseSensitiveToggle />, { wrapper });
    const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");

    await user.click(caseSensitiveToggle);
    expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("");
  });
});
