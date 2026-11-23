import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { StatusFilter } from ".";

describe("statusFilter", () => {
  it("summarizes statuses from the url in the field", async () => {
    render(<StatusFilter />, {
      route: "/project/evergreen/waterfall?statuses=failed",
      path: "/project/:projectId/waterfall",
    });
    expect(await screen.findByPlaceholderText("1 item selected")).toBeVisible();
  });

  it("writes the selected statuses to the url", async () => {
    const user = userEvent.setup();
    const { router } = render(<StatusFilter />, {
      route: "/project/evergreen/waterfall",
      path: "/project/:projectId/waterfall",
    });
    await user.click(screen.getByPlaceholderText("All"));
    await user.click(await screen.findByTestId("failed-option"));
    await waitFor(() => {
      expect(router.state.location.search).toBe("?statuses=failed");
    });
  });
});
