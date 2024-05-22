import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import ZebraStripingToggle from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("zebra striping toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("defaults to 'false' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<ZebraStripingToggle />, { wrapper });
    const zebraStripingToggle = screen.getByDataCy("zebra-striping-toggle");
    expect(zebraStripingToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<ZebraStripingToggle />, { wrapper });
    const zebraStripingToggle = screen.getByDataCy("zebra-striping-toggle");
    expect(zebraStripingToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should not update the URL", async () => {
    const user = userEvent.setup();
    const { router } = render(<ZebraStripingToggle />, { wrapper });
    const zebraStripingToggle = screen.getByDataCy("zebra-striping-toggle");

    await user.click(zebraStripingToggle);
    expect(zebraStripingToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("");
  });
});
