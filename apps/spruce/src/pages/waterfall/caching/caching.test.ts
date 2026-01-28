import { FieldFunctionOptions } from "@apollo/client";
import { FieldMergeFunctionOptions } from "@apollo/client/cache";
import { versions } from "../testData";
import { mergeVersions, readVersions } from ".";

// @ts-expect-error: we don't need to type the args for this mock
const readField = (field, obj) => obj[field];

describe("mergeVersions", () => {
  const readFn = {
    readField,
    extensions: {},
    existingData: undefined,
  } as FieldMergeFunctionOptions;

  it("merges version arrays", () => {
    const pagination = {
      activeVersionIds: ["b", "c", "f"],
      nextPageOrder: 0,
      prevPageOrder: 0,
      hasNextPage: true,
      hasPrevPage: true,
      mostRecentVersionOrder: 5,
    };
    expect(
      mergeVersions(
        {
          flattenedVersions: versions.slice(0, 2),
          pagination,
        },
        {
          flattenedVersions: versions.slice(2, -1),
          pagination,
        },
        readFn,
      ),
    ).toStrictEqual({
      allActiveVersions: new Set(["b", "c", "f"]),
      flattenedVersions: versions.slice(0, -1),
      pagination,
    });
  });

  it("merges version when incoming is newer than existing", () => {
    const pagination = {
      activeVersionIds: ["b", "c", "f"],
      nextPageOrder: 3,
      prevPageOrder: 0,
      hasNextPage: true,
      hasPrevPage: false,
      mostRecentVersionOrder: 5,
    };
    expect(
      mergeVersions(
        {
          flattenedVersions: versions.slice(2, -1),
          pagination,
        },
        {
          flattenedVersions: versions.slice(0, 2),
          pagination,
        },
        readFn,
      ),
    ).toStrictEqual({
      allActiveVersions: new Set(["b", "c", "f"]),
      flattenedVersions: versions.slice(0, -1),
      pagination,
    });
  });

  it("deduplicates versions when merging", () => {
    const pagination = {
      activeVersionIds: ["b", "c", "f"],
      nextPageOrder: 0,
      prevPageOrder: 1,
      hasNextPage: false,
      hasPrevPage: true,
      mostRecentVersionOrder: 5,
    };
    expect(
      mergeVersions(
        {
          flattenedVersions: versions.slice(0, 4),
          pagination,
        },
        {
          flattenedVersions: versions.slice(2),
          pagination,
        },
        readFn,
      ),
    ).toStrictEqual({
      allActiveVersions: new Set(["b", "c", "f"]),
      flattenedVersions: versions,
      pagination,
    });
  });

  it("returns an identical cache when duplicate data is incoming", () => {
    const pagination = {
      activeVersionIds: ["b", "c", "f"],
      nextPageOrder: 0,
      prevPageOrder: 0,
      hasNextPage: false,
      hasPrevPage: false,
      mostRecentVersionOrder: 5,
    };
    expect(
      mergeVersions(
        {
          flattenedVersions: versions,
          pagination,
        },
        {
          flattenedVersions: versions,
          pagination,
        },
        readFn,
      ),
    ).toStrictEqual({
      allActiveVersions: new Set(["b", "c", "f"]),
      flattenedVersions: versions,
      pagination,
    });
  });

  it("combines lists of active versions", () => {
    const pagination = {
      activeVersionIds: ["b", "c", "f"],
      nextPageOrder: 0,
      prevPageOrder: 1,
      hasNextPage: false,
      hasPrevPage: true,
      mostRecentVersionOrder: 5,
    };
    expect(
      mergeVersions(
        {
          allActiveVersions: new Set(["x", "y", "b"]),
          flattenedVersions: versions.slice(0, 4),
          pagination,
        },
        {
          flattenedVersions: versions.slice(2),
          pagination,
        },
        readFn,
      ),
    ).toStrictEqual({
      allActiveVersions: new Set(["b", "c", "f", "x", "y"]),
      flattenedVersions: versions,
      pagination,
    });
  });
});

