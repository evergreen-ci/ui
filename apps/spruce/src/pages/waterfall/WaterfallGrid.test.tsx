import { useEffect } from "react";
import { ApolloClient, ApolloLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { cache } from "gql/client/cache";
import {
  WaterfallOptions,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { PaginationButtons } from "./PaginationButtons";
import { version } from "./testData";
import { BuildVariant, Pagination } from "./types";
import Waterfall from ".";

vi.mock("analytics", () => ({
  useWaterfallAnalytics: () => ({ sendEvent: vi.fn() }),
}));
vi.mock("hooks", () => ({ useUserTimeZone: () => "UTC" }));
vi.mock("hooks/useIntersectionObserver", () => ({ default: vi.fn() }));
vi.mock("components/Banners", () => ({
  ProjectBanner: () => null,
  RepotrackerBanner: () => null,
}));
vi.mock("components/FilterChips", () => ({
  default: () => null,
  useFilterChipQueryParams: () => ({
    chips: [],
    handleClearAll: vi.fn(),
    handleOnRemove: vi.fn(),
  }),
}));
vi.mock("./WaterfallFilters", () => ({
  WaterfallFilters: ({
    pagination,
  }: {
    pagination: Pagination | undefined;
  }) => <PaginationButtons pagination={pagination} />,
}));
vi.mock("./useWaterfallTrace", () => ({
  useWaterfallTrace: vi.fn(),
  useWaterfallNavigationTrace: vi.fn(),
  startWaterfallNavigationTrace: vi.fn(),
}));
vi.mock("./OnboardingTutorial", () => ({ OnboardingTutorial: () => null }));
vi.mock("./VersionLabel", () => ({
  VersionLabelView: { Waterfall: "waterfall" },
  VersionLabel: ({ id }: { id: string }) => (
    <span data-testid="version-label-active">{id}</span>
  ),
}));
vi.mock("./BuildRow", () => ({
  BuildRow: ({ build }: { build: BuildVariant }) => (
    <div data-testid="build-row">
      {build.builds.flatMap((b) =>
        b.tasks.map((task) => (
          <span key={task.id} data-testid="task">
            {task.displayName}
          </span>
        )),
      )}
    </div>
  ),
}));
vi.mock("./WaterfallSkeleton", () => ({
  default: function Skeleton() {
    useEffect(() => {
      skeletonMounted();
    }, []);
    return <div data-testid="waterfall-skeleton" />;
  },
}));

const skeletonMounted = vi.fn();
const baseOptions: WaterfallOptions = {
  projectIdentifier: "spruce",
  limit: 5,
  maxOrder: 0,
  minOrder: 0,
  omitInactiveBuilds: false,
  revision: null,
  requesters: [],
  statuses: [],
  tasks: [],
  variants: [],
};
type WaterfallMock = MockLink.MockedResponse<
  WaterfallQuery,
  WaterfallQueryVariables
>;
const makeData = (orders: number[]): WaterfallQuery => ({
  waterfall: {
    __typename: "Waterfall",
    pagination: {
      __typename: "WaterfallPagination",
      activeVersionIds: orders.map((order) => `version-${order}`),
      hasNextPage: orders.at(-1) !== 1,
      hasPrevPage: orders[0] !== 20,
      mostRecentVersionOrder: 20,
      nextPageOrder: orders.at(-1) === 1 ? 0 : (orders.at(-1) ?? 0),
      prevPageOrder: orders[0] === 20 ? 0 : (orders[0] ?? 0),
    },
    versions: orders.map((order) => ({
      ...version,
      __typename: "Version",
      id: `version-${order}`,
      order,
      waterfallBuilds: [
        {
          __typename: "WaterfallBuild",
          activated: true,
          buildVariant: "variant",
          displayName: "Variant",
          id: `build-${order}`,
          tasks: ["Task A", "Task B"].map((displayName) => ({
            __typename: "WaterfallTask",
            id: `task-${order}-${displayName}`,
            displayName,
            displayStatusCache: "success",
            execution: 0,
          })),
        },
      ],
    })),
  },
});
const makeMock = (
  options: Partial<WaterfallOptions>,
  orders: number[],
  delay = 0,
): WaterfallMock => ({
  request: {
    query: WATERFALL,
    variables: { options: { ...baseOptions, ...options } },
  },
  result: { data: makeData(orders) },
  delay,
});
const page1 = [20, 19, 18, 17, 16];
const page2 = [15, 14, 13, 12, 11];
const page3 = [10, 9, 8, 7, 6];
const filteredOptions = { tasks: ["Task A"] };
const path = "/project/spruce/waterfall";
const clients: ApolloClient[] = [];

const setup = (
  mocks: WaterfallMock[],
  { initialIndex = 0, searches = [""] } = {},
) => {
  const requests: Record<string, unknown>[] = [];
  const link = new ApolloLink((operation, forward) => {
    requests.push(operation.variables);
    return forward(operation);
  });
  const client = new ApolloClient({
    cache,
    link: link.concat(new MockLink(mocks)),
  });
  clients.push(client);
  const router = createMemoryRouter(
    [
      {
        path: "/project/:projectIdentifier/waterfall",
        element: (
          <ApolloProvider client={client}>
            <Waterfall />
          </ApolloProvider>
        ),
      },
    ],
    {
      initialEntries: searches.map((search) => `${path}${search}`),
      initialIndex,
    },
  );
  render(<RouterProvider router={router} />);
  const navigate = async (search: string) => {
    await act(() => router.navigate(`${path}${search}`, { replace: true }));
  };
  return { navigate, requests, router };
};
const versionIds = () =>
  screen
    .queryAllByTestId("version-label-active")
    .map((node) => node.textContent);
const expectPage = async (orders: number[]) => {
  await waitFor(() => {
    expect(screen.queryByTestId("waterfall-skeleton")).not.toBeInTheDocument();
    expect(versionIds()).toEqual(orders.map((order) => `version-${order}`));
  });
};
const expectPendingNavigation = () => {
  expect(screen.getByTestId("waterfall-skeleton")).toBeVisible();
  expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
};

describe("Waterfall navigation", () => {
  beforeEach(() => {
    cache.restore({});
    localStorage.clear();
    skeletonMounted.mockClear();
  });
  afterEach(() => {
    clients.splice(0).forEach((client) => client.stop());
    vi.useRealTimers();
  });

  it("suspends for an uncached next page, blocks stale cursors, and returns to a cached page immediately", async () => {
    const user = userEvent.setup();
    const { requests, router } = setup([
      makeMock({}, page1),
      makeMock({ maxOrder: 16 }, page2, 150),
    ]);
    await expectPage(page1);
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    const next = screen.getByRole("button", { name: "Next page" });
    await waitFor(() => expect(next).toBeEnabled());

    await user.click(next);
    expectPendingNavigation();
    await user.click(next);
    expect(router.state.location.search).toBe("?maxOrder=16");
    await expectPage(page2);
    expect(requests).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
    expect(next).toBeEnabled();

    skeletonMounted.mockClear();
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(versionIds()).toEqual(page1.map((order) => `version-${order}`));
    expect(skeletonMounted).not.toHaveBeenCalled();
    expect(requests).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    expect(next).toBeEnabled();
  });

  it("suspends for an uncached previous page and preserves last-page availability", async () => {
    const user = userEvent.setup();
    const { requests } = setup(
      [
        makeMock({ maxOrder: 6 }, [5, 4, 3, 2, 1]),
        makeMock({ minOrder: 5 }, page3, 150),
      ],
      { searches: ["?maxOrder=6"] },
    );
    await expectPage([5, 4, 3, 2, 1]);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    const previous = screen.getByRole("button", { name: "Previous page" });
    await waitFor(() => expect(previous).toBeEnabled());
    await user.click(previous);
    expectPendingNavigation();
    await expectPage(page3);
    expect(previous).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    expect(requests).toHaveLength(2);
  });

  it("retains the grid for same-page filter edits and clearing filters on an uncached page", async () => {
    const user = userEvent.setup();
    const { navigate, requests } = setup([
      makeMock({}, page1),
      makeMock(filteredOptions, page1, 150),
      makeMock({ ...filteredOptions, maxOrder: 16 }, page2),
      makeMock({ maxOrder: 16 }, page2, 150),
    ]);
    await expectPage(page1);
    skeletonMounted.mockClear();
    await navigate("?tasks=Task%20A");
    await waitFor(() => expect(requests).toHaveLength(2));
    expect(screen.queryByTestId("waterfall-skeleton")).not.toBeInTheDocument();
    expect(screen.getByTestId("version-labels")).toBeVisible();
    expect(
      screen.getAllByTestId("task").map((node) => node.textContent),
    ).not.toContain("Task B");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled(),
    );
    expect(skeletonMounted).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Next page" }));
    await expectPage(page2);
    skeletonMounted.mockClear();
    await navigate("?maxOrder=16");
    await waitFor(() => expect(requests).toHaveLength(4));
    expect(screen.queryByTestId("waterfall-skeleton")).not.toBeInTheDocument();
    expect(screen.getByTestId("version-labels")).toBeVisible();
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Previous page" }),
      ).toBeEnabled(),
    );
    expect(skeletonMounted).not.toHaveBeenCalled();
    expect(requests[3]).toEqual({
      options: { ...baseOptions, maxOrder: 16 },
    });
  });

  it("cancels a pending filter edit when filters are cleared back to cached data", async () => {
    const filteredResult = vi.fn(() => ({ data: makeData(page1) }));
    const { navigate, requests } = setup([
      makeMock({}, page1),
      { ...makeMock(filteredOptions, page1, 150), result: filteredResult },
    ]);
    await expectPage(page1);
    skeletonMounted.mockClear();
    await navigate("?tasks=Task%20A");
    await waitFor(() => expect(requests).toHaveLength(2));
    await navigate("");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled(),
    );
    expect(filteredResult).not.toHaveBeenCalled();
    expect(
      screen.getAllByTestId("task").map((node) => node.textContent),
    ).toContain("Task B");
    await waitFor(() => expect(filteredResult).toHaveBeenCalled());
    expect(skeletonMounted).not.toHaveBeenCalled();
    expect(versionIds()).toEqual(page1.map((order) => `version-${order}`));
    expect(requests).toHaveLength(2);
  });

  it("does not let a pending filter response replace a newer navigation", async () => {
    const filteredResult = vi.fn(() => ({ data: makeData(page1) }));
    const { navigate, requests } = setup([
      makeMock({}, page1),
      { ...makeMock(filteredOptions, page1, 300), result: filteredResult },
      makeMock({ maxOrder: 16 }, page2, 150),
    ]);
    await expectPage(page1);
    await navigate("?tasks=Task%20A");
    await waitFor(() => expect(requests).toHaveLength(2));
    await navigate("?maxOrder=16");
    expectPendingNavigation();
    await expectPage(page2);
    await waitFor(() => expect(filteredResult).toHaveBeenCalled());
    expect(versionIds()).toEqual(page2.map((order) => `version-${order}`));
    expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    expect(requests).toHaveLength(3);
  });

  it.each([
    {
      direction: "Back",
      delta: -1,
      search: "?tasks=Task%20A",
      options: filteredOptions,
      orders: page1,
    },
    {
      direction: "Forward",
      delta: 1,
      search: "?tasks=Task%20A",
      options: filteredOptions,
      orders: page1,
    },
    {
      direction: "Back",
      delta: -1,
      search: "?maxOrder=16",
      options: { maxOrder: 16 },
      orders: page2,
    },
    {
      direction: "Forward",
      delta: 1,
      search: "?maxOrder=16",
      options: { maxOrder: 16 },
      orders: page2,
    },
  ])(
    "treats browser $direction to $search as navigation, not a filter edit",
    async ({ delta, options, orders, search }) => {
      const { requests, router } = setup(
        [makeMock({}, page1), makeMock(options, orders, 150)],
        {
          searches: delta === -1 ? [search, ""] : ["", search],
          initialIndex: delta === -1 ? 1 : 0,
        },
      );
      await expectPage(page1);
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled(),
      );
      await act(() => router.navigate(delta));
      expectPendingNavigation();
      expect(requests[1]).toEqual({
        options: { ...baseOptions, ...options },
      });
      await expectPage(orders);
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled(),
      );

      skeletonMounted.mockClear();
      await act(() => router.navigate(-delta));
      expect(versionIds()).toEqual(page1.map((order) => `version-${order}`));
      expect(skeletonMounted).not.toHaveBeenCalled();
      expect(requests).toHaveLength(2);
    },
  );

  it.each([
    {
      name: "date",
      search: "?tasks=Task%20A&date=2024-09-19",
      options: { ...filteredOptions, date: new Date("2024-09-19T23:59:59Z") },
    },
    {
      name: "revision",
      search: "?revision=abc1234",
      options: { revision: "abc1234" },
    },
  ])(
    "disables pagination before a delayed $name jump can commit",
    async ({ options, search }) => {
      const user = userEvent.setup();
      const { navigate, requests, router } = setup(
        [
          makeMock({}, page1),
          makeMock(filteredOptions, page1),
          makeMock(options, page3, 150),
        ],
        { searches: ["?tasks=Task%20A"] },
      );
      await expectPage(page1);
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled(),
      );
      expect(requests).toHaveLength(2);

      await navigate(search);
      expectPendingNavigation();
      await user.click(screen.getByRole("button", { name: "Next page" }));
      expect(router.state.location.search).toBe(search);
      expect(requests[2]).toEqual({
        options: { ...baseOptions, ...options },
      });
      await expectPage(page3);
      expect(
        screen.getByRole("button", { name: "Previous page" }),
      ).toBeEnabled();
      expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
      expect(requests).toHaveLength(3);
    },
  );

  it("continues polling without replacing the settled grid with a skeleton", async () => {
    vi.useFakeTimers();
    const { requests } = setup([makeMock({}, page1), makeMock({}, page1)]);
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    skeletonMounted.mockClear();
    await act(() => vi.advanceTimersByTimeAsync(DEFAULT_POLL_INTERVAL));
    expect(requests).toHaveLength(2);
    expect(skeletonMounted).not.toHaveBeenCalled();
    expect(versionIds()).toEqual(page1.map((order) => `version-${order}`));
    expect(requests[1]).toEqual({ options: baseOptions });
  });
});
