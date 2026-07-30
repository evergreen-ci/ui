import {
  FieldFunctionOptions,
  FieldMergeFunctionOptions,
} from "@apollo/client/cache";
import { WaterfallQuery } from "gql/generated/types";
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
  existing: Waterfall | undefined,
  incoming: Waterfall,
  options: Record<string, unknown> = {},
) =>
  mergeVersions(existing, incoming, {
    args: {
      options: {
        limit: 5,
        projectIdentifier: "mongodb-mongo-master",
        ...options,
      },
    },
    readField,
  } as unknown as FieldMergeFunctionOptions);

const readPage = (existing: Waterfall, options: Record<string, unknown> = {}) =>
  readVersions(existing, {
    args: { options: { limit: 5, ...options } },
    readField,
  } as unknown as FieldFunctionOptions);

const getVersionIds = (cache: Waterfall) => cache.versions.map(({ id }) => id);

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
    let cache: Waterfall | undefined;
    pages.forEach((page, pageIndex) => {
      cache = mergePage(cache, page, {
        maxOrder: pageIndex ? 1 : 0,
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

  it("does not grow when polling an already cached page", () => {
    let cache = mergePage(undefined, page1);
    cache = mergePage(cache, page1);

    expect(getVersionIds(cache)).toStrictEqual(getVersionIds(page1));
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
