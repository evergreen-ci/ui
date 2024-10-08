import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import FileSelector from ".";

describe("file selector", () => {
  it("clicking the 'Select from files' button should open the file dialog", async () => {
    const user = userEvent.setup();
    const open = vi.fn();
    render(<FileSelector getInputProps={vi.fn()} open={open} />);
    await user.click(screen.getByRole("button", { name: "Select from files" }));
    expect(open).toHaveBeenCalledTimes(1);
  });
});
