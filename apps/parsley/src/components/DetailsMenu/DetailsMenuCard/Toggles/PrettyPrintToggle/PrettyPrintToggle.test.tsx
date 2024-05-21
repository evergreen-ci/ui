import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { LogRenderingTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from "context/LogContext";
import {
  act,
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import PrettyPrintToggle from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("pretty print toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("defaults to 'false' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<PrettyPrintToggle />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<PrettyPrintToggle />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "true");
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
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("");
  });
});
