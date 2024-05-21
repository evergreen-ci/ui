import { createRef } from "react";
import { render, screen, userEvent, waitFor } from "test_utils";
import PopoverButton from ".";

describe("popoverButton", () => {
  it("opens a popover when clicked", async () => {
    const user = userEvent.setup();
    render(
      <PopoverButton buttonRef={createRef()} buttonText="Open Popover">
        Some content
      </PopoverButton>,
    );
    const button = screen.getByRole("button", {
      name: "Open Popover",
    });
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByText("Some content")).toBeVisible();
    });
  });
  it("calls the passed in event handler when the button is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <PopoverButton
        buttonRef={createRef()}
        buttonText="Open Popover"
        onClick={onClick}
      >
        Some content
      </PopoverButton>,
    );
    const button = screen.getByRole("button", {
      name: "Open Popover",
    });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
