import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { WRAP_FORMAT } from "constants/storageKeys";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import WordWrapFormatToggle from ".";

const wrapper = logContextWrapper();

describe("word wrap format toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(WRAP_FORMAT, "standard");
    InitializeFakeToastContext();
  });

  it("should be disabled if word wrap is disabled", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <WordWrapFormatToggle />,
    );
    render(<Component />, { wrapper });
    expect(hook.current.preferences.wrap).toBe(false);
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");
    act(() => {
      hook.current.preferences.setWrap(true);
    });
    expect(wordWrapFormatToggle).not.toBeDisabled();
  });
  it("defaults to 'standard' if stored value is unset", () => {
    localStorage.clear();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <WordWrapFormatToggle />,
    );
    render(<Component />, { wrapper });
    expect(hook.current.preferences.wordWrapFormat).toBe("standard");
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");
    expect(wordWrapFormatToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from localStorage properly", () => {
    const { Component } = renderComponentWithHook(
      useLogContext,
      <WordWrapFormatToggle />,
    );
    render(<Component />, { wrapper });
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");
    expect(wordWrapFormatToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should not update the URL", async () => {
    const user = userEvent.setup();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <WordWrapFormatToggle />,
    );
    const { router } = render(<Component />, { wrapper });
    act(() => {
      hook.current.preferences.setWrap(true);
    });
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");

    await user.click(wordWrapFormatToggle);
    expect(wordWrapFormatToggle).toHaveAttribute("aria-checked", "true");
    expect(router.state.location.search).toBe("");
  });
});
