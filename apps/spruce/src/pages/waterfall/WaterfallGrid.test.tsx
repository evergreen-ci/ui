import { Suspense, useEffect, useRef, useState } from "react";
import { ApolloClient, ApolloLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { useParams } from "react-router-dom";
import {
  act,
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { WalkthroughGuideCueRef } from "components/WalkthroughGuideCue";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { cache } from "gql/client/cache";
import {
  WaterfallOptions,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { PaginationButtons } from "./PaginationButtons";
import { getWaterfallData } from "./testData";
import { BuildVariant, Pagination } from "./types";
import WaterfallErrorBoundary from "./WaterfallErrorBoundary";
import { WaterfallGrid } from "./WaterfallGrid";

vi.mock("analytics", () => ({
  useWaterfallAnalytics: () => ({ sendEvent: vi.fn() }),
}));
vi.mock("hooks", () => ({ useUserTimeZone: () => "UTC" }));
vi.mock("hooks/useIntersectionObserver", () => ({ default: vi.fn() }));
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
vi.mock("./InactiveVersions", () => ({
  InactiveVersionsButton: ({
    versions,
  }: {
    versions: WaterfallQuery["waterfall"]["versions"];
  }) => (
    <span data-testid="inactive-versions-group">
      {versions.map(({ id }) => id).join(",")}
    </span>
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
vi.mock("@evg-ui/lib/utils/errorReporting", () => ({
  reportError: vi.fn(() => ({ warning: vi.fn() })),
}));

const baseOptions: WaterfallOptions = {
  projectIdentifier: "spruce",
  requesters: [],
  statuses: [],
  tasks: [],
  variants: [],
  includeAllBuildsAndTasks: true,
  omitInactiveBuilds: false,
  taskCaseSensitive: true,
  variantCaseSensitive: true,
  limit: 5,
  maxOrder: 0,
  minOrder: 0,
  revision: null,
};
type WaterfallMock = MockLink.MockedResponse<
  WaterfallQuery,
  WaterfallQueryVariables
>;
const makeMock = (
  options: Partial<WaterfallOptions>,
  data: WaterfallQuery,
  delay = 0,
): WaterfallMock => ({
  request: {
    query: WATERFALL,
    variables: { options: { ...baseOptions, ...options } },
  },
  result: { data },
  delay,
});

const previewData = (matchingVersions: number) => {
  const data = getWaterfallData([20, 19, 18, 17, 16]);
  data.waterfall.versions.slice(matchingVersions).forEach((version) => {
    version.waterfallBuilds?.forEach((build) => {
      build.tasks = build.tasks.filter((task) => task.displayName !== "Task A");
    });
  });
  return data;
};
const filteredOptions: Partial<WaterfallOptions> = {
  tasks: ["Task A"],
  includeAllBuildsAndTasks: false,
};
const filteredData = () =>
  getWaterfallData([20, 19, 18, 17, 15], { taskNames: ["Task A"] });

const jumpCases = [
  {
    search: "?tasks=Task%20A&date=2024-09-19",
    options: { date: new Date("2024-09-19T23:59:59Z") },
  },
  {
    search: "?tasks=Task%20A&revision=abc1234",
    options: { revision: "abc1234" },
  },
];

const skeletonMounted = vi.fn();
const Skeleton = () => {
  useEffect(() => {
    skeletonMounted();
  }, []);
  return <div data-testid="initial-skeleton" />;
};

const Harness = ({
  omitInactiveBuilds = false,
}: {
  omitInactiveBuilds?: boolean;
}) => {
  const { projectIdentifier = "spruce" } = useParams();
  const guideCueRef = useRef<WalkthroughGuideCueRef>(null);
  const [pagination, setPagination] = useState<Pagination>();
  return (
    <>
      <PaginationButtons pagination={pagination} />
      <Suspense fallback={<Skeleton />}>
        <WaterfallErrorBoundary projectIdentifier={projectIdentifier}>
          <WaterfallGrid
            key={projectIdentifier}
            guideCueRef={guideCueRef}
            omitInactiveBuilds={omitInactiveBuilds}
            projectIdentifier={projectIdentifier}
            setPagination={setPagination}
          />
        </WaterfallErrorBoundary>
      </Suspense>
    </>
  );
};

const clients: ApolloClient[] = [];
const setup = (
  mocks: WaterfallMock[],
  { omitInactiveBuilds = false, search = "" } = {},
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
  const { router } = renderWithRouterMatch(
    <ApolloProvider client={client}>
      <Harness omitInactiveBuilds={omitInactiveBuilds} />
    </ApolloProvider>,
    {
      path: "/project/:projectIdentifier/waterfall",
      route: `/project/spruce/waterfall${search}`,
    },
  );
  const navigate = async (nextSearch: string) => {
    await act(() => router.navigate(`/project/spruce/waterfall${nextSearch}`));
  };
  return { client, navigate, requests, router };
};
const versionIds = () =>
  screen
    .queryAllByTestId("version-label-active")
    .map((node) => node.textContent);
const tasks = () =>
  screen.queryAllByTestId("task").map((node) => node.textContent);
const waitForSettled = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    expect(screen.queryByTestId("initial-skeleton")).not.toBeInTheDocument();
  });
};

describe("WaterfallGrid requests", () => {
  beforeEach(() => {
    cache.restore({});
    localStorage.clear();
    skeletonMounted.mockClear();
  });
  afterEach(() => {
    clients.splice(0).forEach((client) => client.stop());
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each([{ search: "?tasks=Task%20A", options: {} }, ...jumpCases])(
    "keeps a four-version preview visible while backfilling $search",
    async ({ options, search }) => {
      const { requests } = setup(
        [
          makeMock(options, previewData(4)),
          makeMock({ ...filteredOptions, ...options }, filteredData(), 150),
        ],
        { search },
      );
      expect(screen.getByTestId("initial-skeleton")).toBeInTheDocument();
      await screen.findByTestId("fetch-more-loader");
      expect(screen.queryByTestId("initial-skeleton")).not.toBeInTheDocument();
      expect(versionIds()).toEqual([
        "version-20",
        "version-19",
        "version-18",
        "version-17",
      ]);
      expect(tasks()).toEqual(Array(4).fill("Task A"));
      expect(screen.getByTestId("next-page-button")).toBeEnabled();
      await waitForSettled();
      expect(versionIds()).toEqual([
        "version-20",
        "version-19",
        "version-18",
        "version-17",
        "version-15",
      ]);
      expect(requests).toEqual([
        { options: { ...baseOptions, ...options } },
        { options: { ...baseOptions, ...filteredOptions, ...options } },
      ]);
    },
  );

  it("does not backfill a preview with five matching versions", async () => {
    const { requests } = setup([makeMock({}, previewData(5))], {
      search: "?tasks=task%20a",
    });
    await screen.findAllByTestId("version-label-active");
    await waitForSettled();
    expect(versionIds()).toHaveLength(5);
    expect(tasks()).toEqual(Array(5).fill("Task A"));
    expect(requests).toHaveLength(1);
  });

  it("does not backfill an exhausted page and renders a local empty state", async () => {
    const data = previewData(0);
    data.waterfall.pagination.hasNextPage = false;
    data.waterfall.pagination.nextPageOrder = 0;
    const { requests } = setup([makeMock({}, data)], {
      search: "?tasks=Task%20A",
    });
    await screen.findByText("No Results Found");
    expect(requests).toHaveLength(1);
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
  });

  it("uses the newer-history flag for an initial minOrder preview", async () => {
    const data = previewData(0);
    const { requests } = setup([makeMock({ minOrder: 15 }, data)], {
      search: "?minOrder=15&tasks=Task%20A",
    });
    await screen.findByText("No Results Found");
    expect(requests).toHaveLength(1);
  });

  it("stops after one sparse server response without reapplying client filters", async () => {
    const authoritative = getWaterfallData([19, 15], {
      taskNames: ["Server-selected task"],
    });
    const { requests } = setup(
      [makeMock({}, previewData(0)), makeMock(filteredOptions, authoritative)],
      { search: "?tasks=Task%20A" },
    );
    await screen.findAllByText("Server-selected task");
    await waitForSettled();
    expect(versionIds()).toEqual(["version-19", "version-15"]);
    expect(requests).toHaveLength(2);
  });

  it("keeps an empty preview pending until the server returns the final empty window", async () => {
    const empty = getWaterfallData([], {
      pagination: { hasNextPage: true, nextPageOrder: 10 },
    });
    const { requests } = setup(
      [makeMock({}, previewData(0)), makeMock(filteredOptions, empty, 150)],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByTestId("fetch-more-loader");
    expect(screen.queryByText("No Results Found")).not.toBeInTheDocument();
    await screen.findByTestId("search-older-commits-button");
    await waitForSettled();
    expect(requests).toHaveLength(2);
  });

  it("changes filters directly after backfill while keeping the previous grid visible", async () => {
    const newOptions = { tasks: ["Task B"], includeAllBuildsAndTasks: false };
    const { navigate, requests } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, filteredData()),
        makeMock(
          newOptions,
          getWaterfallData([14, 13], { taskNames: ["Task B"] }),
          150,
        ),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-15");
    await waitForSettled();
    await navigate("?tasks=Task%20B");
    await screen.findByTestId("fetch-more-loader");
    expect(tasks()).toEqual(Array(5).fill("Task A"));
    await screen.findByText("version-14");
    await waitForSettled();
    expect(tasks()).toEqual(["Task B", "Task B"]);
    expect(requests).toHaveLength(3);
  });

  it("restores a cached unfiltered page when filters are cleared", async () => {
    const { navigate, requests } = setup(
      [makeMock({}, previewData(4)), makeMock(filteredOptions, filteredData())],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-15");
    await waitForSettled();
    await navigate("");
    await screen.findByText("version-16");
    await waitForSettled();
    expect(tasks().filter((name) => name === "Task B")).toHaveLength(5);
    expect(requests).toHaveLength(2);
  });

  it("uses identical request variables for initial and cleared filters on a cache miss", async () => {
    const { client, navigate, requests } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, filteredData()),
        makeMock({}, previewData(5)),
      ],
      { search: "?tasks=Task%20A", omitInactiveBuilds: true },
    );
    await screen.findByText("version-15");
    await waitForSettled();
    await act(async () => client.clearStore());
    await navigate("");
    await screen.findByText("version-16");
    await waitForSettled();
    expect(requests).toEqual([
      { options: baseOptions },
      { options: { ...baseOptions, ...filteredOptions } },
      { options: baseOptions },
    ]);
  });

  it("cancels pending backfill when filters are cleared", async () => {
    const { navigate, requests } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, filteredData(), 200),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByTestId("fetch-more-loader");
    await navigate("");
    await waitForSettled();
    await act(() => new Promise((resolve) => setTimeout(resolve, 250)));
    expect(versionIds()).toContain("version-16");
    expect(versionIds()).not.toContain("version-15");
    expect(tasks().filter((name) => name === "Task B")).toHaveLength(5);
    expect(requests).toHaveLength(2);
  });

  it("ignores a late response for superseded filters", async () => {
    const { navigate, requests } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, filteredData(), 250),
        makeMock(
          { tasks: ["Task C"], includeAllBuildsAndTasks: false },
          getWaterfallData([13], { taskNames: ["Task C"] }),
        ),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByTestId("fetch-more-loader");
    await navigate("?tasks=Task%20C");
    await screen.findByText("version-13");
    await waitForSettled();
    await act(() => new Promise((resolve) => setTimeout(resolve, 300)));
    expect(versionIds()).toEqual(["version-13"]);
    expect(tasks()).toEqual(["Task C"]);
    expect(requests).toHaveLength(3);
  });

  it("uses the latest filters when a pagination response is still pending", async () => {
    const { navigate, requests } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, filteredData()),
        makeMock(
          { ...filteredOptions, maxOrder: 15 },
          getWaterfallData([14, 13, 12, 11, 10], { taskNames: ["Task A"] }),
          200,
        ),
        makeMock(
          { tasks: ["Task B"], includeAllBuildsAndTasks: false, maxOrder: 15 },
          getWaterfallData([12, 11], { taskNames: ["Task B"] }),
        ),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-15");
    await navigate("?tasks=Task%20A&maxOrder=15");
    await screen.findByTestId("initial-skeleton");
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    await navigate("?tasks=Task%20B&maxOrder=15");
    expect(requests).toHaveLength(4);
    await screen.findByText("version-11");
    await waitForSettled();
    await act(() => new Promise((resolve) => setTimeout(resolve, 250)));
    expect(versionIds()).toEqual(["version-12", "version-11"]);
    expect(tasks()).toEqual(["Task B", "Task B"]);
    expect(requests).toHaveLength(4);
  });

  it("can paginate with the selected filters while backfill is pending", async () => {
    const second = getWaterfallData([15, 14, 13, 12, 11], {
      taskNames: ["Task A"],
    });
    const { requests } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, filteredData(), 250),
        makeMock({ ...filteredOptions, maxOrder: 16 }, second),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByTestId("fetch-more-loader");
    await userEvent.click(screen.getByTestId("next-page-button"));
    await screen.findByText("version-11");
    await waitForSettled();
    await act(() => new Promise((resolve) => setTimeout(resolve, 300)));
    expect(versionIds()).toEqual(second.waterfall.pagination.activeVersionIds);
    expect(tasks()).toEqual(Array(5).fill("Task A"));
    expect(requests).toEqual([
      { options: baseOptions },
      { options: { ...baseOptions, ...filteredOptions } },
      { options: { ...baseOptions, ...filteredOptions, maxOrder: 16 } },
    ]);
  });

  it("shows a skeleton for uncached next-page navigation and sends filters immediately", async () => {
    const second = getWaterfallData([15, 14, 13, 12, 11], {
      taskNames: ["Task A"],
    });
    const { requests } = setup(
      [
        makeMock({}, previewData(5)),
        makeMock({ ...filteredOptions, maxOrder: 16 }, second, 150),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-16");
    await userEvent.click(screen.getByTestId("next-page-button"));
    await screen.findByTestId("initial-skeleton");
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    expect(screen.getByText("version-20")).not.toBeVisible();
    await screen.findByText("version-11");
    await waitForSettled();
    expect(requests).toHaveLength(2);
    expect(requests[1]).toEqual({
      options: { ...baseOptions, ...filteredOptions, maxOrder: 16 },
    });
  });

  it("shows a skeleton for uncached previous-page navigation", async () => {
    const { requests } = setup(
      [
        makeMock({ maxOrder: 16 }, getWaterfallData([15, 14, 13, 12, 11])),
        makeMock({ ...filteredOptions, minOrder: 15 }, filteredData(), 150),
      ],
      { search: "?maxOrder=16&tasks=Task%20A" },
    );
    await screen.findByText("version-11");
    await userEvent.click(screen.getByTestId("prev-page-button"));
    await screen.findByTestId("initial-skeleton");
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    expect(screen.getByText("version-11")).not.toBeVisible();
    await screen.findByText("version-20");
    await waitForSettled();
    expect(requests).toHaveLength(2);
    expect(requests[1]).toEqual({
      options: { ...baseOptions, ...filteredOptions, minOrder: 15 },
    });
  });

  it("reuses full filtered results when navigating back and forth without a request", async () => {
    const first = filteredData();
    const second = getWaterfallData([14, 13, 12, 11, 10], {
      taskNames: ["Task A"],
    });
    const firstLastId =
      first.waterfall.versions[first.waterfall.versions.length - 1].id;
    const secondLastId =
      second.waterfall.versions[second.waterfall.versions.length - 1].id;
    const { requests } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, first),
        makeMock(
          {
            ...filteredOptions,
            maxOrder: first.waterfall.pagination.nextPageOrder,
          },
          second,
        ),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText(firstLastId);
    await userEvent.click(screen.getByTestId("next-page-button"));
    await screen.findByText(secondLastId);
    await waitForSettled();
    skeletonMounted.mockClear();
    await userEvent.click(screen.getByTestId("prev-page-button"));
    await screen.findByText("version-20");
    await userEvent.click(screen.getByTestId("next-page-button"));
    await screen.findByText(secondLastId);
    await waitForSettled();
    expect(requests).toHaveLength(3);
    expect(skeletonMounted).not.toHaveBeenCalled();
  });

  it.each(jumpCases)(
    "refetches $search jumps while reusing numeric cursor results",
    async ({ options, search }) => {
      const { navigate, requests } = setup(
        [
          makeMock({}, previewData(5)),
          makeMock({ ...filteredOptions, ...options }, filteredData()),
          makeMock(
            { ...filteredOptions, maxOrder: 15 },
            getWaterfallData([14, 13, 12, 11, 10], { taskNames: ["Task A"] }),
          ),
          makeMock(
            { ...filteredOptions, ...options },
            getWaterfallData([19, 18], { taskNames: ["Task A"] }),
          ),
        ],
        { search: "?tasks=Task%20A" },
      );
      await screen.findByText("version-16");
      await navigate(search);
      await screen.findByText("version-15");
      await waitForSettled();
      expect(requests).toHaveLength(2);
      expect(requests[1]).toEqual({
        options: { ...baseOptions, ...filteredOptions, ...options },
      });
      await userEvent.click(screen.getByTestId("next-page-button"));
      await screen.findByText("version-10");
      await waitForSettled();
      skeletonMounted.mockClear();
      await userEvent.click(screen.getByTestId("prev-page-button"));
      await screen.findByText("version-20");
      await waitForSettled();
      expect(requests).toEqual([
        { options: baseOptions },
        { options: { ...baseOptions, ...filteredOptions, ...options } },
        { options: { ...baseOptions, ...filteredOptions, maxOrder: 15 } },
      ]);
      expect(skeletonMounted).not.toHaveBeenCalled();
      await navigate(search);
      await waitFor(() =>
        expect(versionIds()).toEqual(["version-19", "version-18"]),
      );
      await waitForSettled();
      expect(requests).toHaveLength(4);
      expect(requests[3]).toEqual({
        options: { ...baseOptions, ...filteredOptions, ...options },
      });
    },
  );

  it.each(jumpCases)(
    "polls $search without restarting its preview",
    async ({ options, search }) => {
      vi.useFakeTimers();
      const { requests } = setup(
        [
          makeMock(options, previewData(4)),
          makeMock({ ...filteredOptions, ...options }, filteredData()),
          makeMock(
            { ...filteredOptions, ...options },
            getWaterfallData([19, 18], { taskNames: ["Updated task"] }),
          ),
        ],
        { search },
      );
      await act(() => vi.advanceTimersByTimeAsync(10));
      await act(() => vi.advanceTimersByTimeAsync(10));
      expect(versionIds()).toContain("version-15");
      await act(() => vi.advanceTimersByTimeAsync(DEFAULT_POLL_INTERVAL + 10));
      expect(tasks()).toEqual(["Updated task", "Updated task"]);
      expect(requests).toHaveLength(3);
      expect(requests[2]).toEqual({
        options: { ...baseOptions, ...filteredOptions, ...options },
      });
      expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    },
  );

  it("starts a fresh unfiltered preview on project changes", async () => {
    const { requests, router } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, filteredData()),
        makeMock({ projectIdentifier: "another-project" }, previewData(5)),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-15");
    await act(() =>
      router.navigate("/project/another-project/waterfall?tasks=Task%20A"),
    );
    await screen.findByText("version-16");
    await waitForSettled();
    expect(requests).toHaveLength(3);
    expect(requests[2]).toEqual({
      options: { ...baseOptions, projectIdentifier: "another-project" },
    });
  });

  it("keeps browser Back/Forward filter changes local while the preview is sufficient", async () => {
    const { navigate, requests, router } = setup([
      makeMock({}, previewData(5)),
    ]);
    await screen.findByText("version-16");
    skeletonMounted.mockClear();
    await navigate("?tasks=Task%20A");
    await waitForSettled();
    expect(requests).toHaveLength(1);
    await act(() => router.navigate(-1));
    await waitForSettled();
    expect(tasks().filter((name) => name === "Task B")).toHaveLength(5);
    await act(() => router.navigate(1));
    await waitForSettled();
    expect(tasks()).toEqual(Array(5).fill("Task A"));
    await navigate("?tasks=Task%20B");
    await waitForSettled();
    expect(tasks()).toEqual(Array(5).fill("Task B"));
    expect(requests).toHaveLength(1);
    expect(skeletonMounted).not.toHaveBeenCalled();
  });

  it("reuses server-filtered results for browser Back/Forward after backfill", async () => {
    const second = getWaterfallData([20, 19, 18, 17, 16], {
      taskNames: ["Task B"],
    });
    const { navigate, requests, router } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, filteredData()),
        makeMock(
          { tasks: ["Task B"], includeAllBuildsAndTasks: false },
          second,
        ),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-15");
    await waitForSettled();
    await navigate("?tasks=Task%20B");
    await screen.findByText("version-16");
    await waitForSettled();
    skeletonMounted.mockClear();
    await act(() => router.navigate(-1));
    await screen.findByText("version-15");
    await waitForSettled();
    expect(tasks()).toEqual(Array(5).fill("Task A"));
    await act(() => router.navigate(1));
    await screen.findByText("version-16");
    await waitForSettled();
    expect(tasks()).toEqual(Array(5).fill("Task B"));
    expect(requests).toHaveLength(3);
    expect(skeletonMounted).not.toHaveBeenCalled();
  });

  it("keeps another cached page available after polling the current page", async () => {
    vi.useFakeTimers();
    const second = getWaterfallData([15, 14, 13, 12, 11]);
    const { navigate, requests } = setup([
      makeMock({}, previewData(5)),
      makeMock({ maxOrder: 16 }, second),
      makeMock({ maxOrder: 16 }, second),
    ]);
    await act(() => vi.advanceTimersByTimeAsync(10));
    await navigate("?maxOrder=16");
    await act(() => vi.advanceTimersByTimeAsync(10));
    expect(versionIds()).toContain("version-11");
    await act(() => vi.advanceTimersByTimeAsync(DEFAULT_POLL_INTERVAL + 10));
    await navigate("?minOrder=15");
    expect(versionIds()).toContain("version-20");
    expect(requests).toHaveLength(3);
  });

  it.each([
    { variants: [], search: "?tasks=Task%20A", omitInactiveBuilds: false },
    {
      variants: ["variant"],
      search: "?tasks=Task%20A&buildVariants=variant",
      omitInactiveBuilds: true,
    },
  ])(
    "only sends inactive-build omission with active variant filters: $variants",
    async ({ omitInactiveBuilds, search, variants }) => {
      const { requests } = setup(
        [
          makeMock({}, previewData(4)),
          makeMock(
            { ...filteredOptions, variants, omitInactiveBuilds },
            filteredData(),
          ),
        ],
        { search, omitInactiveBuilds: true },
      );
      await screen.findByText("version-15");
      await waitForSettled();
      expect(requests[1]).toEqual({
        options: {
          ...baseOptions,
          ...filteredOptions,
          variants,
          omitInactiveBuilds,
        },
      });
    },
  );

  it("updates polled commits and retains omitted commits without restarting preview", async () => {
    vi.useFakeTimers();
    const { requests } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, filteredData()),
        makeMock(
          filteredOptions,
          getWaterfallData([19, 18], { taskNames: ["Updated task"] }),
        ),
      ],
      { search: "?tasks=Task%20A" },
    );
    await act(() => vi.advanceTimersByTimeAsync(10));
    await act(() => vi.advanceTimersByTimeAsync(10));
    expect(versionIds()).toContain("version-15");
    await act(() => vi.advanceTimersByTimeAsync(DEFAULT_POLL_INTERVAL + 10));
    expect(versionIds()).toEqual(
      filteredData().waterfall.versions.map(({ id }) => id),
    );
    expect(tasks()).toEqual([
      "Task A",
      "Updated task",
      "Updated task",
      "Task A",
      "Task A",
    ]);
    expect(requests).toHaveLength(3);
    expect(requests[2]).toEqual({
      options: { ...baseOptions, ...filteredOptions },
    });
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
  });

  it("reports a failed backfill instead of leaving the preview fetching forever", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const onError = (event: ErrorEvent) => {
      if (
        event.error instanceof Error &&
        event.error.message === "Waterfall request failed"
      ) {
        event.preventDefault();
      }
    };
    window.addEventListener("error", onError);
    const failed = makeMock(filteredOptions, filteredData(), 50);
    failed.error = new Error("Waterfall request failed");
    failed.result = undefined;
    setup([makeMock({}, previewData(4)), failed], {
      search: "?tasks=Task%20A",
    });
    await screen.findByText("Error: Waterfall request failed");
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    expect(reportError).toHaveBeenCalled();
    window.removeEventListener("error", onError);
  });
});
