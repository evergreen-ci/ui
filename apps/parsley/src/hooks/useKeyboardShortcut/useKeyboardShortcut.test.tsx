import { CharKey, ModifierKey } from "@evg-ui/lib/constants/keys";
import { render, renderHook, screen, userEvent } from "@evg-ui/lib/test_utils";
import useKeyboardShortcut from ".";

describe("useKeyboardShortcut", () => {
  describe("multiple keys", () => {
    it("should call the callback only when the exact shortcut keys are pressed", async () => {
      const user = userEvent.setup();
      const callback = vi.fn();
      renderHook(() =>
        useKeyboardShortcut(
          { charKey: CharKey.A, modifierKeys: [ModifierKey.Control] },
          callback,
        ),
      );
      await user.keyboard("{Control}");
      expect(callback).toHaveBeenCalledTimes(0);
      await user.keyboard("{a}");
      expect(callback).toHaveBeenCalledTimes(0);
      await user.keyboard("{Control>}{Shift>}{a}{/Control}{/Shift}");
      expect(callback).toHaveBeenCalledTimes(0);
      await user.keyboard("{Control>}{a}{/Control}");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not call the callback if an input element has focus", async () => {
      const user = userEvent.setup();
      const callback = vi.fn();
      renderHook(() =>
        useKeyboardShortcut(
          { charKey: CharKey.A, modifierKeys: [ModifierKey.Control] },
          callback,
        ),
      );
      render(<input data-cy="test-input" />);

      await user.click(screen.getByDataCy("test-input"));
      expect(screen.getByDataCy("test-input")).toHaveFocus();
      await user.keyboard("{Control>}{a}{/Control}");
      expect(callback).toHaveBeenCalledTimes(0);
      expect(screen.getByDataCy("test-input")).toHaveValue("");
    });
  });

  describe("single key", () => {
    it("should call the callback only when the exact shortcut key is pressed", async () => {
      const user = userEvent.setup();
      const callback = vi.fn();
      renderHook(() => useKeyboardShortcut({ charKey: CharKey.A }, callback));
      await user.keyboard("{Control>}{A}{/Control}");
      expect(callback).toHaveBeenCalledTimes(0);
      await user.keyboard("{Control>}{Shift>}{a}{/Control}{/Shift}");
      expect(callback).toHaveBeenCalledTimes(0);
      await user.keyboard("{a}");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should not call the callback if an input element has focus", async () => {
      const user = userEvent.setup();
      const callback = vi.fn();
      renderHook(() => useKeyboardShortcut({ charKey: CharKey.A }, callback));
      render(<input data-cy="test-input" />);

      await user.click(screen.getByDataCy("test-input"));
      expect(screen.getByDataCy("test-input")).toHaveFocus();
      await user.keyboard("{a}");
      expect(callback).toHaveBeenCalledTimes(0);
      expect(screen.getByDataCy("test-input")).toHaveValue("a");
    });
  });

  it("should call the callback if an input element has focus and ignoreFocus is enabled", async () => {
    const user = userEvent.setup();
    const callback = vi.fn();
    renderHook(() =>
      useKeyboardShortcut(
        { charKey: CharKey.A, modifierKeys: [ModifierKey.Control] },
        callback,
        {
          ignoreFocus: true,
        },
      ),
    );
    render(<input data-cy="test-input" />);
    await user.click(screen.getByDataCy("test-input"));
    expect(screen.getByDataCy("test-input")).toHaveFocus();
    await user.keyboard("{Control>}{a}{/Control}");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call the callback if the component is disabled", async () => {
    const user = userEvent.setup();
    const callback = vi.fn();
    renderHook(() =>
      useKeyboardShortcut(
        { charKey: CharKey.A, modifierKeys: [ModifierKey.Control] },
        callback,
        {
          disabled: true,
        },
      ),
    );
    await user.keyboard("{a}");
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should remove the event listener if the component is initially enabled, then disabled", async () => {
    const mockedAddEventListener = vi.fn();
    const mockedRemoveEventListener = vi.fn();
    vi.spyOn(document, "addEventListener").mockImplementation(
      mockedAddEventListener,
    );
    vi.spyOn(document, "removeEventListener").mockImplementation(
      mockedRemoveEventListener,
    );

    const { rerender: rerenderHook } = renderHook(
      (args: { disabled: boolean } = { disabled: false }) =>
        useKeyboardShortcut({ charKey: CharKey.A }, vi.fn(), {
          disabled: args.disabled,
        }),
    );
    expect(mockedAddEventListener).toHaveBeenCalledTimes(1);

    rerenderHook({ disabled: true });
    expect(mockedAddEventListener).toHaveBeenCalledTimes(1);
    expect(mockedRemoveEventListener).toHaveBeenCalledTimes(2);
  });
});
