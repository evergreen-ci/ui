import { render, screen, userEvent, waitFor } from "test_utils";
import IconWithTooltip from ".";

describe("icon with tooltip", () => {
  it("renders a tooltip when hovered", async () => {
    const user = userEvent.setup();
    render(
      <IconWithTooltip data-testid="Icon" glyph="Warning">
        Some Text
      </IconWithTooltip>,
    );
    expect(screen.queryByText("Some Text")).toBeNull();

    const trigger = await screen.findByTestId("Icon");
    await user.hover(trigger);
    await waitFor(() => {
      expect(screen.getByText("Some Text")).toBeVisible();
    });

    await user.unhover(trigger);
    await waitFor(() => {
      expect(screen.queryByText("Some Text")).toBeNull();
    });
  });
});
