import { MockedProvider } from "@apollo/client/testing";
import { LogRenderingTypes } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { LogContextProvider, useLogContext } from "context/LogContext";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { useQueryParams } from "hooks/useQueryParam";
import { parsleySettingsMock } from "test_data/parsleySettings";
import {
  act,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import Search from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[parsleySettingsMock]}>
    <LogContextProvider>{children}</LogContextProvider>
  </MockedProvider>
);

/**
 * `renderSearch` renders the Search component while exposing some stateful hooks to interact with it.
 * @param route - the initial route to render the component at
 * @returns - hook and utils
 */
const renderSearch = (route?: string) => {
  const useCombinedHook = () => ({
    useLogContext: useLogContext(),
    useQueryParams: useQueryParams(),
  });
  const { Component: MenuComponent, hook } = renderComponentWithHook(
    useCombinedHook,
    <Search />,
  );
  const { Component } = RenderFakeToastContext(<MenuComponent />);
  const utils = render(<Component />, { route, wrapper });
  act(() => {
    hook.current.useLogContext.ingestLines(
      ["line 1", "line 2", "line 3"],
      LogRenderingTypes.Default,
    );
  });
  expect(screen.getByDataCy("searchbar-input")).not.toBeDisabled();

  return {
    hook,
    utils,
  };
};

describe("Search", () => {
  beforeAll(() => {
    stubGetClientRects();
  });
  it("renders", () => {
    renderSearch();
    expect(screen.getByDataCy("searchbar-input")).toBeInTheDocument();
  });
  it("applying a search should update the search state", async () => {
    const user = userEvent.setup();
    const { hook } = renderSearch();
    expect(screen.getByDataCy("searchbar-input")).not.toBeDisabled();
    await user.type(screen.getByDataCy("searchbar-input"), "test");
    await waitFor(() => {
      expect(hook.current.useLogContext.searchState.hasSearch).toBe(true);
    });
    expect(hook.current.useLogContext.searchState.searchTerm).toStrictEqual(
      /test/i,
    );
  });
  it("adding a filter should update the url", async () => {
    const user = userEvent.setup();
    const { hook, utils } = renderSearch();
    expect(utils.router.state.location.search).toBe("");
    await user.type(screen.getByDataCy("searchbar-input"), "test");
    await user.type(
      screen.getByDataCy("searchbar-input"),
      "{Meta>}{enter}",
      {},
    );
    expect(hook.current.useQueryParams[0][QueryParams.Filters]).toBe("100test");
    expect(utils.router.state.location.search).toBe("?filters=100test");
  });
  it("adding a highlight should update the url", async () => {
    const user = userEvent.setup();
    const { hook, utils } = renderSearch();
    expect(utils.router.state.location.search).toBe("");
    await user.click(screen.getByText("Filter"));
    await user.click(screen.getByText("Highlight"));
    await user.type(screen.getByDataCy("searchbar-input"), "test");
    await user.type(
      screen.getByDataCy("searchbar-input"),
      "{Meta>}{enter}",
      {},
    );
    expect(hook.current.useQueryParams[0][QueryParams.Highlights]).toBe("test");
    expect(utils.router.state.location.search).toBe("?highlights=test");
  });
  it("adding a filter when highlight filters is enabled should apply both", async () => {
    const user = userEvent.setup();
    const { hook, utils } = renderSearch();
    act(() => {
      hook.current.useLogContext.preferences.setHighlightFilters(true);
    });
    expect(utils.router.state.location.search).toBe("");
    await user.click(screen.getByText("Filter"));
    await user.type(screen.getByDataCy("searchbar-input"), "test");
    await user.type(
      screen.getByDataCy("searchbar-input"),
      "{Meta>}{enter}",
      {},
    );
    expect(hook.current.useQueryParams[0][QueryParams.Highlights]).toBe("test");
    expect(hook.current.useQueryParams[0][QueryParams.Filters]).toBe("100test");
    expect(utils.router.state.location.search).toBe(
      "?filters=100test&highlights=test",
    );
  });
  it("should not effect any other query params", async () => {
    const user = userEvent.setup();
    const { hook, utils } = renderSearch("/?search=test");
    act(() => {
      hook.current.useLogContext.preferences.setHighlightFilters(true);
    });
    expect(utils.router.state.location.search).toBe("?search=test");
    await user.click(screen.getByText("Filter"));
    await user.type(screen.getByDataCy("searchbar-input"), "test");
    await user.type(
      screen.getByDataCy("searchbar-input"),
      "{Meta>}{enter}",
      {},
    );
    expect(hook.current.useQueryParams[0][QueryParams.Highlights]).toBe("test");
    expect(hook.current.useQueryParams[0][QueryParams.Filters]).toBe("100test");
    expect(utils.router.state.location.search).toBe(
      "?filters=100test&highlights=test&search=test",
    );
  });
});
