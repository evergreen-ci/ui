import { act, waitFor } from "@testing-library/react";
import {
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { useQueryParam } from "hooks/useQueryParam";
import DetailsMenu from ".";

/**
 * `renderDetailsMenu` renders the details menu with the default open prop
 * @returns - hook and utils
 */
const renderDetailsMenu = () => {
  const useCombinedHook = () => ({
    useLogContext: useLogContext(),
    useQueryParam: useQueryParam<number | undefined>(
      QueryParams.UpperRange,
      undefined,
    ),
  });
  const { Component: DetailsMenuComponent, hook } = renderComponentWithHook(
    useCombinedHook,
    <DetailsMenu disabled={false} />,
  );
  const { Component } = RenderFakeToastContext(<DetailsMenuComponent />);
  const utils = render(<Component />, {
    wrapper: logContextWrapper([
      "line 1",
      "line 2",
      "line 3",
      "line 4",
      "line 5",
      "line 6",
      "line 7",
    ]),
  });
  return {
    hook,
    utils,
  };
};

describe("detailsMenu", () => {
  it("should render a details menu button", () => {
    renderDetailsMenu();
    expect(screen.getByText("Details")).toBeInTheDocument();
  });
  it("clicking on the details menu button should open the details menu", async () => {
    const user = userEvent.setup();

    renderDetailsMenu();
    expect(screen.queryByDataCy("details-menu")).not.toBeInTheDocument();
    const detailsButton = screen.getByRole("button", {
      name: "Details",
    });
    expect(detailsButton).toBeEnabled();
    await user.click(detailsButton);
    expect(screen.getByDataCy("details-menu")).toBeInTheDocument();
  });
  it("updating search range should flash the details button", async () => {
    vi.useFakeTimers();

    const { hook } = renderDetailsMenu();
    expect(screen.queryByDataCy("details-menu")).not.toBeInTheDocument();
    const detailsButton = screen.getByRole("button", {
      name: "Details",
    });
    expect(detailsButton).toBeEnabled();
    expect(detailsButton).toHaveAttribute("data-variant", "default");
    act(() => {
      hook.current.useQueryParam[1](1);
    });
    expect(detailsButton).toHaveAttribute("data-variant", "primary");
    vi.runAllTimers();
    await waitFor(() => {
      expect(detailsButton).toHaveAttribute("data-variant", "default");
    });
  });
});
