import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { TestComponent } from ".";

describe("test component", () => {
  it("clicking button increases counter", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    expect(screen.getByText("0")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
