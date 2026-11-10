import { act, screen } from "@evg-ui/lib/test_utils";
import {
  filteredData,
  filteredOptions,
  getWaterfallData,
  jumpCases,
  previewData,
} from "./testData";
import * as filterHooks from "./useFilters";
import {
  baseOptions,
  cachePreview,
  cleanupWaterfallGridTest,
  makeMock,
  resetWaterfallGridTest,
  setup,
  tasks,
  useWaterfallTrace,
  versionIds,
  waitForPageLoad,
} from "./WaterfallGrid.testUtils";

describe("WaterfallGrid filtering", () => {
  beforeEach(resetWaterfallGridTest);
  afterEach(cleanupWaterfallGridTest);

  it.each([
    { search: "?tasks=Task%20A", options: {} },
    { search: "?tasks=Task%20A&maxOrder=21", options: { maxOrder: 21 } },
  ])(
    "shows four cached versions while requesting filtered results",
    async ({ options, search }) => {
      cachePreview({ data: previewData(4), options });
      const { requests } = setup(
        [
          makeMock({
            options: { ...filteredOptions, ...options },
            data: filteredData,
            delay: 150,
          }),
        ],
        { search },
      );
      await screen.findByTestId("fetch-more-loader");
      expect(screen.queryByTestId("initial-skeleton")).not.toBeInTheDocument();
      expect(useWaterfallTrace).toHaveBeenLastCalledWith({
        data: expect.any(Object),
        error: undefined,
      });
      expect(versionIds()).toEqual([
        "version-20",
        "version-19",
        "version-18",
        "version-17",
      ]);
      expect(tasks()).toEqual(Array(4).fill("Task A"));
      expect(screen.getByTestId("next-page-button")).toBeEnabled();
      await waitForPageLoad();
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
    cachePreview({ data: previewData(5) });
    const options = { ...filteredOptions, tasks: ["task a"] };
    const { requests } = setup(
      [makeMock({ options, data: filteredData, delay: 100 })],
      {
        search: "?tasks=task%20a",
      },
    );
    expect(screen.getByTestId("fetch-more-loader")).toBeInTheDocument();
    await screen.findAllByTestId("version-label-active");
    await waitForPageLoad();
    expect(versionIds()).toHaveLength(5);
    expect(tasks()).toEqual(Array(5).fill("Task A"));
    expect(requests).toEqual([{ options: { ...baseOptions, ...options } }]);
  });

  it("requests filtered results directly when no preview is cached", async () => {
    const { requests } = setup(
      [makeMock({ options: filteredOptions, data: filteredData, delay: 100 })],
      {
        search: "?tasks=Task%20A",
      },
    );
    expect(screen.getByTestId("initial-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    await screen.findByText("version-15");
    await waitForPageLoad();
    expect(requests).toEqual([
      { options: { ...baseOptions, ...filteredOptions } },
    ]);
  });

  it.each(jumpCases)(
    "does not show an unrelated cached preview for $search",
    async ({ options, search }) => {
      cachePreview({ data: previewData(5) });
      const { requests } = setup(
        [
          makeMock({
            options: { ...filteredOptions, ...options },
            data: filteredData,
            delay: 100,
          }),
        ],
        { search },
      );
      expect(screen.getByTestId("initial-skeleton")).toBeInTheDocument();
      expect(screen.queryByText("version-20")).not.toBeInTheDocument();
      await screen.findByText("version-15");
      await waitForPageLoad();
      expect(requests).toEqual([
        { options: { ...baseOptions, ...filteredOptions, ...options } },
      ]);
    },
  );

  it("renders an empty state for an empty filtered response", async () => {
    const data = getWaterfallData([], {
      pagination: { hasNextPage: false, nextPageOrder: 0 },
    });
    const { requests } = setup(
      [makeMock({ options: filteredOptions, data: data })],
      {
        search: "?tasks=Task%20A",
      },
    );
    await screen.findByText("No Results Found");
    expect(requests).toHaveLength(1);
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
  });

  it("stops after one sparse server response without reapplying client filters", async () => {
    const authoritative = getWaterfallData([19, 15], {
      taskNames: ["Server-selected task"],
    });
    const { requests } = setup(
      [makeMock({ options: filteredOptions, data: authoritative })],
      {
        search: "?tasks=Task%20A",
      },
    );
    await screen.findAllByText("Server-selected task");
    await waitForPageLoad();
    expect(versionIds()).toEqual(["version-19", "version-15"]);
    expect(requests).toHaveLength(1);
  });

  it.each([true, false])(
    "keeps an empty preview pending even when hasNextPage is %s",
    async (hasNextPage) => {
      const preview = previewData(0);
      preview.waterfall.pagination.hasNextPage = hasNextPage;
      cachePreview({ data: preview });
      const empty = getWaterfallData([], {
        pagination: { hasNextPage: true, nextPageOrder: 10 },
      });
      const { requests } = setup(
        [makeMock({ options: filteredOptions, data: empty, delay: 150 })],
        {
          search: "?tasks=Task%20A",
        },
      );
      await screen.findByTestId("fetch-more-loader");
      expect(screen.queryByText("No Results Found")).not.toBeInTheDocument();
      await screen.findByTestId("search-older-commits-button");
      await waitForPageLoad();
      expect(requests).toHaveLength(1);
    },
  );

  it("filters the cached preview with the latest filters while requesting results", async () => {
    cachePreview({ data: previewData(4) });
    const newOptions = { tasks: ["Task B"], includeAllBuildsAndTasks: false };
    const { navigate, requests } = setup(
      [
        makeMock({ options: filteredOptions, data: filteredData }),
        makeMock({
          options: newOptions,
          data: getWaterfallData([14, 13], { taskNames: ["Task B"] }),
          delay: 150,
        }),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-15");
    await waitForPageLoad();
    await navigate("?tasks=Task%20B");
    await screen.findByTestId("fetch-more-loader");
    expect(tasks()).toEqual(Array(5).fill("Task B"));
    await screen.findByText("version-14");
    await waitForPageLoad();
    expect(tasks()).toEqual(["Task B", "Task B"]);
    expect(requests).toHaveLength(2);
  });

  it("restores a cached unfiltered page when filters are cleared", async () => {
    cachePreview({ data: previewData(4) });
    const useFiltersSpy = vi.spyOn(filterHooks, "useFilters");
    const { navigate, requests } = setup(
      [makeMock({ options: filteredOptions, data: filteredData })],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-15");
    await waitForPageLoad();
    expect(useFiltersSpy).toHaveBeenCalledWith(
      expect.objectContaining({ serverFiltered: true }),
    );
    await navigate("");
    await screen.findByText("version-16");
    await waitForPageLoad();
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
        makeMock({ options: {}, data: previewData(5) }),
        makeMock({
          options,
          data: getWaterfallData([15, 14, 13, 12, 11]),
        }),
      ]);
      await screen.findByText("version-16");
      await navigate(search);
      await screen.findByText("version-11");
      await waitForPageLoad();
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
        makeMock({ options: {}, data: previewData(4) }),
        makeMock({ options: filteredOptions, data: filteredData }),
        makeMock({ options: {}, data: previewData(5) }),
      ],
      { omitInactiveBuilds: true },
    );
    await screen.findByText("version-16");
    await navigate("?tasks=Task%20A");
    await screen.findByText("version-15");
    await waitForPageLoad();
    await act(async () => client.clearStore());
    await navigate("");
    await screen.findByText("version-16");
    await waitForPageLoad();
    expect(requests).toEqual([
      { options: baseOptions },
      { options: { ...baseOptions, ...filteredOptions } },
      { options: baseOptions },
    ]);
  });

  it("ignores a pending filtered response when filters are cleared", async () => {
    cachePreview({ data: previewData(4) });
    const { navigate, requests } = setup(
      [
        makeMock({ options: filteredOptions, data: filteredData, delay: 200 }),
        makeMock({
          options: { tasks: ["Task B"], includeAllBuildsAndTasks: false },
          data: getWaterfallData([20, 19, 18, 17, 16], {
            taskNames: ["Task B"],
          }),
        }),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByTestId("fetch-more-loader");
    await navigate("");
    await waitForPageLoad();
    await act(() => new Promise((resolve) => setTimeout(resolve, 250)));
    expect(versionIds()).toContain("version-16");
    expect(versionIds()).not.toContain("version-15");
    expect(tasks().filter((name) => name === "Task B")).toHaveLength(5);
    expect(requests).toHaveLength(1);
    await navigate("?tasks=Task%20B");
    await waitForPageLoad();
    expect(tasks()).toEqual(Array(5).fill("Task B"));
    expect(requests).toHaveLength(2);
  });

  it("uses the latest filters when a pagination response is still pending", async () => {
    const { navigate, requests } = setup(
      [
        makeMock({ options: filteredOptions, data: filteredData }),
        makeMock({
          options: { ...filteredOptions, maxOrder: 15 },
          data: getWaterfallData([14, 13, 12, 11, 10], {
            taskNames: ["Task A"],
          }),
          delay: 200,
        }),
        makeMock({
          options: {
            tasks: ["Task B"],
            includeAllBuildsAndTasks: false,
            maxOrder: 15,
          },
          data: getWaterfallData([12, 11], { taskNames: ["Task B"] }),
        }),
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
    await waitForPageLoad();
    await act(() => new Promise((resolve) => setTimeout(resolve, 250)));
    expect(versionIds()).toEqual(["version-12", "version-11"]);
    expect(tasks()).toEqual(["Task B", "Task B"]);
    expect(requests).toHaveLength(3);
  });
});
