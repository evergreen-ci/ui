import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import TextInputWithValidation from ".";

describe("textInputWithValidation", () => {
  it("should not be able to submit with an invalid input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <TextInputWithValidation
        aria-label="textinput"
        label="textinput"
        onSubmit={onSubmit}
        validator={(v) => v.length > 5}
      />,
    );
    const input = screen.getByRole("textbox", { name: "textinput" });
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{enter}");
    expect(onSubmit).not.toHaveBeenCalledWith("test");
  });
  it("should not validate without a validation function", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <TextInputWithValidation
        aria-label="textinput"
        label="textinput"
        onSubmit={onSubmit}
      />,
    );
    const input = screen.getByRole("textbox", { name: "textinput" });
    await user.type(input, "test");
    await user.type(input, "{enter}");
    expect(onSubmit).toHaveBeenCalledWith("test");
  });
  it("should call onChange only for valid inputs", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TextInputWithValidation
        aria-label="textinput"
        label="textinput"
        onChange={onChange}
        validator={(v) => v.length >= 5}
      />,
    );
    const input = screen.getByRole("textbox", { name: "textinput" });
    await user.type(input, "test");
    expect(onChange).not.toHaveBeenCalledWith("test");
    await user.type(input, "5");
    expect(onChange).toHaveBeenCalledWith("test5");
  });
  it("clearOnSubmit should clear the input after a valid input is submitted", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <TextInputWithValidation
        aria-label="textinput"
        clearOnSubmit
        label="textinput"
        onChange={onChange}
        onSubmit={onSubmit}
        validator={(v) => v.length >= 5}
      />,
    );
    const input = screen.getByRole("textbox", { name: "textinput" });
    await user.type(input, "test");
    expect(onChange).not.toHaveBeenCalledWith("test");
    await user.type(input, "5");
    expect(onChange).toHaveBeenCalledWith("test5");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("");
    expect(onSubmit).toHaveBeenCalledWith("test5");
  });
  it("should reset the input when the default prop value changes", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <TextInputWithValidation
        clearOnSubmit
        onSubmit={vi.fn()}
        value="initial value"
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("initial value");

    await user.clear(input);
    expect(input).toHaveValue("");

    await user.type(input, "new value");
    expect(input).toHaveValue("new value");

    rerender(
      <TextInputWithValidation
        clearOnSubmit
        onSubmit={vi.fn()}
        value="reset value"
      />,
    );

    expect(input).toHaveValue("reset value");
  });
});
