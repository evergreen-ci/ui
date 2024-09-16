import Cookie from "js-cookie";
import { MockInstance } from "vitest";
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
import { RenderFakeToastContext as InitializeFakeToastContext } from "context/toast/__mocks__";
import PrettyPrintToggle from ".";

vi.mock("js-cookie");
const mockedSet = vi.spyOn(Cookie, "set") as MockInstance;

const wrapper = logContextWrapper();

describe("pretty print toggle", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
  });

  it("defaults to 'false'", () => {
    render(<PrettyPrintToggle />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should disable the toggle if the logType is not resmoke", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <PrettyPrintToggle />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ renderingType: LogRenderingTypes.Default });
    });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-disabled", "true");
  });

  it("should not disable the toggle if the renderingType is resmoke", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <PrettyPrintToggle />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ renderingType: LogRenderingTypes.Resmoke });
    });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-disabled", "false");
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
    expect(mockedSet).toHaveBeenCalledTimes(1);
    expect(router.state.location.search).toBe("");
  });
});
