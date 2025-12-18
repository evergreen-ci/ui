import { userEvent, render, screen } from "@evg-ui/lib/test_utils";
import { ContextChip } from "../Context/context";
import { ContextChips } from ".";

describe("ContextChips", () => {
  const chips: ContextChip[] = [
    {
      content: "console.log('hello')",
      identifier: "test-1",
      badgeLabel: "Line 1",
    },
    {
      content: "const x = 42;",
      identifier: "test-2",
      badgeLabel: "Lines 5-6",
    },
  ];

  it("renders no chips when chips array is empty", () => {
    render(<ContextChips chips={[]} dismissible={false} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders chips with correct labels", () => {
    render(<ContextChips chips={chips} dismissible={false} />);
    chips.forEach((chip) => {
      expect(screen.getByText(chip.badgeLabel)).toBeInTheDocument();
    });
  });

  it("calls onClick when a chip is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ContextChips chips={chips} dismissible={false} onClick={onClick} />,
    );
    await user.click(screen.getByText(chips[1].badgeLabel));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders dismiss buttons when dismissible is true", () => {
    const mockOnDismiss = vi.fn();
    render(
      <ContextChips chips={chips} dismissible onDismiss={mockOnDismiss} />,
    );
    const dismissButtons = screen.getAllByRole("button", {
      name: "Dismiss chip",
    });
    expect(dismissButtons).toHaveLength(2);
  });

  it("does not render dismiss buttons when dismissible is false", () => {
    render(<ContextChips chips={chips} dismissible={false} />);
    expect(
      screen.queryByRole("button", { name: "Dismiss chip" }),
    ).not.toBeInTheDocument();
  });

  it("calls onDismiss when a chip is dismissed", async () => {
    const user = userEvent.setup();
    const mockOnDismiss = vi.fn();
    render(
      <ContextChips chips={chips} dismissible onDismiss={mockOnDismiss} />,
    );
    const dismissButtons = screen.getAllByRole("button", {
      name: "Dismiss chip",
    });
    await user.click(dismissButtons[0]);
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    expect(mockOnDismiss).toHaveBeenCalledWith(chips[0]);
  });
});
