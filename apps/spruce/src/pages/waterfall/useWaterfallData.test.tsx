import { ApolloClient, ApolloLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { useSearchParams } from "react-router-dom";
import {
  act,
  renderWithRouterMatch,
  screen,
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
import { version } from "./testData";
import { useWaterfallData } from "./useWaterfallData";

const baseline: WaterfallOptions = {
  projectIdentifier: "project",
  maxOrder: 0,
  minOrder: 0,
  date: null,
  revision: null,
  limit: 5,
  omitInactiveBuilds: false,
  includeAllBuildsAndTasks: false,
  requesters: [],
  statuses: [],
  tasks: [],
  variants: [],
};

const makePage = (
  orders = [20, 19, 18, 17, 16],
  taskNames = ["test", "lint"],
  activated = true,
): WaterfallQuery => ({
  waterfall: {
    __typename: "Waterfall",
    pagination: {
      __typename: "WaterfallPagination",
      activeVersionIds: orders.map((order) => `v-${order}`),
      hasNextPage: orders.length > 0 && orders[orders.length - 1] > 1,
      hasPrevPage: orders.length > 0 && orders[0] < 20,
      mostRecentVersionOrder: 20,
      nextPageOrder: orders[orders.length - 1] ?? 0,
      prevPageOrder: orders[0] === 20 ? 0 : (orders[0] ?? 0),
    },
    versions: orders.map((order) => ({
      ...version,
      __typename: "Version",
      id: `v-${order}`,
      order,
      waterfallBuilds: [
        {
          __typename: "WaterfallBuild",
          id: `build-${order}`,
          activated,
          buildVariant: "linux",
          displayName: "Linux",
          tasks: taskNames.map((displayName) => ({
            __typename: "WaterfallTask",
            id: `${order}-${displayName}`,
            displayName,
            displayStatusCache: "success",
            execution: 0,
          })),
        },
      ],
    })),
  },
});

const mockPage = (
  options: Partial<WaterfallOptions>,
  data = makePage(),
  delay = 0,
): MockLink.MockedResponse<WaterfallQuery, WaterfallQueryVariables> => ({
  request: {
    query: WATERFALL,
    variables: { options: { ...baseline, ...options } },
  },
  result: { data },
  delay,
});

const View = ({ omitInactiveBuilds = false }) => {
  const [params] = useSearchParams();
  const { activeVersionIds, buildVariants, fetchingMore, loading, settled } =
    useWaterfallData({
      options: {
        projectIdentifier: params.get("project") ?? "project",
        maxOrder: Number(params.get("maxOrder")),
        minOrder: Number(params.get("minOrder")),
        date: params.has("date") ? new Date(params.get("date")!) : null,
        revision: params.get("revision"),
        omitInactiveBuilds: params.has("omit")
          ? params.get("omit") === "true"
          : omitInactiveBuilds,
      },
      pins: [],
    });

  return loading ? (
    <div>Skeleton</div>
  ) : (
    <>
      <div data-testid="versions">{activeVersionIds.join(",")}</div>
      <div data-testid="tasks">
        {buildVariants
          .flatMap((buildVariant) =>
            buildVariant.builds.flatMap((build) =>
              build.tasks.map((task) => task.displayName),
            ),
          )
          .join(",")}
      </div>
      {fetchingMore && <div>Fetching</div>}
      {settled && <div>Settled</div>}
    </>
  );
};

const clients: ApolloClient[] = [];
const setup = (
  mocks: MockLink.MockedResponse[],
  { omitInactiveBuilds = false, route = "/" } = {},
) => {
  const requests = vi.fn();
  const client = new ApolloClient({
    cache,
    link: new ApolloLink((operation, forward) => {
      requests(operation.variables.options);
      return forward(operation);
    }).concat(new MockLink(mocks)),
  });
  clients.push(client);
  const utils = renderWithRouterMatch(
    <ApolloProvider client={client}>
      <View omitInactiveBuilds={omitInactiveBuilds} />
    </ApolloProvider>,
    { route },
  );
  const navigate = (search: string) =>
    act(async () => {
      await utils.router.navigate(`/${search}`);
    });
  return { ...utils, requests, navigate };
};

const advanceTimers = (milliseconds: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });

beforeEach(() => cache.restore({}));
afterEach(() => {
  clients.forEach((client) => client.stop());
  clients.length = 0;
  vi.useRealTimers();
});

describe("useWaterfallData", () => {
  it.each([
    {
      scenario: "five local matches",
      route: "/?tasks=test",
      omitInactiveBuilds: false,
      expectedTasks: /^test,test,test,test,test$/,
    },
    {
      scenario: "no filters despite omitInactiveBuilds being enabled",
      route: "/",
      omitInactiveBuilds: true,
      expectedTasks: /^test,lint,test,lint,test,lint,test,lint,test,lint$/,
    },
  ])(
    "loads only the unfiltered baseline with $scenario, retaining inactive builds",
    async ({ expectedTasks, omitInactiveBuilds, route }) => {
      const page = makePage(undefined, undefined, false);
      const { requests } = setup([mockPage({}, page)], {
        route,
        omitInactiveBuilds,
      });
      expect(screen.getByText("Skeleton")).toBeVisible();
      await screen.findByText("Settled");
      expect(requests).toHaveBeenCalledExactlyOnceWith(baseline);
      expect(screen.getByTestId("tasks")).toHaveTextContent(expectedTasks);
    },
  );

  it("reuses the complete baseline while changing client-only filters", async () => {
    const { navigate, requests } = setup([mockPage({})], {
      route: "/?tasks=test",
    });
    await screen.findByText("Settled");
    await navigate("?tasks=lint");
    expect(screen.getByTestId("tasks").textContent).toBe(
      Array(5).fill("lint").join(","),
    );
    await navigate("");
    expect(screen.getByTestId("tasks").textContent).toBe(
      Array(5).fill("test,lint").join(","),
    );
    expect(requests).toHaveBeenCalledExactlyOnceWith(baseline);
  });

  it.each([1, 4])(
    "keeps a %i-match preview while fetching and trusts the final server response",
    async (matchCount) => {
      const preview = makePage();
      preview.waterfall.versions.splice(
        0,
        matchCount,
        ...makePage([20, 19, 18, 17].slice(0, matchCount), ["remote"]).waterfall
          .versions,
      );
      const { requests } = setup(
        [
          mockPage({}, preview),
          // Deliberately differs from JS matching to prove it isn't reapplied.
          mockPage(
            { tasks: ["remote"] },
            makePage(undefined, ["server-match"]),
            100,
          ),
        ],
        { route: "/?tasks=remote" },
      );
      await screen.findByText("Fetching");
      expect(screen.queryByText("Skeleton")).not.toBeInTheDocument();
      expect(screen.queryByText("Settled")).not.toBeInTheDocument();
      expect(screen.getByTestId("versions").textContent).toBe(
        ["v-20", "v-19", "v-18", "v-17"].slice(0, matchCount).join(","),
      );
      expect(screen.getByTestId("tasks").textContent).toBe(
        Array(matchCount).fill("remote").join(","),
      );
      await screen.findByText("Settled");
      expect(screen.getByTestId("tasks").textContent).toBe(
        Array(5).fill("server-match").join(","),
      );
      expect(screen.getByTestId("versions").textContent).toBe(
        "v-20,v-19,v-18,v-17,v-16",
      );
      expect(requests).toHaveBeenCalledTimes(2);
    },
  );

  it("does not request more when the local search range is exhausted", async () => {
    const { requests } = setup([mockPage({}, makePage([5, 4, 3, 2, 1]))], {
      route: "/?tasks=missing",
    });
    await screen.findByText("Settled");
    expect(screen.getByTestId("versions")).toBeEmptyDOMElement();
    expect(screen.queryByText("Fetching")).not.toBeInTheDocument();
    expect(requests).toHaveBeenCalledTimes(1);
  });

  it("settles on an empty server response without requesting it repeatedly", async () => {
    const { requests } = setup(
      [mockPage({}), mockPage({ tasks: ["missing"] }, makePage([]))],
      { route: "/?tasks=missing" },
    );
    await screen.findByText("Settled");
    expect(screen.getByTestId("versions")).toBeEmptyDOMElement();
    expect(screen.queryByText("Fetching")).not.toBeInTheDocument();
    expect(requests).toHaveBeenCalledTimes(2);
  });

  it("paginates with server filters and reads a previous filtered page from cache", async () => {
    const { navigate, requests } = setup(
      [
        mockPage({}),
        mockPage({ tasks: ["remote"] }, makePage(undefined, ["remote"])),
        mockPage(
          { tasks: ["remote"], maxOrder: 16 },
          makePage([15, 14, 13, 12, 11], ["remote"]),
        ),
      ],
      { route: "/?tasks=remote" },
    );
    await screen.findByText("Settled");
    await navigate("?tasks=remote&maxOrder=16");
    await waitFor(() =>
      expect(screen.getByTestId("versions").textContent).toBe(
        "v-15,v-14,v-13,v-12,v-11",
      ),
    );
    await navigate("?tasks=remote&minOrder=15");
    await waitFor(() =>
      expect(screen.getByTestId("versions").textContent).toBe(
        "v-20,v-19,v-18,v-17,v-16",
      ),
    );
    expect(requests).toHaveBeenCalledTimes(3);
    expect(requests).toHaveBeenLastCalledWith({
      ...baseline,
      tasks: ["remote"],
      maxOrder: 16,
    });
  });

  it("does not search older versions when a backward page has reached the newest commit", async () => {
    const { requests } = setup([mockPage({ minOrder: 15 })], {
      route: "/?tasks=missing&minOrder=15",
    });
    await screen.findByText("Settled");
    expect(screen.getByTestId("versions")).toBeEmptyDOMElement();
    expect(requests).toHaveBeenCalledExactlyOnceWith({
      ...baseline,
      minOrder: 15,
    });
  });

  it.each([
    { search: "revision=abc123", options: { revision: "abc123" } },
    {
      search: "date=2025-01-01",
      options: { date: new Date("2025-01-01") },
    },
    { search: "maxOrder=21", options: { maxOrder: 21 } },
  ])(
    "preserves the $search anchor for the filtered request",
    async ({ options, search }) => {
      const { requests } = setup(
        [
          mockPage(options),
          mockPage(
            { ...options, tasks: ["remote"] },
            makePage(undefined, ["remote"]),
          ),
        ],
        { route: `/?tasks=remote&${search}` },
      );
      await screen.findByText("Settled");
      expect(requests).toHaveBeenNthCalledWith(1, {
        ...baseline,
        ...options,
      });
      expect(requests).toHaveBeenNthCalledWith(2, {
        ...baseline,
        ...options,
        tasks: ["remote"],
      });
      expect(screen.getByTestId("tasks").textContent).toBe(
        Array(5).fill("remote").join(","),
      );
    },
  );

  it.each([
    { change: "clearing", search: "", expectedTasks: "test,lint" },
    {
      change: "broadening",
      search: "?tasks=remote,lint",
      expectedTasks: "lint",
    },
  ])(
    "reloads a complete baseline rather than the server subset after $change filters",
    async ({ expectedTasks, search }) => {
      const { navigate, requests } = setup(
        [
          mockPage({}),
          mockPage({ tasks: ["remote"] }, makePage(undefined, ["remote"])),
          mockPage({}),
        ],
        { route: "/?tasks=remote" },
      );
      await screen.findByText("Settled");
      expect(screen.getByTestId("tasks").textContent).toBe(
        Array(5).fill("remote").join(","),
      );
      await navigate(search);
      await waitFor(() =>
        expect(screen.getByTestId("tasks").textContent).toBe(
          Array(5).fill(expectedTasks).join(","),
        ),
      );
      expect(requests).toHaveBeenCalledTimes(3);
      expect(requests).toHaveBeenLastCalledWith(baseline);
    },
  );

  it("does not let a superseded filtered response replace the current view", async () => {
    vi.useFakeTimers();
    const { navigate, requests } = setup(
      [
        mockPage({}),
        mockPage({ tasks: ["A"] }, makePage(undefined, ["A"]), 200),
        mockPage({ tasks: ["B"] }, makePage(undefined, ["B"]), 10),
      ],
      { route: "/?tasks=A" },
    );
    await advanceTimers(20);
    expect(screen.getByText("Fetching")).toBeVisible();
    await navigate("?tasks=B");
    await advanceTimers(50);
    expect(screen.getByTestId("tasks").textContent).toBe(
      Array(5).fill("B").join(","),
    );
    await advanceTimers(500);
    expect(screen.getByTestId("tasks").textContent).toBe(
      Array(5).fill("B").join(","),
    );
    expect(requests).toHaveBeenCalledTimes(3);
  });

  it("ignores superseded filtered responses after filters are cleared", async () => {
    vi.useFakeTimers();
    const { navigate, requests } = setup(
      [
        mockPage({}),
        mockPage({ tasks: ["A"] }, makePage(undefined, ["A"]), 200),
        mockPage({ tasks: ["B"] }, makePage(undefined, ["B"]), 200),
      ],
      { route: "/?tasks=A" },
    );
    await advanceTimers(20);
    await navigate("?tasks=B");
    await advanceTimers(20);
    await navigate("");
    await advanceTimers(500);
    expect(screen.getByTestId("tasks").textContent).toBe(
      Array(5).fill("test,lint").join(","),
    );
    expect(screen.getByText("Settled")).toBeVisible();
    expect(requests).toHaveBeenCalledTimes(3);
  });

  it("polls only the current filtered query and replaces its tasks", async () => {
    vi.useFakeTimers();
    const { requests } = setup(
      [
        mockPage({}),
        mockPage({ tasks: ["remote"] }, makePage(undefined, ["remote"])),
        mockPage({ tasks: ["remote"] }, makePage(undefined, ["updated"])),
      ],
      { route: "/?tasks=remote" },
    );
    await advanceTimers(20);
    await advanceTimers(20);
    expect(screen.getByTestId("tasks").textContent).toBe(
      Array(5).fill("remote").join(","),
    );
    await advanceTimers(DEFAULT_POLL_INTERVAL);
    expect(screen.getByTestId("tasks").textContent).toBe(
      Array(5).fill("updated").join(","),
    );
    expect(requests).toHaveBeenCalledTimes(3);
    expect(requests).toHaveBeenLastCalledWith({
      ...baseline,
      tasks: ["remote"],
    });
  });

  it("reloads when omit-inactive changes in a server-filtered view", async () => {
    const { navigate, requests } = setup(
      [
        mockPage({}),
        mockPage({ tasks: ["remote"] }, makePage(undefined, ["remote"])),
        mockPage({}),
        mockPage(
          { tasks: ["remote"], omitInactiveBuilds: true },
          makePage(undefined, ["active-only"]),
        ),
      ],
      { route: "/?tasks=remote" },
    );
    await screen.findByText("Settled");
    await navigate("?tasks=remote&omit=true");
    await waitFor(() =>
      expect(screen.getByTestId("tasks").textContent).toBe(
        Array(5).fill("active-only").join(","),
      ),
    );
    expect(requests).toHaveBeenCalledTimes(4);
    expect(requests).toHaveBeenLastCalledWith({
      ...baseline,
      tasks: ["remote"],
      omitInactiveBuilds: true,
    });
  });

  it.each([
    { tasks: ["remote"] },
    { variants: ["remote"] },
    { statuses: ["failed"] },
    { requesters: ["git_tag_request"] },
  ])(
    "sends omitInactiveBuilds only with active filters: %s",
    async (filters) => {
      const [key, values] = Object.entries(filters)[0];
      const queryParam = key === "variants" ? "buildVariants" : key;
      const { requests } = setup(
        [
          mockPage({}),
          mockPage(
            { ...filters, omitInactiveBuilds: true },
            makePage(undefined, ["server-match"]),
          ),
        ],
        { route: `/?${queryParam}=${values[0]}`, omitInactiveBuilds: true },
      );
      await screen.findByText("Settled");
      expect(requests).toHaveBeenNthCalledWith(1, baseline);
      expect(requests).toHaveBeenNthCalledWith(2, {
        ...baseline,
        ...filters,
        omitInactiveBuilds: true,
      });
    },
  );
});
