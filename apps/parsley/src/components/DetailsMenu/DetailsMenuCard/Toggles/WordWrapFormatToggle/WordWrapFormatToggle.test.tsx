import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import {
  RenderFakeToastContext as InitializeFakeToastContext,
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import WordWrapFormatToggle from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = logContextWrapper();

describe("word wrap format toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "standard");
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
  it("defaults to 'standard' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <WordWrapFormatToggle />,
    );
    render(<Component />, { wrapper });
    expect(hook.current.preferences.wordWrapFormat).toBe("standard");
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");
    expect(wordWrapFormatToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
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
