import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import TextFilterInput from ".";

const options = [
  {
    value: "build_variant",
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: "task",
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];

const sharedProps = {
  ariaLabel: "Text Filter Input",
  id: "text-filter-input",
  "data-testid": "text-filter-input",
  label: "Text Filter Input",
};

describe("TextFilterInput", () => {
  it("renders with defaultOption when provided", () => {
    render(
      <TextFilterInput
        {...sharedProps}
        defaultOption="task"
        options={options}
      />,
    );
    expect(screen.getByRole("radio", { name: "Task" })).toBeChecked();
  });

  it("calls onToggleOption when the segmented control selection changes", async () => {
    const user = userEvent.setup();
    const onToggleOption = vi.fn();
    render(
      <TextFilterInput
        {...sharedProps}
        onToggleOption={onToggleOption}
        options={options}
      />,
    );
    await user.click(screen.getByRole("radio", { name: "Task" }));
    expect(onToggleOption).toHaveBeenCalledWith("task");
  });

  it("does not crash when onSubmit is not provided", async () => {
    const user = userEvent.setup();
    render(<TextFilterInput {...sharedProps} options={options} />);
    const input = screen.getByTestId("text-filter-input-input");
    await user.type(input, "some-filter");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("");
  });

  it("renders normally", () => {
    const onSubmit = vi.fn();
    const validator = vi.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TextFilterInput
        {...sharedProps}
        onSubmit={onSubmit}
        options={options}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    const input = screen.queryByTestId("text-filter-input-input");
    const segment = screen.getByRole("radio", { name: "Build Variant" });
    expect(segment).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("should clear input when a value is submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const validator = vi.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TextFilterInput
        {...sharedProps}
        onSubmit={onSubmit}
        options={options}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    const input = screen.getByTestId("text-filter-input-input");
    expect(input).toHaveValue("");
    await user.type(input, "some-filter");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("");
  });

  it("should validate the input and prevent submission if it fails validation", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const validator = vi.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TextFilterInput
        {...sharedProps}
        onSubmit={onSubmit}
        options={options}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    const input = screen.getByTestId("text-filter-input-input");

    expect(input).toHaveValue("");
    await user.type(input, "bad");
    expect(input).toHaveValue("bad");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("bad");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(validator).toHaveBeenLastCalledWith("bad");
    expect(screen.getByLabelText("validation error")).toBeInTheDocument();
    await user.hover(screen.getByLabelText("validation error"));
    await screen.findByText(validatorErrorMessage);
  });
});
