import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import { TaskStatus } from "@evg-ui/lib/types";
import { HistoryTableIcon } from ".";

describe("historyTableIcon", () => {
  it("clicking on the icon performs an action", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <HistoryTableIcon onClick={onClick} status={TaskStatus.Succeeded} />,
    );
    const icon = screen.queryByDataCy("history-table-icon");
    expect(icon).toBeInTheDocument();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(icon);
    expect(onClick).toHaveBeenCalledWith();
  });

  it("hovering over the icon when there no failing tests shouldn't open a tooltip", async () => {
    const user = userEvent.setup();
    render(<HistoryTableIcon status={TaskStatus.Succeeded} />);
    const icon = screen.queryByDataCy("history-table-icon");
    expect(icon).toBeInTheDocument();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.hover(icon);
    expect(screen.queryByText("test a")).not.toBeInTheDocument();
  });

  it("hovering over the icon when there are failing tests should open a tooltip", async () => {
    const user = userEvent.setup();
    render(
      <HistoryTableIcon
        failingTests={failingTests}
        status={TaskStatus.Succeeded}
      />,
    );
    const icon = screen.queryByDataCy("history-table-icon");
    expect(icon).toBeInTheDocument();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.hover(icon);
    await waitFor(() => {
      expect(screen.queryByText("test a")).toBeVisible();
    });
  });
});

const failingTests = [
  "test a",
  "test b",
  "test c",
  "test looooonnnnnnnng name",
  "some other test",
  "test name d",
];
