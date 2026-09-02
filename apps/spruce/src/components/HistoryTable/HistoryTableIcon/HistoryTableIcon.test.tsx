import { fireEvent, render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { HistoryTableIcon } from ".";

describe("historyTableIcon", () => {
  it("clicking on the icon performs an action", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <HistoryTableIcon onClick={onClick} status={TaskStatus.Succeeded} />,
    );
    const icon = screen.queryByTestId("history-table-icon");
    expect(icon).toBeInTheDocument();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(icon);
    expect(onClick).toHaveBeenCalledWith();
  });

  it("hovering over the icon when there no failing tests shouldn't open a tooltip", async () => {
    render(<HistoryTableIcon status={TaskStatus.Succeeded} />);
    const icon = screen.queryByTestId("history-table-icon");
    expect(icon).toBeInTheDocument();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    fireEvent.pointerEnter(icon);
    expect(screen.queryByText("test a")).not.toBeInTheDocument();
  });
});
