import { render, screen, userEvent, waitFor } from "test_utils";
import { TreeDataEntry } from "../../../TreeSelect";
import TableFilterPopover from ".";

const options: TreeDataEntry[] = [
  { title: "Success", value: "success", key: "success" },
  { title: "Failed", value: "failed", key: "failed" },
];

describe("table filter popover", () => {
  it("opens the popover when icon is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TableFilterPopover
        data-cy="test-popover"
        onConfirm={vi.fn()}
        options={options}
        value={[]}
      />,
    );
    expect(screen.queryByDataCy("test-popover-wrapper")).toBeNull();
    const icon = screen.getByRole("button", {
      name: "Table Filter Popover Icon",
    });
    await user.click(icon);
    await waitFor(() => {
      expect(screen.queryByDataCy("test-popover-wrapper")).toBeVisible();
    });
  });

  it("shows value when supplied", async () => {
    const user = userEvent.setup();
    render(
      <TableFilterPopover
        data-cy="test-popover"
        onConfirm={vi.fn()}
        options={options}
        value={["success"]}
      />,
    );
    const icon = screen.getByRole("button", {
      name: "Table Filter Popover Icon",
    });
    await user.click(icon);
    await waitFor(() => {
      expect(screen.queryByDataCy("test-popover-wrapper")).toBeVisible();
    });
    const checkbox = screen.getByLabelText("Success");
    expect(checkbox).toBeChecked();
  });

  it("calls onConfirm function when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <TableFilterPopover
        data-cy="test-popover"
        onConfirm={onConfirm}
        options={options}
        value={[]}
      />,
    );
    const icon = screen.getByRole("button", {
      name: "Table Filter Popover Icon",
    });
    await user.click(icon);
    await waitFor(() => {
      expect(screen.queryByDataCy("test-popover-wrapper")).toBeVisible();
    });

    const checkboxLabel = screen.getByText("Success"); // LeafyGreen checkbox has pointer-events: none so click on the label instead.
    await user.click(checkboxLabel);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith(["success"]);
  });

  it("shows message when no options are provided", async () => {
    const user = userEvent.setup();
    render(
      <TableFilterPopover
        data-cy="test-popover"
        onConfirm={vi.fn()}
        options={[]}
        value={[]}
      />,
    );
    const icon = screen.getByRole("button", {
      name: "Table Filter Popover Icon",
    });
    await user.click(icon);
    await waitFor(() => {
      expect(screen.queryByDataCy("test-popover-wrapper")).toBeVisible();
    });
    expect(screen.getByText("No filters available.")).toBeVisible();
  });
});
