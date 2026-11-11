import { act, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import {
  filteredData,
  filteredOptions,
  getWaterfallData,
  jumpCases,
  previewData,
} from "./testData";
import {
  baseOptions,
  cachePreview,
  cleanupWaterfallGridTest,
  makeMock,
  resetWaterfallGridTest,
  setup,
  tasks,
  versionIds,
  waitForPageLoad,
} from "./WaterfallGrid.testUtils";

describe("WaterfallGrid pagination", () => {
  beforeEach(resetWaterfallGridTest);
  afterEach(cleanupWaterfallGridTest);

  it("shows a skeleton when navigating to next page", async () => {
    cachePreview({ data: previewData(5) });
    const second = getWaterfallData([15, 14, 13, 12, 11], {
      taskNames: ["Task A"],
    });
    const { requests } = setup(
      [
        makeMock({
          options: filteredOptions,
          data: getWaterfallData([20, 19, 18, 17, 16], {
            taskNames: ["Task A"],
          }),
        }),
        makeMock({
          options: { ...filteredOptions, maxOrder: 16 },
          data: second,
          delay: 150,
        }),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-16");
    await userEvent.click(screen.getByTestId("next-page-button"));
    await screen.findByTestId("initial-skeleton");
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    expect(screen.queryByText("version-20")).not.toBeInTheDocument();
    await screen.findByText("version-11");
    await waitForPageLoad();
    expect(requests).toHaveLength(2);
    expect(requests[1]).toEqual({
      options: { ...baseOptions, ...filteredOptions, maxOrder: 16 },
    });
  });

  it("shows a skeleton for uncached previous-page navigation", async () => {
    const { requests } = setup(
      [
        makeMock({
          options: { ...filteredOptions, maxOrder: 16 },
          data: getWaterfallData([15, 14, 13, 12, 11], {
            taskNames: ["Task A"],
          }),
        }),
        makeMock({
          options: { ...filteredOptions, minOrder: 15 },
          data: filteredData,
          delay: 150,
        }),
      ],
      { search: "?maxOrder=16&tasks=Task%20A" },
    );
    await screen.findByText("version-11");
    await userEvent.click(screen.getByTestId("prev-page-button"));
    await screen.findByTestId("initial-skeleton");
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    expect(screen.queryByText("version-11")).not.toBeInTheDocument();
    await screen.findByText("version-20");
    await waitForPageLoad();
    expect(requests).toHaveLength(2);
    expect(requests[1]).toEqual({
      options: { ...baseOptions, ...filteredOptions, minOrder: 15 },
    });
  });

  it("reuses full filtered results when navigating back and forth without a request", async () => {
    const first = filteredData;
    const second = getWaterfallData([14, 13, 12, 11, 10], {
      taskNames: ["Task A"],
    });
    const firstLastId =
      first.waterfall.versions[first.waterfall.versions.length - 1].id;
    const secondLastId =
      second.waterfall.versions[second.waterfall.versions.length - 1].id;
    const { requests, skeletonMounted } = setup(
      [
        makeMock({ options: filteredOptions, data: first }),
        makeMock({
          options: {
            ...filteredOptions,
            maxOrder: first.waterfall.pagination.nextPageOrder,
          },
          data: second,
        }),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText(firstLastId);
    await userEvent.click(screen.getByTestId("next-page-button"));
    await screen.findByText(secondLastId);
    await waitForPageLoad();
    skeletonMounted.mockClear();
    await userEvent.click(screen.getByTestId("prev-page-button"));
    await screen.findByText("version-20");
    await userEvent.click(screen.getByTestId("next-page-button"));
    await screen.findByText(secondLastId);
    await waitForPageLoad();
    expect(requests).toHaveLength(2);
    expect(skeletonMounted).not.toHaveBeenCalled();
  });

  it.each(jumpCases)(
    "refetches $search jumps while reusing numeric cursor results",
    async ({ options, search }) => {
      const { navigate, requests, skeletonMounted } = setup(
        [
          makeMock({ options: filteredOptions, data: filteredData }),
          makeMock({
            options: { ...filteredOptions, ...options },
            data: filteredData,
          }),
          makeMock({
            options: { ...filteredOptions, maxOrder: 15 },
            data: getWaterfallData([14, 13, 12, 11, 10], {
              taskNames: ["Task A"],
            }),
          }),
          makeMock({
            options: { ...filteredOptions, ...options },
            data: getWaterfallData([19, 18], { taskNames: ["Task A"] }),
          }),
        ],
        { search: "?tasks=Task%20A" },
      );
      await screen.findByText("version-15");
      await navigate(search);
      await screen.findByText("version-15");
      await waitForPageLoad();
      expect(requests).toHaveLength(2);
      expect(requests[1]).toEqual({
        options: { ...baseOptions, ...filteredOptions, ...options },
      });
      await userEvent.click(screen.getByTestId("next-page-button"));
      await screen.findByText("version-10");
      await waitForPageLoad();
      skeletonMounted.mockClear();
      await userEvent.click(screen.getByTestId("prev-page-button"));
      await screen.findByText("version-20");
      await waitForPageLoad();
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
      await waitForPageLoad();
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
      cachePreview({ data: previewData(4), options });
      const { requests } = setup(
        [
          makeMock({
            options: { ...filteredOptions, ...options },
            data: filteredData,
          }),
          makeMock({
            options: { ...filteredOptions, ...options },
            data: getWaterfallData([19, 18], { taskNames: ["Updated task"] }),
          }),
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
    cachePreview({ data: previewData(4) });
    const { requests, router } = setup(
      [
        makeMock({ options: filteredOptions, data: filteredData }),
        makeMock({
          options: { ...filteredOptions, projectIdentifier: "another-project" },
          data: getWaterfallData([20, 19, 18, 17, 16], {
            taskNames: ["Task A"],
          }),
          delay: 100,
        }),
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
    await waitForPageLoad();
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
    const { navigate, requests, router, skeletonMounted } = setup([
      makeMock({ options: {}, data: previewData(5) }),
      makeMock({
        options: filteredOptions,
        data: getWaterfallData([20, 19, 18, 17, 16], { taskNames: ["Task A"] }),
      }),
      makeMock({
        options: { tasks: ["Task B"], includeAllBuildsAndTasks: false },
        data: getWaterfallData([20, 19, 18, 17, 16], { taskNames: ["Task B"] }),
      }),
    ]);
    await screen.findByText("version-16");
    skeletonMounted.mockClear();
    await navigate("?tasks=Task%20A");
    await waitForPageLoad();
    expect(requests).toHaveLength(2);
    await act(() => router.navigate(-1));
    await waitForPageLoad();
    expect(tasks().filter((name) => name === "Task B")).toHaveLength(5);
    await act(() => router.navigate(1));
    await waitForPageLoad();
    expect(tasks()).toEqual(Array(5).fill("Task A"));
    await navigate("?tasks=Task%20B");
    await waitForPageLoad();
    expect(tasks()).toEqual(Array(5).fill("Task B"));
    expect(requests).toHaveLength(3);
    expect(skeletonMounted).not.toHaveBeenCalled();
  });

  it("reuses server-filtered results for browser Back/Forward after fetching more results", async () => {
    const second = getWaterfallData([20, 19, 18, 17, 16], {
      taskNames: ["Task B"],
    });
    const { navigate, requests, router, skeletonMounted } = setup(
      [
        makeMock({ options: filteredOptions, data: filteredData }),
        makeMock({
          options: { tasks: ["Task B"], includeAllBuildsAndTasks: false },
          data: second,
        }),
      ],
      { search: "?tasks=Task%20A" },
    );
    await screen.findByText("version-15");
    await waitForPageLoad();
    await navigate("?tasks=Task%20B");
    await screen.findByText("version-16");
    await waitForPageLoad();
    skeletonMounted.mockClear();
    await act(() => router.navigate(-1));
    await screen.findByText("version-15");
    await waitForPageLoad();
    expect(tasks()).toEqual(Array(5).fill("Task A"));
    await act(() => router.navigate(1));
    await screen.findByText("version-16");
    await waitForPageLoad();
    expect(tasks()).toEqual(Array(5).fill("Task B"));
    expect(requests).toHaveLength(2);
    expect(skeletonMounted).not.toHaveBeenCalled();
  });

  it("keeps another cached page available after polling the current page", async () => {
    vi.useFakeTimers();
    const second = getWaterfallData([15, 14, 13, 12, 11]);
    const { navigate, requests } = setup([
      makeMock({ options: {}, data: previewData(5) }),
      makeMock({ options: { maxOrder: 16 }, data: second }),
      makeMock({ options: { maxOrder: 16 }, data: second }),
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
          makeMock({
            options: { ...filteredOptions, variants, omitInactiveBuilds },
            data: filteredData,
          }),
        ],
        { search, omitInactiveBuilds: true },
      );
      await screen.findByText("version-15");
      await waitForPageLoad();
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
    cachePreview({ data: previewData(4) });
    const { requests } = setup(
      [
        makeMock({ options: filteredOptions, data: filteredData }),
        makeMock({
          options: filteredOptions,
          data: getWaterfallData([19, 18], { taskNames: ["Updated task"] }),
        }),
      ],
      { search: "?tasks=Task%20A" },
    );
    await act(() => vi.advanceTimersByTimeAsync(10));
    await act(() => vi.advanceTimersByTimeAsync(10));
    expect(versionIds()).toContain("version-15");
    await act(() => vi.advanceTimersByTimeAsync(DEFAULT_POLL_INTERVAL + 10));
    expect(versionIds()).toEqual(
      filteredData.waterfall.versions.map(({ id }) => id),
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
});
