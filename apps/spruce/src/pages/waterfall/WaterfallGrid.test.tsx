import { Suspense, useEffect, useRef, useState } from "react";
import { ApolloClient, ApolloLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { useParams } from "react-router-dom";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
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
import * as filterHooks from "./useFilters";
import { useWaterfallTrace } from "./useWaterfallTrace";
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
vi.mock("./WaterfallSkeleton", () => ({ default: () => <Skeleton /> }));
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

const cachePreview = (
  data: WaterfallQuery,
  options: Partial<WaterfallOptions> = {},
) =>
  cache.writeQuery({
    query: WATERFALL,
    variables: { options: { ...baseOptions, ...options } },
    data,
  });

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
  const { dispatchToast } = RenderFakeToastContext();
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
  return { client, dispatchToast, navigate, requests, router };
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

  it.each([
    { search: "?tasks=Task%20A", options: {} },
    { search: "?tasks=Task%20A&maxOrder=21", options: { maxOrder: 21 } },
  ])(
    "shows four cached versions while requesting filtered results",
    async ({ options, search }) => {
      cachePreview(previewData(4), options);
      const { requests } = setup(
        [makeMock({ ...filteredOptions, ...options }, filteredData(), 150)],
        { search },
      );
      await screen.findByTestId("fetch-more-loader");
      expect(screen.queryByTestId("initial-skeleton")).not.toBeInTheDocument();
      expect(useWaterfallTrace).toHaveBeenLastCalledWith(true);
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
        { options: { ...baseOptions, ...filteredOptions, ...options } },
      ]);
    },
  );

  it("requests filtered results even when the preview has five matching versions", async () => {
    cachePreview(previewData(5));
    const options = { ...filteredOptions, tasks: ["task a"] };
    const { requests } = setup([makeMock(options, filteredData(), 100)], {
      search: "?tasks=task%20a",
    });
    expect(screen.getByTestId("fetch-more-loader")).toBeInTheDocument();
    await screen.findAllByTestId("version-label-active");
    await waitForSettled();
    expect(versionIds()).toHaveLength(5);
    expect(tasks()).toEqual(Array(5).fill("Task A"));
    expect(requests).toEqual([{ options: { ...baseOptions, ...options } }]);
  });

  it("requests filtered results directly when no preview is cached", async () => {
    const { requests } = setup(
      [makeMock(filteredOptions, filteredData(), 100)],
      {
        search: "?tasks=Task%20A",
      },
    );
    expect(screen.getByTestId("initial-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    await screen.findByText("version-15");
    await waitForSettled();
    expect(requests).toEqual([
      { options: { ...baseOptions, ...filteredOptions } },
    ]);
  });

  it.each(jumpCases)(
    "does not show an unrelated cached preview for $search",
    async ({ options, search }) => {
      cachePreview(previewData(5));
      const { requests } = setup(
        [makeMock({ ...filteredOptions, ...options }, filteredData(), 100)],
        { search },
      );
      expect(screen.getByTestId("initial-skeleton")).toBeInTheDocument();
      expect(screen.queryByText("version-20")).not.toBeInTheDocument();
      await screen.findByText("version-15");
      await waitForSettled();
      expect(requests).toEqual([
        { options: { ...baseOptions, ...filteredOptions, ...options } },
      ]);
    },
  );

  it("renders an empty state for an authoritative empty page", async () => {
    const data = getWaterfallData([], {
      pagination: { hasNextPage: false, nextPageOrder: 0 },
    });
    const { requests } = setup([makeMock(filteredOptions, data)], {
      search: "?tasks=Task%20A",
    });
    await screen.findByText("No Results Found");
    expect(requests).toHaveLength(1);
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
  });

  it("stops after one sparse server response without reapplying client filters", async () => {
    const authoritative = getWaterfallData([19, 15], {
      taskNames: ["Server-selected task"],
    });
    const { requests } = setup([makeMock(filteredOptions, authoritative)], {
      search: "?tasks=Task%20A",
    });
    await screen.findAllByText("Server-selected task");
    await waitForSettled();
    expect(versionIds()).toEqual(["version-19", "version-15"]);
    expect(requests).toHaveLength(1);
  });

  it.each([true, false])(
    "keeps an empty preview pending even when hasNextPage is %s",
    async (hasNextPage) => {
      const preview = previewData(0);
      preview.waterfall.pagination.hasNextPage = hasNextPage;
      cachePreview(preview);
      const empty = getWaterfallData([], {
        pagination: { hasNextPage: true, nextPageOrder: 10 },
      });
      const { requests } = setup([makeMock(filteredOptions, empty, 150)], {
        search: "?tasks=Task%20A",
      });
      await screen.findByTestId("fetch-more-loader");
      expect(screen.queryByText("No Results Found")).not.toBeInTheDocument();
      await screen.findByTestId("search-older-commits-button");
      await waitForSettled();
      expect(requests).toHaveLength(1);
    },
  );

  it("filters the cached preview with the latest filters while requesting results", async () => {
    cachePreview(previewData(4));
    const newOptions = { tasks: ["Task B"], includeAllBuildsAndTasks: false };
    const { navigate, requests } = setup(
      [
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
    expect(tasks()).toEqual(Array(5).fill("Task B"));
    await screen.findByText("version-14");
    await waitForSettled();
    expect(tasks()).toEqual(["Task B", "Task B"]);
    expect(requests).toHaveLength(2);
  });

  it("restores a cached unfiltered page when filters are cleared", async () => {
    cachePreview(previewData(4));
    const useFiltersSpy = vi.spyOn(filterHooks, "useFilters");
    const { navigate, requests } = setup(
      [makeMock(filteredOptions, filteredData())],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-15");
    await waitForSettled();
    expect(useFiltersSpy).toHaveBeenCalledWith(
      expect.objectContaining({ serverFiltered: true }),
    );
    await navigate("");
    await screen.findByText("version-16");
    await waitForSettled();
    expect(tasks().filter((name) => name === "Task B")).toHaveLength(5);
    expect(useFiltersSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ serverFiltered: false }),
    );
    expect(requests).toHaveLength(1);
  });

  it.each([
    { search: "?maxOrder=16", options: { maxOrder: 16 } },
    {
      search: "?date=2024-09-19",
      options: { date: new Date("2024-09-19T23:59:59Z") },
    },
    { search: "?revision=revision-15", options: { revision: "revision-15" } },
  ])(
    "does not mark an unfiltered search as server-filtered",
    async ({ options, search }) => {
      const useFiltersSpy = vi.spyOn(filterHooks, "useFilters");
      const { navigate, requests } = setup([
        makeMock({}, previewData(5)),
        makeMock(options, getWaterfallData([15, 14, 13, 12, 11])),
      ]);
      await screen.findByText("version-16");
      await navigate(search);
      await screen.findByText("version-11");
      await waitForSettled();
      expect(useFiltersSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ serverFiltered: false }),
      );
      expect(requests).toEqual([
        { options: baseOptions },
        { options: { ...baseOptions, ...options } },
      ]);
    },
  );

  it("uses identical request variables for initial and cleared filters on a cache miss", async () => {
    const { client, navigate, requests } = setup(
      [
        makeMock({}, previewData(4)),
        makeMock(filteredOptions, filteredData()),
        makeMock({}, previewData(5)),
      ],
      { omitInactiveBuilds: true },
    );
    await screen.findByText("version-16");
    await navigate("?tasks=Task%20A");
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

  it("ignores a pending filtered response when filters are cleared", async () => {
    cachePreview(previewData(4));
    const { navigate, requests } = setup(
      [
        makeMock(filteredOptions, filteredData(), 200),
        makeMock(
          { tasks: ["Task B"], includeAllBuildsAndTasks: false },
          getWaterfallData([20, 19, 18, 17, 16], { taskNames: ["Task B"] }),
        ),
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
    expect(requests).toHaveLength(1);
    await navigate("?tasks=Task%20B");
    await waitForSettled();
    expect(tasks()).toEqual(Array(5).fill("Task B"));
    expect(requests).toHaveLength(2);
  });

  it("uses the latest filters when a pagination response is still pending", async () => {
    const { navigate, requests } = setup(
      [
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
    expect(requests).toHaveLength(3);
    await screen.findByText("version-11");
    await waitForSettled();
    await act(() => new Promise((resolve) => setTimeout(resolve, 250)));
    expect(versionIds()).toEqual(["version-12", "version-11"]);
    expect(tasks()).toEqual(["Task B", "Task B"]);
    expect(requests).toHaveLength(3);
  });

  it("shows a skeleton when navigating to next page", async () => {
    cachePreview(previewData(5));
    const second = getWaterfallData([15, 14, 13, 12, 11], {
      taskNames: ["Task A"],
    });
    const { requests } = setup(
      [
        makeMock(
          filteredOptions,
          getWaterfallData([20, 19, 18, 17, 16], {
            taskNames: ["Task A"],
          }),
        ),
        makeMock({ ...filteredOptions, maxOrder: 16 }, second, 150),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-16");
    await userEvent.click(screen.getByTestId("next-page-button"));
    await screen.findByTestId("initial-skeleton");
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    expect(screen.queryByText("version-20")).not.toBeInTheDocument();
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
        makeMock(
          { ...filteredOptions, maxOrder: 16 },
          getWaterfallData([15, 14, 13, 12, 11], {
            taskNames: ["Task A"],
          }),
        ),
        makeMock({ ...filteredOptions, minOrder: 15 }, filteredData(), 150),
      ],
      { search: "?maxOrder=16&tasks=Task%20A" },
    );
    await screen.findByText("version-11");
    await userEvent.click(screen.getByTestId("prev-page-button"));
    await screen.findByTestId("initial-skeleton");
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    expect(screen.queryByText("version-11")).not.toBeInTheDocument();
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
    expect(requests).toHaveLength(2);
    expect(skeletonMounted).not.toHaveBeenCalled();
  });

  it.each(jumpCases)(
    "refetches $search jumps while reusing numeric cursor results",
    async ({ options, search }) => {
      const { navigate, requests } = setup(
        [
          makeMock(filteredOptions, filteredData()),
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
      await screen.findByText("version-15");
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
        { options: { ...baseOptions, ...filteredOptions } },
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
    "polls $search without falling back to a preview",
    async ({ options, search }) => {
      vi.useFakeTimers();
      cachePreview(previewData(4), options);
      const { requests } = setup(
        [
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
      expect(requests).toHaveLength(2);
      expect(requests[1]).toEqual({
        options: { ...baseOptions, ...filteredOptions, ...options },
      });
      expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    },
  );

  it("does not reuse another project's cached preview", async () => {
    cachePreview(previewData(4));
    const { requests, router } = setup(
      [
        makeMock(filteredOptions, filteredData()),
        makeMock(
          { ...filteredOptions, projectIdentifier: "another-project" },
          getWaterfallData([20, 19, 18, 17, 16], {
            taskNames: ["Task A"],
          }),
          100,
        ),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-15");
    await act(() =>
      router.navigate("/project/another-project/waterfall?tasks=Task%20A"),
    );
    expect(screen.getByTestId("initial-skeleton")).toBeInTheDocument();
    expect(screen.queryByText("version-15")).not.toBeInTheDocument();
    await screen.findByText("version-16");
    await waitForSettled();
    expect(requests).toHaveLength(2);
    expect(requests[1]).toEqual({
      options: {
        ...baseOptions,
        ...filteredOptions,
        projectIdentifier: "another-project",
      },
    });
  });

  it("reuses cached filtered results for browser Back/Forward without flashing a skeleton", async () => {
    const { navigate, requests, router } = setup([
      makeMock({}, previewData(5)),
      makeMock(
        filteredOptions,
        getWaterfallData([20, 19, 18, 17, 16], { taskNames: ["Task A"] }),
      ),
      makeMock(
        { tasks: ["Task B"], includeAllBuildsAndTasks: false },
        getWaterfallData([20, 19, 18, 17, 16], { taskNames: ["Task B"] }),
      ),
    ]);
    await screen.findByText("version-16");
    skeletonMounted.mockClear();
    await navigate("?tasks=Task%20A");
    await waitForSettled();
    expect(requests).toHaveLength(2);
    await act(() => router.navigate(-1));
    await waitForSettled();
    expect(tasks().filter((name) => name === "Task B")).toHaveLength(5);
    await act(() => router.navigate(1));
    await waitForSettled();
    expect(tasks()).toEqual(Array(5).fill("Task A"));
    await navigate("?tasks=Task%20B");
    await waitForSettled();
    expect(tasks()).toEqual(Array(5).fill("Task B"));
    expect(requests).toHaveLength(3);
    expect(skeletonMounted).not.toHaveBeenCalled();
  });

  it("reuses server-filtered results for browser Back/Forward after fetching more results", async () => {
    const second = getWaterfallData([20, 19, 18, 17, 16], {
      taskNames: ["Task B"],
    });
    const { navigate, requests, router } = setup(
      [
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
    expect(requests).toHaveLength(2);
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
          makeMock(
            { ...filteredOptions, variants, omitInactiveBuilds },
            filteredData(),
          ),
        ],
        { search, omitInactiveBuilds: true },
      );
      await screen.findByText("version-15");
      await waitForSettled();
      expect(requests).toEqual([
        {
          options: {
            ...baseOptions,
            ...filteredOptions,
            variants,
            omitInactiveBuilds,
          },
        },
      ]);
    },
  );

  it("updates polled commits and retains omitted commits without restarting preview", async () => {
    vi.useFakeTimers();
    cachePreview(previewData(4));
    const { requests } = setup(
      [
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
    expect(requests).toHaveLength(2);
    expect(requests[1]).toEqual({
      options: { ...baseOptions, ...filteredOptions },
    });
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
  });

  it.each(["initial", "preview", "pagination"])(
    "toasts a failed %s GraphQL request without throwing or logging again",
    async (request) => {
      const consoleError = vi.spyOn(console, "error");
      vi.mocked(reportError).mockClear();
      if (request !== "initial") {
        cachePreview(previewData(request === "pagination" ? 5 : 4));
      }
      const options = {
        ...filteredOptions,
        ...(request === "pagination" ? { maxOrder: 16 } : {}),
      };
      const failed = makeMock(options, filteredData(), 50);
      failed.result = { errors: [{ message: "Waterfall request failed" }] };
      const { dispatchToast, navigate } = setup(
        [
          ...(request === "pagination"
            ? [
                makeMock(
                  filteredOptions,
                  getWaterfallData([20, 19, 18, 17, 16], {
                    taskNames: ["Task A"],
                  }),
                ),
              ]
            : []),
          failed,
        ],
        { search: "?tasks=Task%20A" },
      );
      if (request === "pagination") {
        await screen.findByText("version-16");
        await navigate("?tasks=Task%20A&maxOrder=16");
      }
      await waitFor(() =>
        expect(dispatchToast.error).toHaveBeenCalledWith(
          "Unable to load waterfall: Waterfall request failed",
        ),
      );
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
      expect(screen.queryByTestId("initial-skeleton")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Oops! Something went wrong."),
      ).not.toBeInTheDocument();
      expect(reportError).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
      if (request !== "initial") {
        await navigate("");
        await screen.findByText("version-16");
        await waitForSettled();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      }
    },
  );
});
