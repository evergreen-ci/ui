import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import TupleSelectWithRegexConditionalStories from ".";

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

describe("tupleSelectWithRegexConditional", () => {
  it("renders normally", () => {
    const onSubmit = vi.fn();
    const validator = vi.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelectWithRegexConditionalStories
        onSubmit={onSubmit}
        options={options}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    const input = screen.queryByDataCy("tuple-select-input");
    const dropdown = screen.queryByText("Build Variant");
    expect(dropdown).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(dropdown).toHaveTextContent("Build Variant");
    expect(input).toHaveValue("");
  });

  it("should clear input when a value is submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const validator = vi.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelectWithRegexConditionalStories
        onSubmit={onSubmit}
        options={options}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    const input = screen.getByDataCy("tuple-select-input");

    expect(input).toHaveValue("");
    await user.type(input, "some-filter");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("");
  });

  it("should validate the input and prevent submission if it fails validation and input type is set to `regex`", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const validator = vi.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelectWithRegexConditionalStories
        onSubmit={onSubmit}
        options={options}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    const input = screen.getByDataCy("tuple-select-input");

    expect(input).toHaveValue("");
    await user.type(input, "bad");
    expect(input).toHaveValue("bad");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("bad");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(validator).toHaveBeenLastCalledWith("bad");
    expect(screen.getByLabelText("validation error")).toBeInTheDocument();
    await user.hover(screen.getByLabelText("validation error"));
    await waitFor(() => {
      expect(screen.getByText(validatorErrorMessage)).toBeInTheDocument();
    });
  });
  it("toggling the input type selector to `exact` should escape any regex characters", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const validator = vi.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelectWithRegexConditionalStories
        onSubmit={onSubmit}
        options={options}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    await user.click(screen.getByRole("tab", { name: "Exact" }));
    const input = screen.getByDataCy("tuple-select-input");
    expect(input).toHaveValue("");
    await user.type(input, "some-*");
    expect(input).toHaveValue("some-*");
    await user.type(input, "{enter}");
    expect(onSubmit).toHaveBeenCalledWith({
      category: "build_variant",
      value: "some\\-\\*",
      type: "exact",
    });
    expect(input).toHaveValue("");
  });
  it("should not attempt to validate input if using the `exact` input type", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const validator = vi.fn((v) => v !== "bad");
    const validatorErrorMessage = "Invalid Input";
    render(
      <TupleSelectWithRegexConditionalStories
        onSubmit={onSubmit}
        options={options}
        validator={validator}
        validatorErrorMessage={validatorErrorMessage}
      />,
    );
    await user.click(screen.getByRole("tab", { name: "Exact" }));
    const input = screen.getByDataCy("tuple-select-input");
    expect(input).toHaveValue("");
    await user.type(input, "*");
    expect(input).toHaveValue("*");
    expect(validator).toHaveBeenCalledWith("");
  });
});
