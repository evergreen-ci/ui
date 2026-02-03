import { useState } from "react";
import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import {
  RenderFakeToastContext as InitializeFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { DRAWER_OPENED } from "constants/cookies";
import { logContextWrapper } from "context/LogContext/test_utils";
import SidePanel from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = logContextWrapper();

const SidePanelWrapper = () => {
  const [collapsed, setCollapsed] = useState<boolean>(
    Cookie.get(DRAWER_OPENED) === "true",
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
    InitializeFakeToastContext();
    // Setting the cookie to false means the drawer will be open by default, which means we
    // won't have to toggle it to test its contents.
    mockedGet.mockImplementation(() => "false");
  });

  it("should be uncollapsed if the user has never seen the filters drawer before", () => {
    render(<SidePanelWrapper />, { wrapper });
    const collapseButton = screen.getByLabelText("Collapse navigation");
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");
  });

  it("should be collapsed if the user has seen the filters drawer before", () => {
    mockedGet.mockImplementation(() => "true");
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
