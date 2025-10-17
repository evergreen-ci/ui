import { vi } from "vitest";
import { render, screen, userEvent, waitFor } from "test_utils";
import Popconfirm from ".";

describe("controlled popconfirm", () => {
  it("properly shows content inside the popconfirm", () => {
    render(
      <Popconfirm confirmText="OK" open setOpen={vi.fn()}>
        <div>hello</div>
      </Popconfirm>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("pressing the Confirm button calls the onConfirm callback and closes the popconfirm", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const setOpen = vi.fn();
    render(
      <Popconfirm onConfirm={onConfirm} open setOpen={setOpen}>
        <div>hello</div>
      </Popconfirm>,
    );
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("pressing the Cancel button calls the onClose callback and closes the popconfirm", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const setOpen = vi.fn();
    render(
      <Popconfirm onClose={onClose} open setOpen={setOpen}>
        <div>hello</div>
      </Popconfirm>,
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("disables the confirm button when confirmDisabled is true", () => {
    render(
      <Popconfirm confirmDisabled onClose={vi.fn()} open setOpen={vi.fn()}>
        <div>hello</div>
      </Popconfirm>,
    );
    expect(screen.getByRole("button", { name: "Yes" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

describe("uncontrolled popconfirm", () => {
  it("uses a trigger to open and close the component", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Popconfirm
        onClose={onClose}
        trigger={<button type="button">Open</button>}
      >
        <div>hello</div>
      </Popconfirm>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => {
      expect(screen.getByText("hello")).toBeVisible();
    });
    await user.click(screen.getByRole("button", { name: /Open/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText("hello")).not.toBeVisible();
  });
});
