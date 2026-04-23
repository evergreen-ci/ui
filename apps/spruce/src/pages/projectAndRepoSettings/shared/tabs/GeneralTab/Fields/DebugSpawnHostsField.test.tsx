import { FieldProps } from "@rjsf/core";
import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { DebugSpawnHostsField } from ".";

const schema: FieldProps["schema"] = {
  type: ["boolean", "null"],
  title: "Debug Spawn Hosts",
  oneOf: [
    { type: ["boolean", "null"], title: "Enabled", enum: [false] },
    { type: ["boolean", "null"], title: "Disabled", enum: [true] },
  ],
};

const uiSchema = {
  "ui:description": "Sets if project tasks can create debug spawn hosts.",
};

const Field = ({ formData = false as boolean | null, onChange = vi.fn() }) => (
  <DebugSpawnHostsField
    {...({} as unknown as FieldProps)}
    formData={formData}
    onChange={onChange}
    schema={schema}
    uiSchema={uiSchema}
  />
);

describe("debugSpawnHostsField", () => {
  it("renders the radio box options", () => {
    render(<Field />);
    expect(screen.getByText("Enabled")).toBeInTheDocument();
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  it("shows confirmation modal when toggling from enabled to disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field formData={false} onChange={onChange} />);

    await user.click(screen.getByText("Disabled"));
    expect(screen.getByDataCy("disable-debug-spawn-hosts-modal")).toBeVisible();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange when confirming the modal", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field formData={false} onChange={onChange} />);

    await user.click(screen.getByText("Disabled"));
    const disableButton = screen.getByRole("button", { name: "Disable" });
    await user.click(disableButton);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not call onChange when canceling the modal", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field formData={false} onChange={onChange} />);

    await user.click(screen.getByText("Disabled"));
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not show modal when toggling from disabled to enabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field formData onChange={onChange} />);

    await user.click(screen.getByText("Enabled"));
    expect(
      screen.queryByDataCy("disable-debug-spawn-hosts-modal"),
    ).not.toBeVisible();
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
