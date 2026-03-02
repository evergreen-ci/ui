import { RenderFakeToastContext as InitializeFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { LogRenderingTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import PrettyPrintToggle from ".";

const wrapper = logContextWrapper();

describe("pretty print toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    InitializeFakeToastContext();
  });

  it("defaults to 'false'", () => {
    render(<PrettyPrintToggle />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should not update the URL", async () => {
    const user = userEvent.setup();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <PrettyPrintToggle />,
    );
    const { router } = render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ renderingType: LogRenderingTypes.Resmoke });
    });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");

    await user.click(prettyPrintToggle);
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "true");
    expect(localStorage.getItem("pretty-print-bookmarks")).toBe("true");
    expect(router.state.location.search).toBe("");
  });
});
