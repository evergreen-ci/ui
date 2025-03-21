import Cookie from "js-cookie";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import * as analytics from "analytics";
import { WaterfallModal } from ".";

vi.mock("js-cookie");
const mockedSet = vi.spyOn(Cookie, "set");

describe("waterfallModal", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal", () => {
    const { Component } = RenderFakeToastContext(
      <WaterfallModal projectIdentifier="spruce" />,
    );
    render(<Component />);
    expect(screen.queryByDataCy("waterfall-modal")).toBeVisible();
    expect(mockedSet).toHaveBeenCalledTimes(0);
  });

  it("navigates to the waterfall on confirm", async () => {
    const user = userEvent.setup();

    const mockSendEvent = vi.fn();
    vi.spyOn(analytics, "useWaterfallAnalytics").mockImplementation(() => ({
      sendEvent: mockSendEvent,
    }));
    const { Component } = RenderFakeToastContext(
      <WaterfallModal projectIdentifier="spruce" />,
    );
    const { router } = render(<Component />, {
      route: "/commits/spruce",
      path: "/commits/:projectIdentifier",
    });

    await user.click(screen.getByRole("button", { name: "Visit Waterfall" }));
    expect(screen.queryByDataCy("waterfall-modal")).not.toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/project/spruce/waterfall");
    expect(mockSendEvent).toHaveBeenCalledTimes(1);
    expect(mockSendEvent).toHaveBeenCalledWith({
      name: "Viewed waterfall modal",
      navigated_to_waterfall: true,
    });
    expect(mockedSet).toHaveBeenCalledTimes(1);
  });

  it("dismisses modal when clicking text", async () => {
    const user = userEvent.setup();
    const mockSendEvent = vi.fn();
    vi.spyOn(analytics, "useWaterfallAnalytics").mockImplementation(() => ({
      sendEvent: mockSendEvent,
    }));
    const { Component } = RenderFakeToastContext(
      <WaterfallModal projectIdentifier="spruce" />,
    );
    const { router } = render(<Component />, {
      route: "/commits/spruce",
      path: "/commits/:projectIdentifier",
    });

    await user.click(screen.getByText("Continue to Project Health"));
    expect(screen.queryByDataCy("waterfall-modal")).not.toBeVisible();
    expect(router.state.location.pathname).toBe("/commits/spruce");
    expect(mockSendEvent).toHaveBeenCalledTimes(1);
    expect(mockSendEvent).toHaveBeenCalledWith({
      name: "Viewed waterfall modal",
      navigated_to_waterfall: false,
    });
    expect(mockedSet).toHaveBeenCalledTimes(1);
  });
});
