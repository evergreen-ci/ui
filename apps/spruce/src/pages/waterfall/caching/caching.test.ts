import { InMemoryCache, gql } from "@apollo/client";
import {
  FieldFunctionOptions,
  FieldMergeFunctionOptions,
} from "@apollo/client/cache";
import { cacheConfig } from "gql/client/cache";
import { WaterfallOptions, WaterfallQuery } from "gql/generated/types";
import { CachedWaterfall } from "./utils";
import { mergeVersions, readVersions } from ".";

type Waterfall = WaterfallQuery["waterfall"];

// @ts-expect-error: the cache tests only use plain objects.
const readField = (field, obj) => obj[field];

const makePage = (orders: number[]) => {
  const activeVersionIds = orders.map((order) => `version-${order}`);
  return {
    pagination: {
      activeVersionIds,
      hasNextPage: true,
      hasPrevPage: true,
      mostRecentVersionOrder: 20,
      nextPageOrder: Math.min(...orders) - 1,
      prevPageOrder: Math.max(...orders) + 1,
    },
    versions: orders.map((order) => ({
      id: `version-${order}`,
      order,
    })),
  } as Waterfall;
};

const page1 = makePage([20, 19, 18, 17, 16]);
const page2 = makePage([15, 14, 13, 12, 11]);
const page3 = makePage([10, 9, 8, 7, 6]);

const mergePage = (
  existing: CachedWaterfall | undefined,
  incoming: Waterfall,
  options: Record<string, unknown> = {},
) => {
  const { cache, ...cacheOptions } = options;
  return mergeVersions(existing, incoming, {
    args: {
      options: {
        limit: 5,
        projectIdentifier: "mongodb-mongo-master",
        ...cacheOptions,
      },
    },
    cache,
    readField,
  } as unknown as FieldMergeFunctionOptions);
};

const readPage = (
  existing: CachedWaterfall,
  options: Record<string, unknown> = {},
) =>
  readVersions(existing, {
    args: { options: { limit: 5, ...options } },
    readField,
  } as unknown as FieldFunctionOptions);

const getVersionIds = (cache: Waterfall) => cache.versions.map(({ id }) => id);

const query = gql`
  query CachedWaterfall($options: WaterfallOptions!) {
    waterfall(options: $options) {
      pagination {
        activeVersionIds
        hasNextPage
        hasPrevPage
        mostRecentVersionOrder
        nextPageOrder
        prevPageOrder
      }
      versions {
        id
        order
        waterfallBuilds {
          id
          tasks {
            id
            displayName
          }
        }
      }
    }
  }
`;

const makeBuild = (id: string, taskIds: string[]) => ({
  __typename: "WaterfallBuild" as const,
  activated: true,
  buildVariant: id,
  displayName: id,
  id,
  tasks: taskIds.map((taskId) => ({
    __typename: "WaterfallTask" as const,
    id: taskId,
    displayName: taskId,
    displayStatusCache: "success",
    execution: 0,
  })),
});

const makeNormalizedPage = (orders: number[]): Waterfall => {
  const page = makePage(orders);
  return {
    ...page,
    __typename: "Waterfall",
    pagination: {
      ...page.pagination,
      __typename: "WaterfallPagination",
    },
    versions: page.versions.map((version) => ({
      ...version,
      __typename: "Version",
      waterfallBuilds: [
        makeBuild(`build-${version.order}`, ["task-a", "task-b"]),
      ],
    })),
  };
};

