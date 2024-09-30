import { createRef } from "react";
import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import PopoverButton from ".";

describe("popoverButton", () => {
  it("calls 'setIsOpen' when clicked", async () => {
    const user = userEvent.setup();
    const setIsOpenMock = vi.fn();
    render(
      <PopoverButton
        buttonRef={createRef()}
        buttonText="Open Popover"
        isOpen={false}
        setIsOpen={setIsOpenMock}
      >
        Some content
      </PopoverButton>,
    );
    const button = screen.getByRole("button", {
      name: "Open Popover",
    });
    await user.click(button);
    expect(setIsOpenMock).toHaveBeenCalledTimes(1);
    expect(setIsOpenMock).toHaveBeenCalledWith(true);
  });
  it("displays the children when 'isOpen' is true", async () => {
    render(
      <PopoverButton
        buttonRef={createRef()}
        buttonText="Open Popover"
        isOpen
        setIsOpen={() => {}}
      >
        Some content
      </PopoverButton>,
    );
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
        isOpen={false}
        onClick={onClick}
        setIsOpen={() => {}}
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
