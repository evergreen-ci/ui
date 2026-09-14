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
    primePointerModality();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    fireEvent.pointerEnter(icon);
    expect(screen.queryByText("test a")).not.toBeInTheDocument();
  });

  it("hovering over the icon when there are failing tests should open a tooltip", async () => {
    render(
      <HistoryTableIcon
        failingTests={failingTests}
        status={TaskStatus.Succeeded}
      />,
    );
    const icon = screen.queryByTestId("history-table-icon");
    expect(icon).toBeInTheDocument();
    primePointerModality();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    fireEvent.pointerEnter(icon);
    // jsdom can't lay out the tooltip's portal, so check presence not visibility.
    expect(
      await screen.findByText("test a", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
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

/** jsdom won't treat hover as real until a pointer event fires first. */
function primePointerModality() {
  fireEvent.pointerMove(document.body);
}
