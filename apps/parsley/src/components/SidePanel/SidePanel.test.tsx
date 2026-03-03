import { useState } from "react";
import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { DRAWER_OPENED } from "constants/storageKeys";
import { logContextWrapper } from "context/LogContext/test_utils";
import SidePanel from ".";

const wrapper = logContextWrapper();

const SidePanelWrapper = () => {
  const [collapsed, setCollapsed] = useState<boolean>(
    localStorage.getItem(DRAWER_OPENED) === "true",
  );
  return (
    <SidePanel
      {...props}
      panelCollapsed={collapsed}
      setPanelCollapsed={setCollapsed}
    />
  );
};

describe("sidePanel", () => {
  beforeEach(() => {
    localStorage.clear();
    InitializeFakeToastContext();
  });

  it("should be uncollapsed if the user has never seen the filters drawer before", () => {
    render(<SidePanelWrapper />, { wrapper });
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");
  });

  it("should be collapsed if the user has seen the filters drawer before", () => {
    localStorage.setItem(DRAWER_OPENED, "true");
    render(<SidePanelWrapper />, { wrapper });
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "false");
  });

  it("should be possible to toggle the drawer open and closed", async () => {
    const user = userEvent.setup();
    render(<SidePanelWrapper />, { wrapper });
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");
    await user.click(collapseButton);
    expect(collapseButton).toHaveAttribute("aria-expanded", "false");
  });
});

const props = {
  clearExpandedLines: vi.fn(),
  collapseLines: vi.fn(),
  expandedLines: [],
};
