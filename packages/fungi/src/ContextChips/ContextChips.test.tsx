import { userEvent, render, screen } from "@evg-ui/lib/test_utils";
import { ContextChip } from "../Context/context";
import { ContextChips } from ".";

describe("ContextChips", () => {
  const chips: ContextChip[] = [
    {
      children: "console.log('hello')",
      identifier: "test-1",
      badgeLabel: "Line 1",
    },
    {
      children: "const x = 42;",
      identifier: "test-2",
      badgeLabel: "Lines 5-6",
    },
  ];

  it("renders no chips when chips array is empty", () => {
    render(<ContextChips chips={[]} onDismiss={vi.fn()} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders chips with correct labels", () => {
    render(<ContextChips chips={chips} onDismiss={vi.fn()} />);
    chips.forEach((chip) => {
      expect(screen.getByText(chip.badgeLabel)).toBeInTheDocument();
    });
  });

  it("calls onDismiss when a chip is dismissed", async () => {
    const user = userEvent.setup();
    const mockOnDismiss = vi.fn();
    render(<ContextChips chips={chips} onDismiss={mockOnDismiss} />);
    const dismissButtons = screen.getAllByRole("button", {
      name: "Dismiss chip",
    });
    await user.click(dismissButtons[0]);
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    expect(mockOnDismiss).toHaveBeenCalledWith(chips[0]);
  });
});
