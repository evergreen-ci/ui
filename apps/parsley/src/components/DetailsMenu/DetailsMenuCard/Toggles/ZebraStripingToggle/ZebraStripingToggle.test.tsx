import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import ZebraStripingToggle from ".";

const wrapper = logContextWrapper();

describe("zebra striping toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("zebra-striping", "true");
    InitializeFakeToastContext();
  });

  it("defaults to 'false' if stored value is unset", () => {
    localStorage.clear();
    render(<ZebraStripingToggle />, { wrapper });
    const zebraStripingToggle = screen.getByDataCy("zebra-striping-toggle");
    expect(zebraStripingToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from localStorage properly", () => {
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
