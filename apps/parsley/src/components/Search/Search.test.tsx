import {
  RenderFakeToastContext,
  act,
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { LogRenderingTypes } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { logContextWrapper } from "context/LogContext/test_utils";
import Search from ".";

/**
 * `renderSearch` renders the Search component while exposing some stateful hooks to interact with it.
 * @param route - the initial route to render the component at
 * @returns - hook and utils
 */
const renderSearch = (route?: string) => {
  const { Component: MenuComponent, hook } = renderComponentWithHook(
    useLogContext,
    <Search />,
  );
  const { Component } = RenderFakeToastContext(<MenuComponent />);
  const utils = render(<Component />, { route, wrapper: logContextWrapper() });
  act(() => {
    hook.current.ingestLines(
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
      expect(hook.current.searchState.hasSearch).toBe(true);
    });
    expect(hook.current.searchState.searchTerm).toStrictEqual(/test/i);
  });
  it("adding a filter should update the url", async () => {
    const user = userEvent.setup();
    const { utils } = renderSearch();
    expect(utils.router.state.location.search).toBe("");
    await user.type(screen.getByDataCy("searchbar-input"), "test");
    await user.type(screen.getByDataCy("searchbar-input"), "{Meta>}{enter}");
    expect(utils.router.state.location.search).toBe(
      `?${QueryParams.Filters}=100test`,
    );
  });
  it("adding a highlight should update the url", async () => {
    const user = userEvent.setup();
    const { utils } = renderSearch();
    expect(utils.router.state.location.search).toBe("");
    await user.click(screen.getByText("Filter"));
    await user.click(screen.getByText("Highlight"));
    await user.type(screen.getByDataCy("searchbar-input"), "test");
    await user.type(screen.getByDataCy("searchbar-input"), "{Meta>}{enter}");
    expect(utils.router.state.location.search).toBe(
      `?${[QueryParams.Highlights]}=test`,
    );
  });
  it("adding a filter when highlight filters is enabled should apply both", async () => {
    const user = userEvent.setup();
    const { hook, utils } = renderSearch();
    act(() => {
      hook.current.preferences.setHighlightFilters(true);
    });
    expect(utils.router.state.location.search).toBe("");
    await user.click(screen.getByText("Filter"));
    await user.type(screen.getByDataCy("searchbar-input"), "test");
    await user.type(
      screen.getByDataCy("searchbar-input"),
      "{Meta>}{enter}",
      {},
    );
    expect(utils.router.state.location.search).toBe(
      `?${QueryParams.Filters}=100test&${QueryParams.Highlights}=test`,
    );
  });
  it("should not effect any other query params", async () => {
    const user = userEvent.setup();
    const { hook, utils } = renderSearch("/?search=test");
    act(() => {
      hook.current.preferences.setHighlightFilters(true);
    });
    expect(utils.router.state.location.search).toBe("?search=test");
    await user.click(screen.getByText("Filter"));
    await user.type(screen.getByDataCy("searchbar-input"), "test");
    await user.type(screen.getByDataCy("searchbar-input"), "{Meta>}{enter}");
    expect(utils.router.state.location.search).toBe(
      `?${QueryParams.Filters}=100test&${QueryParams.Highlights}=test&search=test`,
    );
  });
  it("should persist search history", async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.type(screen.getByDataCy("searchbar-input"), "test");
    await user.type(screen.getByDataCy("searchbar-input"), "{Meta>}{enter}");
    await user.type(screen.getByDataCy("searchbar-input"), "test2");
    await user.type(
      screen.getByDataCy("searchbar-input"),
      "{Meta>}{enter}",
      {},
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    expect(screen.getByText("test2")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
  });
  it("selecting a search suggestion should update the search state", async () => {
    const user = userEvent.setup();
    const { hook } = renderSearch();
    await user.type(screen.getByDataCy("searchbar-input"), "first_search");
    await user.type(screen.getByDataCy("searchbar-input"), "{Meta>}{enter}");
    await user.type(screen.getByDataCy("searchbar-input"), "second_search");
    await user.type(screen.getByDataCy("searchbar-input"), "{Meta>}{enter}");
    await user.click(screen.getByDataCy("search-suggestion-button"));
    expect(screen.getByText("first_search")).toBeInTheDocument();
    await user.click(screen.getByText("first_search"));
    expect(screen.getByText("first_search")).toBeInTheDocument();
    await waitFor(() => {
      expect(hook.current.searchState.searchTerm).toStrictEqual(
        /first_search/i,
      );
    });
  });
});