describe("normalized waterfall cache", () => {
  let cache: InMemoryCache;
  const defaultOptions: WaterfallOptions = {
    projectIdentifier: "mongodb-mongo-master",
    includeAllBuildsAndTasks: false,
    limit: 5,
  };
  const write = (
    waterfall: Waterfall,
    options: Partial<WaterfallOptions> = {},
  ) =>
    cache.writeQuery({
      query,
      data: { waterfall },
      variables: { options: { ...defaultOptions, ...options } },
    });
  const read = (options: Partial<WaterfallOptions> = {}) =>
    cache.readQuery<WaterfallQuery>({
      query,
      variables: { options: { ...defaultOptions, ...options } },
    })?.waterfall;

  beforeEach(() => {
    cache = new InMemoryCache(cacheConfig);
  });

  it("replaces builds and tasks instead of merging full and filtered payloads", () => {
    const page = makeNormalizedPage([20]);
    page.versions[0].waterfallBuilds?.push(
      makeBuild("removed-build", ["removed-task"]),
    );
    write(page);

    const subset = makeNormalizedPage([20]);
    subset.versions[0].waterfallBuilds = [makeBuild("build-20", ["task-b"])];
    const filters = { tasks: ["task-b"], omitInactiveBuilds: true };
    write(subset, filters);

    const builds = read(filters)?.versions[0].waterfallBuilds;
    expect(builds?.map(({ id }) => id)).toStrictEqual(["build-20"]);
    expect(builds?.[0].tasks.map(({ id }) => id)).toStrictEqual(["task-b"]);
    expect(read()).toBeUndefined();

    subset.versions[0].waterfallBuilds = [makeBuild("build-20", [])];
    write(subset, filters);
    expect(read(filters)?.versions[0].waterfallBuilds?.[0].tasks).toStrictEqual(
      [],
    );

    subset.versions[0].waterfallBuilds = null;
    write(subset, filters);
    expect(read(filters)?.versions[0].waterfallBuilds).toBeNull();

    subset.versions[0].waterfallBuilds = [];
    write(subset, filters);
    expect(read(filters)?.versions[0].waterfallBuilds).toStrictEqual([]);
  });

  it("reads forward and backward pages within the current filter context", () => {
    const filters = { tasks: ["task-a"], omitInactiveBuilds: true };
    write(makeNormalizedPage([20, 19, 18, 17, 16]), filters);
    write(makeNormalizedPage([15, 14, 13, 12, 11]), {
      ...filters,
      maxOrder: 16,
    });

    expect(read(filters)?.versions.map(({ order }) => order)).toStrictEqual([
      20, 19, 18, 17, 16,
    ]);
    expect(
      read({ ...filters, maxOrder: 16 })?.versions.map(({ order }) => order),
    ).toStrictEqual([15, 14, 13, 12, 11]);
    expect(
      read({ ...filters, minOrder: 15 })?.versions.map(({ order }) => order),
    ).toStrictEqual([20, 19, 18, 17, 16]);
  });

  it.each([
    { tasks: ["task-b"] },
    { variants: ["variant-b"] },
    { statuses: ["failed"] },
    { requesters: ["github_pr"] },
    { omitInactiveBuilds: true },
    { includeAllBuildsAndTasks: true },
  ] satisfies Partial<WaterfallOptions>[])(
    "misses when the payload context changes to %j",
    (options) => {
      write(makeNormalizedPage([20, 19, 18, 17, 16]));
      expect(read(options)).toBeUndefined();
    },
  );

  it.each([
    { tasks: ["task"], taskCaseSensitive: true },
    { variants: ["variant"], variantCaseSensitive: true },
  ] satisfies Partial<WaterfallOptions>[])(
    "includes matching case sensitivity in the context: %j",
    (options) => {
      write(makeNormalizedPage([20]), options);
      expect(
        read({
          ...options,
          taskCaseSensitive: false,
          variantCaseSensitive: false,
        }),
      ).toBeUndefined();
    },
  );

  it("normalizes filter sets and default payload options", () => {
    write(makeNormalizedPage([20]), {
      tasks: ["a", "b", "a"],
      includeAllBuildsAndTasks: undefined,
    });
    expect(
      read({
        tasks: ["b", "a"],
        statuses: [],
        variants: null,
        requesters: [],
        omitInactiveBuilds: false,
        includeAllBuildsAndTasks: true,
      }),
    ).toBeDefined();
  });

  it("replaces the page collection on context changes, including return to old filters", async () => {
    const filtersA = { tasks: ["task-a"] };
    const filtersB = { tasks: ["task-b"] };
    write(makeNormalizedPage([20, 19, 18, 17, 16]), filtersA);
    cache.retain("Version:version-19");
    write(makeNormalizedPage([15, 14, 13, 12, 11]), {
      ...filtersA,
      maxOrder: 16,
    });
    const subset = makeNormalizedPage([20]);
    subset.versions[0].waterfallBuilds = [makeBuild("build-20", ["task-b"])];
    write(subset, filtersB);
    await new Promise<void>((resolve) => queueMicrotask(resolve));

    expect(read(filtersA)).toBeUndefined();
    expect(read({ ...filtersA, maxOrder: 16 })).toBeUndefined();
    expect(read({ ...filtersB, maxOrder: 16 })).toBeUndefined();
    expect(read(filtersB)?.versions[0].waterfallBuilds?.[0].tasks).toHaveLength(
      1,
    );
    const entities = cache.extract();
    expect(entities["Version:version-19"]).toMatchObject({
      id: "version-19",
      order: 19,
    });
    expect(entities["Version:version-19"]?.waterfallBuilds).toBeUndefined();
    expect(entities["WaterfallBuild:build-19"]).toBeUndefined();
    expect(entities["WaterfallBuild:build-20"]).toBeDefined();

    write(makeNormalizedPage([20]), filtersA);
    expect(read(filtersB)).toBeUndefined();
    expect(read({ ...filtersA, maxOrder: 16 })).toBeUndefined();
  });

  it("does not retain active IDs when polling makes a version inactive", () => {
    const filters = { tasks: ["task-a"] };
    const firstPage = makeNormalizedPage([20, 19, 18, 17, 16]);
    write(firstPage, filters);
    const updatedPage = makeNormalizedPage([20, 19, 18, 17, 16, 15]);
    updatedPage.pagination.activeVersionIds.shift();
    updatedPage.versions[0].waterfallBuilds = null;
    write(updatedPage, filters);

    expect(read(filters)?.pagination.activeVersionIds).not.toContain(
      "version-20",
    );
    write(makeNormalizedPage([14, 13, 12, 11, 10]), {
      ...filters,
      maxOrder: 15,
    });
    const previous = read({ ...filters, minOrder: 14 });
    expect(previous?.versions.map(({ order }) => order)).toStrictEqual([
      20, 19, 18, 17, 16, 15,
    ]);
    expect(previous?.pagination.activeVersionIds).not.toContain("version-20");
    expect(previous?.versions[0].waterfallBuilds).toBeNull();
  });

  it("does not resurrect an emptied page after navigating back through the cache", () => {
    const filters = { tasks: ["task-a"] };
    const firstPage = makeNormalizedPage([20, 19, 18, 17, 16]);
    const secondPage = makeNormalizedPage([15, 14, 13, 12, 11]);
    write(firstPage, filters);
    write(secondPage, { ...filters, maxOrder: 16 });
    expect(read(filters)?.versions).toHaveLength(5);

    write(
      {
        ...firstPage,
        versions: [],
        pagination: {
          ...firstPage.pagination,
          activeVersionIds: [],
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      filters,
    );
    expect(read(filters)?.versions).toStrictEqual([]);
    write(secondPage, { ...filters, maxOrder: 16 });

    expect(read(filters)?.pagination.activeVersionIds).toStrictEqual(
      [...secondPage.pagination.activeVersionIds].sort(),
    );
  });

  it("keeps active versions displaced by newer commits during polling", () => {
    const filters = { tasks: ["task-a"] };
    write(makeNormalizedPage([20, 19, 18, 17, 16]), filters);
    const updated = makeNormalizedPage([22, 21, 20, 19, 18]);
    updated.pagination.mostRecentVersionOrder = 22;
    write(updated, filters);

    expect(
      read({ ...filters, minOrder: 15 })?.pagination.activeVersionIds,
    ).toStrictEqual([
      "version-16",
      "version-17",
      "version-18",
      "version-19",
      "version-20",
    ]);
  });

  it.each([
    { projectIdentifier: "mongodb-mongo-master", pageLimit: 2 },
    { projectIdentifier: "other-project", pageLimit: 6 },
  ])(
    "bounds filtered pages for $projectIdentifier in either direction",
    async ({ pageLimit, projectIdentifier }) => {
      const filters = { projectIdentifier, statuses: ["success"] };
      const pages = Array.from({ length: pageLimit + 1 }, (_, pageIndex) =>
        makeNormalizedPage(
          Array.from(
            { length: 5 },
            (_version, index) => 35 - pageIndex * 5 - index,
          ),
        ),
      );
      pages.forEach((page, pageIndex) =>
        write(page, {
          ...filters,
          maxOrder: pageIndex ? 36 - pageIndex * 5 : 0,
        }),
      );
      await new Promise<void>((resolve) => queueMicrotask(resolve));

      expect(read({ ...filters, maxOrder: 36 })).toBeUndefined();
      expect(read({ ...filters, maxOrder: 31 })?.versions).toHaveLength(5);
      expect(cache.extract()["WaterfallBuild:build-35"]).toBeUndefined();

      write(pages[0], { ...filters, minOrder: 30 });
      await new Promise<void>((resolve) => queueMicrotask(resolve));
      expect(read({ ...filters, minOrder: 30 })?.versions).toHaveLength(5);
      expect(
        read({ ...filters, maxOrder: 36 - pageLimit * 5 }),
      ).toBeUndefined();
      expect(
        cache.extract()[`WaterfallBuild:build-${35 - pageLimit * 5}`],
      ).toBeUndefined();
    },
  );

  it("keeps unrelated projects and legacy version payloads intact", async () => {
    const legacyQuery = gql`
      query LegacyVersion {
        version(id: "legacy") {
          id
          waterfallBuilds {
            id
          }
        }
      }
    `;
    cache.writeQuery({
      query: legacyQuery,
      data: {
        version: {
          __typename: "Version",
          id: "legacy",
          waterfallBuilds: [
            { __typename: "WaterfallBuild", id: "legacy-build" },
          ],
        },
      },
    });
    write(makeNormalizedPage([100]), { projectIdentifier: "other-project" });
    write(makeNormalizedPage([20]));
    write(makeNormalizedPage([19]), { statuses: ["failed"] });
    await new Promise<void>((resolve) => queueMicrotask(resolve));

    expect(
      read({ projectIdentifier: "other-project" })?.versions[0].waterfallBuilds,
    ).toHaveLength(1);
    expect(cache.readQuery({ query: legacyQuery })).toMatchObject({
      version: { waterfallBuilds: [{ id: "legacy-build" }] },
    });
  });

  it.each([
    {},
    { maxOrder: 16 },
    { minOrder: 20 },
    { date: new Date("2026-01-01") },
    { revision: "abc123" },
  ] satisfies Partial<WaterfallOptions>[])(
    "reads an empty response at its original anchor %j",
    (anchors) => {
      write(makeNormalizedPage([20, 19, 18, 17, 16]));
      const emptyPage = makeNormalizedPage([]);
      emptyPage.pagination = {
        ...emptyPage.pagination,
        activeVersionIds: [],
        hasNextPage: false,
        hasPrevPage: false,
        nextPageOrder: 0,
        prevPageOrder: 0,
      };
      const filters = { ...anchors, tasks: ["missing-task"] };
      write(emptyPage, filters);

      expect(read(filters)).toMatchObject({
        versions: [],
        pagination: { hasNextPage: false, hasPrevPage: false },
      });
      expect(read()).toBeUndefined();
      expect(read({ ...filters, maxOrder: 10 })).toBeUndefined();
    },
  );

  it.each([
    { date: new Date("2026-01-01") },
    { revision: "abc123" },
  ] satisfies Partial<WaterfallOptions>[])(
    "preserves date and revision navigation without creating a filter context: %j",
    (anchors) => {
      write(makeNormalizedPage([15, 14, 13, 12, 11]), anchors);
      expect(read(anchors)?.versions).toHaveLength(5);
      expect(read({ maxOrder: 16 })?.versions).toHaveLength(5);
      write(makeNormalizedPage([10, 9, 8, 7, 6]), { maxOrder: 11 });
      expect(
        read({ minOrder: 10 })?.versions.map(({ order }) => order),
      ).toStrictEqual([15, 14, 13, 12, 11]);
    },
  );
});

describe("bounded waterfall cache", () => {
  it("retains up to two pages of active versions", () => {
    let cache = mergePage(undefined, page1);
    cache = mergePage(cache, page2, { maxOrder: 16 });

    expect(getVersionIds(cache)).toStrictEqual([
      ...getVersionIds(page1),
      ...getVersionIds(page2),
    ]);
  });

  it("retains up to six pages for other projects", () => {
    const pages = Array.from({ length: 7 }, (_page, pageIndex) =>
      makePage(
        Array.from(
          { length: 5 },
          (_version, versionIndex) => 35 - pageIndex * 5 - versionIndex,
        ),
      ),
    );
    let cache: CachedWaterfall | undefined;
    pages.forEach((page, pageIndex) => {
      cache = mergePage(cache, page, {
        maxOrder: pageIndex ? 36 - pageIndex * 5 : 0,
        projectIdentifier: "small-project",
      });
    });

    expect(getVersionIds(cache as Waterfall)).toStrictEqual(
      pages.slice(1).flatMap(getVersionIds),
    );
  });

  it("evicts the newest active versions when paginating forward", () => {
    let cache = mergePage(undefined, page1);
    cache = mergePage(cache, page2, { maxOrder: 16 });
    cache = mergePage(cache, page3, { maxOrder: 11 });

    expect(getVersionIds(cache)).toStrictEqual([
      ...getVersionIds(page2),
      ...getVersionIds(page3),
    ]);
  });

  it("evicts the oldest active versions when paginating backward", () => {
    let cache = mergePage(undefined, page3, { maxOrder: 11 });
    cache = mergePage(cache, page2, { minOrder: 10 });
    cache = mergePage(cache, page1, { minOrder: 15 });

    expect(getVersionIds(cache)).toStrictEqual([
      ...getVersionIds(page1),
      ...getVersionIds(page2),
    ]);
  });

  it("evicts waterfall builds from discarded versions", async () => {
    const cache = {
      evict: vi.fn(),
      gc: vi.fn(),
      identify: ({ __typename, id }: { __typename: string; id: string }) =>
        `${__typename}:${id}`,
    };
    let waterfallCache = mergePage(undefined, page1);
    waterfallCache = mergePage(waterfallCache, page2, { maxOrder: 16 });
    mergePage(waterfallCache, page3, {
      cache,
      maxOrder: 11,
    });

    expect(cache.evict).toHaveBeenCalledTimes(page1.versions.length);
    expect(cache.evict).toHaveBeenCalledWith({
      broadcast: false,
      fieldName: "waterfallBuilds",
      id: "Version:version-20",
    });
    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(cache.gc).toHaveBeenCalledWith({ resetResultCache: true });
  });

  it("does not grow when polling an already cached page", () => {
    let cache = mergePage(undefined, page1);
    cache = mergePage(cache, page1);

    expect(getVersionIds(cache)).toStrictEqual(getVersionIds(page1));
  });

  it("clears a polled page's active IDs when its response becomes empty", () => {
    let cache = mergePage(undefined, page1);
    cache = mergePage(cache, {
      ...page1,
      versions: [],
      pagination: {
        ...page1.pagination,
        activeVersionIds: [],
        hasNextPage: false,
        nextPageOrder: 0,
      },
    });

    expect(cache.allActiveVersions.size).toBe(0);
    expect(readPage(cache)?.versions).toStrictEqual([]);
  });

  it("does not count inactive versions toward the bound", () => {
    const pageWithInactiveVersion = {
      ...page3,
      versions: [{ id: "inactive-version", order: 10.5 }, ...page3.versions],
    } as Waterfall;
    let cache = mergePage(undefined, page1);
    cache = mergePage(cache, page2, { maxOrder: 16 });
    cache = mergePage(cache, pageWithInactiveVersion, { maxOrder: 11 });

    expect(getVersionIds(cache)).toContain("inactive-version");
    expect(
      (cache as Waterfall & { allActiveVersions: Set<string> })
        .allActiveVersions.size,
    ).toBe(10);
  });

  it("reads cached versions in either pagination direction", () => {
    let cache = mergePage(undefined, page1);
    cache = mergePage(cache, page2, { maxOrder: 16 });

    expect(getVersionIds(readPage(cache) as Waterfall)).toStrictEqual(
      getVersionIds(page1),
    );
    expect(
      getVersionIds(readPage(cache, { maxOrder: 16 }) as Waterfall),
    ).toStrictEqual(getVersionIds(page2));
    expect(
      getVersionIds(readPage(cache, { minOrder: 15 }) as Waterfall),
    ).toStrictEqual(getVersionIds(page1));
  });
});