describe("readVersions", () => {
  it("returns undefined when the cache is empty", () => {
    expect(
      readVersions(
        undefined,
        // @ts-expect-error: for tests we can omit unused fields from the args
        {
          args: {
            options: { limit: 5 },
          },
          readField,
        } as FieldFunctionOptions,
      ),
    ).toBe(undefined);
  });

  it("reads the first page and returns limit active versions", () => {
    expect(
      readVersions(
        {
          allActiveVersions: new Set(["b", "c", "f"]),
          flattenedVersions: versions,
          // @ts-expect-error: only mostRecentVersionOrder affects reading versions
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error: for tests we can omit unused fields from the args
        {
          args: {
            options: { limit: 3, maxOrder: 6 },
          },
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({
      flattenedVersions: versions,
      pagination: {
        activeVersionIds: ["b", "c", "f"],
        hasPrevPage: false,
        hasNextPage: false,
        mostRecentVersionOrder: 5,
        prevPageOrder: 0,
        nextPageOrder: 0,
      },
    });
  });

  it("truncates after limit active versions", () => {
    expect(
      readVersions(
        {
          allActiveVersions: new Set(["b", "c", "f"]),
          flattenedVersions: versions,
          // @ts-expect-error: only mostRecentVersionOrder affects reading versions
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error: for tests we can omit unused fields from the args
        {
          args: {
            options: { limit: 2, maxOrder: 5 },
          },
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({
      flattenedVersions: versions.slice(1, 3),
      pagination: {
        activeVersionIds: ["b", "c"],
        hasPrevPage: true,
        hasNextPage: true,
        mostRecentVersionOrder: 5,
        prevPageOrder: 4,
        nextPageOrder: 3,
      },
    });
  });

  it("correctly reads a page", () => {
    expect(
      readVersions(
        {
          allActiveVersions: new Set(["b", "c", "f"]),
          flattenedVersions: versions,
          // @ts-expect-error: only mostRecentVersionOrder affects reading versions
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error: for tests we can omit unused fields from the args
        {
          args: {
            options: {
              limit: 2,
              maxOrder: 4,
            },
          },
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({
      flattenedVersions: versions.slice(2),
      pagination: {
        activeVersionIds: ["c", "f"],
        hasPrevPage: true,
        hasNextPage: false,
        mostRecentVersionOrder: 5,
        prevPageOrder: 3,
        nextPageOrder: 0,
      },
    });
  });

  it("reads a page using minOrder", () => {
    expect(
      readVersions(
        {
          allActiveVersions: new Set(["b", "c", "f"]),
          flattenedVersions: versions,
          // @ts-expect-error: only mostRecentVersionOrder affects reading versions
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error: for tests we can omit unused fields from the args
        {
          args: {
            options: {
              limit: 2,
              minOrder: 2,
            },
          },
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({
      flattenedVersions: versions.slice(0, 3),
      pagination: {
        activeVersionIds: ["b", "c"],
        hasPrevPage: false,
        hasNextPage: true,
        mostRecentVersionOrder: 5,
        prevPageOrder: 0,
        nextPageOrder: 3,
      },
    });
  });

  it("reads a page using minOrder with previous pages", () => {
    expect(
      readVersions(
        {
          allActiveVersions: new Set(["b", "c", "f"]),
          flattenedVersions: versions,
          // @ts-expect-error: only mostRecentVersionOrder affects reading versions
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error: for tests we can omit unused fields from the args
        {
          args: {
            options: {
              limit: 1,
              minOrder: 2,
            },
          },
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({
      flattenedVersions: versions.slice(2, 3),
      pagination: {
        activeVersionIds: ["c"],
        hasPrevPage: true,
        hasNextPage: true,
        mostRecentVersionOrder: 5,
        prevPageOrder: 3,
        nextPageOrder: 3,
      },
    });
  });

  it("returns undefined when the order is not found in the cache", () => {
    expect(
      readVersions(
        {
          flattenedVersions: versions,
          // @ts-expect-error: only mostRecentVersionOrder affects reading versions
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error: for tests we can omit unused fields from the args
        {
          args: {
            options: {
              limit: 5,
              minOrder: 8,
            },
          },
          readField,
        } as FieldFunctionOptions,
      ),
    ).toBe(undefined);
  });

  it("returns undefined when the number of activated versions found is less than the limit", () => {
    expect(
      readVersions(
        {
          flattenedVersions: versions,
          // @ts-expect-error: only mostRecentVersionOrder affects reading versions
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error: for tests we can omit unused fields from the args
        {
          args: {
            options: {
              limit: 3,
              maxOrder: 4,
            },
          },
          readField,
        } as FieldFunctionOptions,
      ),
    ).toBe(undefined);
  });

  it("returns first page if it exists in cache, even if minOrder and maxOrder are undefined", () => {
    expect(
      readVersions(
        {
          allActiveVersions: new Set(["b", "c", "f"]),
          flattenedVersions: versions,
          // @ts-expect-error: only mostRecentVersionOrder affects reading versions
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error: for tests we can omit unused fields from the args
        {
          args: {
            options: {
              maxOrder: undefined,
              minOrder: undefined,
              limit: 3,
            },
          },
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({
      flattenedVersions: versions,
      pagination: {
        activeVersionIds: ["b", "c", "f"],
        hasPrevPage: false,
        hasNextPage: false,
        mostRecentVersionOrder: 5,
        prevPageOrder: 0,
        nextPageOrder: 0,
      },
    });
  });

  it("only applies active versions against the version limit", () => {
    expect(
      readVersions(
        {
          allActiveVersions: new Set(["b", "c", "f"]),
          flattenedVersions: versions,
          // @ts-expect-error: only mostRecentVersionOrder affects reading versions
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error: for tests we can omit unused fields from the args
        {
          args: {
            options: { limit: 2 },
          },
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({
      flattenedVersions: versions.slice(0, 3),
      pagination: {
        activeVersionIds: ["b", "c"],
        hasPrevPage: false,
        hasNextPage: true,
        mostRecentVersionOrder: 5,
        prevPageOrder: 0,
        nextPageOrder: 3,
      },
    });
  });
});
