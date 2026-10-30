import { cache } from "gql/client/cache";
import {
  WaterfallOptions,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { getWaterfallData } from "../testData";
import { getWaterfallBuildsFieldName, getWaterfallFilterKey } from "./utils";

const options: WaterfallOptions = {
  projectIdentifier: "mongodb-mongo-master",
  limit: 5,
};
const writePage = (
  data: WaterfallQuery,
  overrides: Partial<WaterfallOptions> = {},
) =>
  cache.writeQuery<WaterfallQuery, WaterfallQueryVariables>({
    query: WATERFALL,
    data,
    variables: { options: { ...options, ...overrides } },
  });
const readPage = (overrides: Partial<WaterfallOptions> = {}) =>
  cache.readQuery<WaterfallQuery, WaterfallQueryVariables>({
    query: WATERFALL,
    variables: { options: { ...options, ...overrides } },
  });

const firstPage = () => getWaterfallData([20, 19, 18, 17, 16]);
const secondPage = () => getWaterfallData([15, 14, 13, 12, 11]);
const thirdPage = () => getWaterfallData([10, 9, 8, 7, 6]);

describe("waterfall cache", () => {
  beforeEach(() => {
    cache.restore({});
  });

  it("normalizes absent filters and explicit defaults", () => {
    writePage(firstPage());
    expect(
      readPage({
        requesters: [],
        statuses: [],
        tasks: [],
        variants: [],
        includeAllBuildsAndTasks: true,
        omitInactiveBuilds: false,
        taskCaseSensitive: true,
        variantCaseSensitive: true,
      }),
    ).toEqual(firstPage());
  });

  it("keeps full and partial task lists isolated for the same version and build IDs", () => {
    const filtered = getWaterfallData([20, 19, 18, 17, 16], {
      taskNames: ["Task A"],
    });
    const filteredOptions = {
      tasks: ["Task A"],
      includeAllBuildsAndTasks: false,
    };
    writePage(firstPage());
    writePage(filtered, filteredOptions);

    expect(readPage()).toEqual(firstPage());
    expect(readPage(filteredOptions)).toEqual(filtered);
    expect(
      readPage({ ...filteredOptions, includeAllBuildsAndTasks: true }),
    ).toBeNull();
  });

  it.each([
    { statuses: ["success"] },
    { requesters: ["git_tag_request"] },
    { variants: ["variant"] },
    { omitInactiveBuilds: true },
    { taskCaseSensitive: false },
    { variantCaseSensitive: false },
    { projectIdentifier: "another-project" },
  ])("separates results for options %j", (filter) => {
    const filtered = getWaterfallData([20, 19, 18, 17, 16], {
      taskNames: ["Task B"],
    });
    writePage(firstPage());
    writePage(filtered, filter);
    expect(readPage()).toEqual(firstPage());
    expect(readPage(filter)).toEqual(filtered);
  });

  it("replaces explicit null builds without changing another filter partition", () => {
    const filteredOptions = {
      tasks: ["Task A"],
      includeAllBuildsAndTasks: false,
    };
    const filtered = firstPage();
    filtered.waterfall.versions[0].waterfallBuilds = null;
    filtered.waterfall.pagination.activeVersionIds.shift();
    writePage(firstPage());
    writePage(firstPage(), filteredOptions);
    writePage(filtered, filteredOptions);
    expect(readPage()).toEqual(firstPage());
    expect(readPage(filteredOptions)).toEqual(filtered);
  });

  it("reads two cached pages in either pagination direction", () => {
    writePage(firstPage());
    writePage(secondPage(), { maxOrder: 16 });
    expect(readPage()).toEqual(firstPage());
    expect(readPage({ minOrder: 15 })).toEqual(firstPage());
    expect(readPage({ maxOrder: 16 })).toEqual(secondPage());
  });

  it("reconstructs slices across fetched response boundaries", () => {
    writePage(firstPage());
    writePage(secondPage(), { maxOrder: 16 });
    const overlapping = getWaterfallData([17, 16, 15, 14, 13]);
    expect(readPage({ maxOrder: 18 })).toEqual(overlapping);
    expect(readPage({ minOrder: 12 })).toEqual(overlapping);
    expect(readPage({ limit: 7 })).toEqual(
      getWaterfallData([20, 19, 18, 17, 16, 15, 14]),
    );
  });

  it("bounds active versions rather than the number of responses", () => {
    for (const highest of [20, 17, 14]) {
      writePage(getWaterfallData([highest, highest - 1, highest - 2]), {
        maxOrder: highest + 1,
      });
    }
    expect(readPage()).toEqual(firstPage());
    writePage(getWaterfallData([11, 10, 9]), { maxOrder: 12 });
    expect(readPage({ maxOrder: 20 })).toBeNull();
    expect(readPage({ maxOrder: 19 })).toEqual(
      getWaterfallData([18, 17, 16, 15, 14]),
    );
    expect(readPage({ maxOrder: 14 })).toEqual(
      getWaterfallData([13, 12, 11, 10, 9]),
    );
    expect(
      cache.extract().ROOT_QUERY?.[
        `waterfall:${getWaterfallFilterKey(options)}`
      ],
    ).toMatchObject({
      coverage: [{ minOrder: 9, maxOrder: 18 }],
      versions: Array.from({ length: 10 }, (_, index) => ({
        __ref: `Version:version-${18 - index}`,
      })),
    });
  });

  it("evicts the newest page while paginating forward", () => {
    writePage(firstPage());
    writePage(secondPage(), { maxOrder: 16 });
    writePage(thirdPage(), { maxOrder: 11 });
    expect(readPage()).toBeNull();
    expect(readPage({ minOrder: 15 })).toBeNull();
    expect(readPage({ maxOrder: 16 })).toEqual(secondPage());
    expect(readPage({ maxOrder: 11 })).toEqual(thirdPage());
  });

  it("evicts the oldest page while paginating backward", () => {
    writePage(thirdPage(), { maxOrder: 11 });
    writePage(secondPage(), { minOrder: 10 });
    writePage(firstPage(), { minOrder: 15 });
    expect(readPage({ maxOrder: 11 })).toBeNull();
    expect(readPage({ maxOrder: 16 })).toEqual(secondPage());
    expect(readPage()).toEqual(firstPage());
  });

  it("retains six pages for other projects", () => {
    const projectIdentifier = "small-project";
    for (let page = 0; page < 7; page++) {
      writePage(
        getWaterfallData(
          Array.from({ length: 5 }, (_, i) => 35 - page * 5 - i),
        ),
        { projectIdentifier, maxOrder: 36 - page * 5 },
      );
    }
    expect(readPage({ projectIdentifier, maxOrder: 36 })).toBeNull();
    expect(readPage({ projectIdentifier, maxOrder: 31 })).not.toBeNull();
    expect(readPage({ projectIdentifier, maxOrder: 6 })).not.toBeNull();
  });

  it("evicts only discarded build lists in the affected partition", async () => {
    const filteredOptions = {
      tasks: ["Task A"],
      includeAllBuildsAndTasks: false,
    };
    const filtered = getWaterfallData([20, 19, 18, 17, 16], {
      taskNames: ["Task A"],
    });
    writePage(filtered, filteredOptions);
    writePage(firstPage());
    writePage(secondPage(), { maxOrder: 16 });
    writePage(thirdPage(), { maxOrder: 11 });
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(readPage(filteredOptions)).toEqual(filtered);
    const storedVersion = cache.extract()["Version:version-20"];
    expect(
      storedVersion?.[getWaterfallBuildsFieldName(options)],
    ).toBeUndefined();
    expect(
      storedVersion?.[
        getWaterfallBuildsFieldName({ ...options, ...filteredOptions })
      ],
    ).toBeDefined();
  });

  it("does not grow when polling an already cached page", () => {
    writePage(firstPage());
    writePage(secondPage(), { maxOrder: 16 });
    const before = cache.extract();
    writePage(secondPage(), { maxOrder: 16 });
    expect(cache.extract()).toEqual(before);
    expect(readPage()).toEqual(firstPage());
  });

  it("does not count a polled opposite-direction alias as an additional page", () => {
    writePage(firstPage());
    writePage(secondPage(), { maxOrder: 16 });
    writePage(firstPage(), { minOrder: 15 });
    writePage(firstPage(), { minOrder: 15 });
    expect(readPage()).toEqual(firstPage());
    expect(readPage({ maxOrder: 16 })).toEqual(secondPage());
  });

  it("reuses a complete sparse page in either direction", () => {
    const data = getWaterfallData([15, 14, 13, 12, 11], {
      pagination: { activeVersionIds: ["version-15", "version-11"] },
    });
    writePage(data, { maxOrder: 16 });
    expect(readPage({ minOrder: 10 })).toEqual(data);
    expect(readPage({ maxOrder: 16 })).toEqual(data);
  });

  it("reuses a completed empty window by its server cursors", () => {
    const data = getWaterfallData([], {
      pagination: {
        hasPrevPage: true,
        hasNextPage: true,
        prevPageOrder: 15,
        nextPageOrder: 11,
      },
    });
    writePage(data, { minOrder: 10 });
    expect(readPage({ maxOrder: 16 })).toEqual(data);
    expect(readPage({ minOrder: 10 })).toEqual(data);
  });

  it("caches an empty project without any version orders", () => {
    const data = getWaterfallData([], {
      pagination: {
        mostRecentVersionOrder: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
    writePage(data);
    expect(readPage()).toEqual(data);
  });

  it("caches an empty newer range without replacing the latest results", () => {
    const data = getWaterfallData([], {
      pagination: { hasPrevPage: false, nextPageOrder: 20 },
    });
    writePage(firstPage());
    writePage(data, { minOrder: 30 });
    expect(readPage({ minOrder: 30 })).toEqual(data);
    expect(readPage()).toEqual(firstPage());
  });

  it("caches latest results even when matches start below the latest order", () => {
    const data = getWaterfallData([15, 14]);
    writePage(data);
    expect(readPage()).toEqual(data);
  });

  it("only reuses fewer results for a larger limit when history is exhausted", () => {
    writePage(getWaterfallData([20, 19]), { limit: 2 });
    expect(readPage()).toBeNull();
    expect(readPage({ minOrder: 18 })).toEqual(getWaterfallData([20, 19]));
  });

  it("does not treat an interior slice of a full response as a completed scan", () => {
    writePage(secondPage(), { maxOrder: 16 });
    expect(readPage({ maxOrder: 14 })).toBeNull();
    expect(readPage({ minOrder: 12 })).toBeNull();
  });

  it("does not extend a sparse scan's completeness to unknown request anchors", () => {
    writePage(getWaterfallData([15, 14]), { maxOrder: 16 });
    expect(readPage({ maxOrder: 15 })).toBeNull();
    expect(readPage({ minOrder: 14 })).toBeNull();
  });

  it("keeps a small filtered payload independent of a 50,000-task preview", () => {
    const full = getWaterfallData([20, 19, 18, 17, 16], {
      taskNames: Array.from({ length: 10_000 }, (_, i) => `Task ${i}`),
    });
    const filtered = getWaterfallData([20, 19, 18, 17, 16], {
      taskNames: ["Task 0"],
    });
    const filteredOptions = {
      tasks: ["^Task 0$"],
      includeAllBuildsAndTasks: false,
    };
    writePage(full);
    writePage(filtered, filteredOptions);
    const taskCount = (data: WaterfallQuery | null) =>
      data?.waterfall.versions.reduce(
        (count, version) =>
          count +
          (version.waterfallBuilds?.reduce(
            (total, build) => total + build.tasks.length,
            0,
          ) ?? 0),
        0,
      );
    expect(taskCount(readPage())).toBe(50_000);
    expect(taskCount(readPage(filteredOptions))).toBe(5);
    expect(JSON.stringify(filtered).length).toBeLessThan(
      JSON.stringify(full).length / 1000,
    );
  });

  it("keeps inactive groups without counting them against the active-version bound", () => {
    const data = getWaterfallData([15, 14, 13, 12, 11, 10, 9], {
      pagination: {
        activeVersionIds: [15, 14, 13, 10, 9].map((n) => `version-${n}`),
      },
    });
    writePage(firstPage());
    writePage(data, { maxOrder: 16 });
    expect(readPage()).toEqual(firstPage());
    expect(readPage({ maxOrder: 16 })).toEqual(data);
  });

  it("preserves inactive groups when evicting excess active versions", () => {
    const withInactive = getWaterfallData([15, 14, 13, 12, 11, 10, 9], {
      pagination: {
        activeVersionIds: [15, 14, 13, 10, 9].map((n) => `version-${n}`),
      },
    });
    const older = getWaterfallData([8, 7, 6, 5, 4]);
    writePage(firstPage());
    writePage(withInactive, { maxOrder: 16 });
    writePage(older, { maxOrder: 9 });
    expect(readPage()).toBeNull();
    expect(readPage({ maxOrder: 16 })).toEqual(withInactive);
    expect(readPage({ minOrder: 8 })).toEqual(withInactive);
    expect(readPage({ maxOrder: 9 })).toEqual(older);
  });

  it("includes leading inactive versions when reconstructing a backward slice", () => {
    const withInactive = getWaterfallData([20, 19, 18, 17, 16, 15, 14], {
      pagination: {
        activeVersionIds: [18, 17, 16, 15, 14].map((n) => `version-${n}`),
      },
    });
    writePage(withInactive);
    writePage(getWaterfallData([13, 12, 11, 10, 9]), { maxOrder: 14 });
    expect(readPage({ minOrder: 13 })).toEqual(withInactive);
  });

  it("keeps boundary inactive groups when toggling between cached pages", () => {
    const first = getWaterfallData([20, 19, 18, 17, 16, 15, 14, 13, 12], {
      pagination: {
        activeVersionIds: [18, 17, 16, 15, 14].map((n) => `version-${n}`),
      },
    });
    const second = getWaterfallData([11, 10, 9, 8, 7, 6, 5], {
      pagination: {
        activeVersionIds: [11, 10, 9, 8, 7].map((n) => `version-${n}`),
      },
    });
    writePage(first);
    expect(readPage()).toEqual(first);
    writePage(second, { maxOrder: 12 });
    expect(readPage({ maxOrder: 12 })).toEqual(second);
    expect(readPage({ minOrder: 11 })).toEqual(first);
    expect(readPage({ maxOrder: 12 })).toEqual(second);
    const secondWithLeadingInactive = getWaterfallData(
      [13, 12, 11, 10, 9, 8, 7, 6, 5],
      {
        pagination: {
          activeVersionIds: second.waterfall.pagination.activeVersionIds,
        },
      },
    );
    expect(readPage({ minOrder: 4 })).toEqual(secondWithLeadingInactive);
    expect(readPage({ maxOrder: 14 })).toEqual(secondWithLeadingInactive);
  });

  it("includes trailing inactive versions at the end of history", () => {
    const data = getWaterfallData([7, 6, 5, 4, 3, 2, 1], {
      pagination: {
        activeVersionIds: [7, 6, 5, 4, 3].map((n) => `version-${n}`),
      },
    });
    writePage(data, { maxOrder: 8 });
    expect(readPage({ maxOrder: 8 })).toEqual(data);
  });

  it("retains inactive groups at both ends when evicting excess active versions", () => {
    const first = getWaterfallData([20, 19, 18, 17, 16]);
    const middle = getWaterfallData([15, 14, 13, 12, 11, 10, 9, 8, 7], {
      pagination: {
        activeVersionIds: [13, 12, 11, 10, 9].map((n) => `version-${n}`),
      },
    });
    const last = getWaterfallData([6, 5, 4, 3, 2, 1], {
      pagination: {
        activeVersionIds: [6, 5, 4, 3, 2].map((n) => `version-${n}`),
      },
    });
    writePage(first);
    writePage(middle, { maxOrder: 16 });
    writePage(last, { maxOrder: 7 });
    expect(readPage({ minOrder: 6 })).toEqual(middle);
    expect(readPage({ maxOrder: 16 })).toEqual(middle);
    expect(readPage({ maxOrder: 7 })).toEqual(last);

    writePage(first, { minOrder: 15 });
    expect(readPage({ maxOrder: 16 })).toEqual(middle);
    expect(readPage({ minOrder: 6 })).toEqual(middle);
    expect(readPage()).toEqual(
      getWaterfallData([20, 19, 18, 17, 16, 15, 14], {
        pagination: {
          activeVersionIds: first.waterfall.pagination.activeVersionIds,
        },
      }),
    );
    expect(readPage({ maxOrder: 7 })).toBeNull();
  });

  it.each([{ orders: [] }, { orders: [15, 14] }])(
    "caches completed sparse windows with orders $orders even when more results exist",
    ({ orders }) => {
      const data = getWaterfallData(orders, {
        pagination: { hasNextPage: true, nextPageOrder: 10 },
      });
      writePage(data, { maxOrder: 16 });
      expect(readPage({ maxOrder: 16 })).toEqual(data);
    },
  );

  it("coalesces adjacent empty scans without consuming active-version slots", () => {
    for (const maxOrder of [901, 601, 301]) {
      writePage(
        getWaterfallData([], {
          pagination: { hasNextPage: true, nextPageOrder: maxOrder - 300 },
        }),
        { maxOrder },
      );
    }
    expect(readPage({ maxOrder: 901 })).not.toBeNull();
    expect(readPage({ maxOrder: 601 })).not.toBeNull();
    expect(readPage({ maxOrder: 301 })).not.toBeNull();
    expect(
      cache.extract().ROOT_QUERY?.[
        `waterfall:${getWaterfallFilterKey(options)}`
      ],
    ).toMatchObject({ coverage: [{ minOrder: 1, maxOrder: 900 }] });
  });

  it("bounds disconnected empty coverage", () => {
    for (let i = 11; i > 0; i--) {
      writePage(
        getWaterfallData([], {
          pagination: { nextPageOrder: i * 100 - 10 },
        }),
        { maxOrder: i * 100 + 1 },
      );
    }
    expect(readPage({ maxOrder: 1101 })).toBeNull();
    expect(readPage({ maxOrder: 1001 })).not.toBeNull();
    expect(readPage({ maxOrder: 101 })).not.toBeNull();
  });

  it("does not reconstruct a page across unfetched history", () => {
    writePage(firstPage());
    writePage(thirdPage(), { maxOrder: 11 });
    expect(readPage({ maxOrder: 16 })).toBeNull();
    expect(readPage({ minOrder: 10 })).toBeNull();
  });

  it("caches date/revision results for numeric cursors, not repeated jumps", () => {
    const date = new Date("2024-09-19");
    writePage(firstPage(), { date });
    writePage(secondPage(), { revision: "revision-15" });
    expect(readPage({ date })).toBeNull();
    expect(readPage({ revision: "revision-15" })).toBeNull();
    expect(readPage({ revision: "unknown" })).toBeNull();
    expect(readPage()).toEqual(firstPage());
    expect(readPage({ minOrder: 15 })).toEqual(firstPage());
    expect(readPage({ maxOrder: 16 })).toEqual(secondPage());
  });

  it.each([{}, { maxOrder: 21 }, { minOrder: 15 }])(
    "updates returned versions without discarding other cached versions or coverage: %j",
    async (overrides) => {
      writePage(firstPage());
      writePage(secondPage(), { maxOrder: 16 });
      const refreshed = getWaterfallData([20, 19], {
        taskNames: ["Updated task"],
      });
      writePage(refreshed, overrides);
      const expected = firstPage();
      expected.waterfall.versions.splice(0, 2, ...refreshed.waterfall.versions);
      expect(readPage()).toEqual(expected);
      expect(readPage({ maxOrder: 16 })).toEqual(secondPage());
      expect(readPage({ minOrder: 15 })).toEqual(expected);
      expect(readPage({ maxOrder: 19 })).toEqual(
        getWaterfallData([18, 17, 16, 15, 14]),
      );
      await new Promise<void>((resolve) => queueMicrotask(resolve));
      expect(
        cache.extract()["Version:version-16"]?.[
          getWaterfallBuildsFieldName(options)
        ],
      ).toBeDefined();
    },
  );

  it("retains omitted versions even inside a refreshed range", () => {
    writePage(firstPage());
    const refreshed = getWaterfallData([20, 18, 16], {
      taskNames: ["Updated task"],
    });
    writePage(refreshed);
    const expected = firstPage();
    refreshed.waterfall.versions.forEach((version, index) => {
      expected.waterfall.versions[index * 2] = version;
    });
    expect(readPage()).toEqual(expected);
    expect(readPage({ minOrder: 15 })).toEqual(expected);
  });

  it("leaves cached commits unchanged after an empty refresh", () => {
    writePage(firstPage());
    writePage(
      getWaterfallData([], {
        pagination: {
          hasPrevPage: false,
          nextPageOrder: 16,
        },
      }),
    );
    expect(readPage()).toEqual(firstPage());
    expect(readPage({ minOrder: 15 })).toEqual(firstPage());
  });

  it("updates matching membership only for returned versions", () => {
    writePage(firstPage());
    const refreshed = getWaterfallData([20, 19], {
      pagination: { activeVersionIds: ["version-19"] },
      taskNames: ["Updated task"],
    });
    refreshed.waterfall.versions[0].waterfallBuilds = null;
    writePage(refreshed);
    const expected = firstPage();
    expected.waterfall.versions.splice(0, 2, ...refreshed.waterfall.versions);
    expected.waterfall.pagination.activeVersionIds.shift();
    expect(readPage({ minOrder: 15 })).toEqual(expected);

    const reactivated = getWaterfallData([20], {
      taskNames: ["Reactivated task"],
    });
    writePage(reactivated);
    expected.waterfall.versions.splice(0, 1, ...reactivated.waterfall.versions);
    expected.waterfall.pagination.activeVersionIds.unshift("version-20");
    expect(readPage()).toEqual(expected);
  });

  it("uses refreshed pagination metadata at unchanged range boundaries", () => {
    writePage(secondPage(), { maxOrder: 16 });
    const refreshed = getWaterfallData([15, 14, 13, 12, 11], {
      pagination: {
        activeVersionIds: [
          "version-14",
          "version-13",
          "version-12",
          "version-11",
        ],
        hasPrevPage: false,
        prevPageOrder: 0,
      },
    });
    refreshed.waterfall.versions[0].waterfallBuilds = null;
    writePage(refreshed, { maxOrder: 16 });
    expect(readPage({ maxOrder: 16 })).toEqual(refreshed);
    expect(readPage({ minOrder: 10 })).toEqual(refreshed);
  });

  it("stores only shared pagination metadata and no jump lookup", () => {
    const date = new Date("2024-09-19");
    writePage(firstPage(), { date });
    writePage(secondPage(), { maxOrder: 16 });
    const storedWaterfall =
      cache.extract().ROOT_QUERY?.[
        `waterfall:${getWaterfallFilterKey(options)}`
      ];
    expect(storedWaterfall).toMatchObject({
      mostRecentVersionOrder: 20,
      allActiveVersions: new Set(
        [
          ...firstPage().waterfall.versions,
          ...secondPage().waterfall.versions,
        ].map(({ id }) => id),
      ),
    });
    expect(storedWaterfall).not.toHaveProperty("anchors");
    expect(storedWaterfall).not.toHaveProperty("pagination");
  });

  it("replaces active membership for overlapping reads after refresh", () => {
    writePage(firstPage());
    writePage(firstPage(), { minOrder: 15 });
    const refreshed = firstPage();
    refreshed.waterfall.pagination.activeVersionIds.shift();
    refreshed.waterfall.versions[0].waterfallBuilds = null;
    writePage(refreshed);
    expect(readPage()).toEqual(refreshed);
    expect(readPage({ minOrder: 15 })).toEqual(refreshed);
    const storedWaterfall =
      cache.extract().ROOT_QUERY?.[
        `waterfall:${getWaterfallFilterKey(options)}`
      ];
    expect(storedWaterfall).toMatchObject({
      allActiveVersions: new Set(
        refreshed.waterfall.pagination.activeVersionIds,
      ),
      coverage: [{ minOrder: 16, maxOrder: 20 }],
      mostRecentVersionOrder:
        refreshed.waterfall.pagination.mostRecentVersionOrder,
    });
  });
});
