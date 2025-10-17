import { render, screen, userEvent, waitFor } from "test_utils";
import TableSearchPopover from ".";

describe("table search popover", () => {
  it("opens the popover when icon is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TableSearchPopover
        data-cy="test-popover"
        onConfirm={vi.fn()}
        value=""
      />,
    );
    expect(screen.queryByDataCy("test-popover-wrapper")).toBeNull();
    const icon = screen.getByRole("button", {
      name: "Table Search Popover Icon",
    });
    await user.click(icon);
    await waitFor(() => {
      expect(screen.queryByDataCy("test-popover-wrapper")).toBeVisible();
    });
  });

  it("shows value when supplied", async () => {
    const user = userEvent.setup();
    render(
      <TableSearchPopover
        data-cy="test-popover"
        onConfirm={vi.fn()}
        value="test_value"
      />,
    );
    const icon = screen.getByRole("button", {
      name: "Table Search Popover Icon",
    });
    await user.click(icon);
    await waitFor(() => {
      expect(screen.queryByDataCy("test-popover-wrapper")).toBeVisible();
    });
    const input = screen.getByPlaceholderText("Search");
    expect(input).toHaveValue("test_value");
  });

  it("calls onConfirm function on Enter key", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <TableSearchPopover
        data-cy="test-popover"
        onConfirm={onConfirm}
        value=""
      />,
    );
    const icon = screen.getByRole("button", {
      name: "Table Search Popover Icon",
    });
    await user.click(icon);
    await waitFor(() => {
      expect(screen.queryByDataCy("test-popover-wrapper")).toBeVisible();
    });
    const input = screen.getByPlaceholderText("Search");
    await user.type(input, "test_value{enter}");
    expect(input).toHaveValue("test_value");
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith("test_value");
  });

  it("input has focus on open", async () => {
    const user = userEvent.setup();
    render(
      <TableSearchPopover
        data-cy="test-popover"
        onConfirm={vi.fn()}
        value=""
      />,
    );
    const icon = screen.getByRole("button", {
      name: "Table Search Popover Icon",
    });
    await user.click(icon);
    await waitFor(() => {
      expect(screen.queryByDataCy("test-popover-wrapper")).toBeVisible();
    });
    const input = screen.getByPlaceholderText("Search");
    expect(input).toHaveFocus();
  });

  it("input selects content on open", async () => {
    const user = userEvent.setup();
    render(
      <TableSearchPopover
        data-cy="test-popover"
        onConfirm={vi.fn()}
        value="test_value"
      />,
    );
    const icon = screen.getByRole("button", {
      name: "Table Search Popover Icon",
    });
    await user.click(icon);
    await waitFor(() => {
      expect(screen.queryByDataCy("test-popover-wrapper")).toBeVisible();
    });
    const input = screen.getByPlaceholderText("Search");
    expect(input).toHaveSelection("test_value");
  });
});
