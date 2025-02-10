import { FieldFunctionOptions } from "@apollo/client";
import { mergeVersions, readVersions } from ".";
import { versions } from "../testData";

// @ts-expect-error
const readField = (field, obj) => obj[field];

describe("mergeVersions", () => {
  it("merges version arrays", () => {
    const pagination = {
      nextPageOrder: 0,
      prevPageOrder: 0,
      hasNextPage: true,
      hasPrevPage: true,
    };
    expect(
      mergeVersions(
        {
          flattenedVersions: versions.slice(0, 2),
        },
        {
          flattenedVersions: versions.slice(2, -1),
          pagination,
        },
        {
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({ flattenedVersions: versions.slice(0, -1), pagination });
  });

  it("merges version when incoming is newer than existing", () => {
    const pagination = {
      nextPageOrder: 3,
      prevPageOrder: 0,
      hasNextPage: true,
      hasPrevPage: false,
    };
    expect(
      mergeVersions(
        {
          flattenedVersions: versions.slice(2, -1),
        },
        {
          flattenedVersions: versions.slice(0, 2),
          pagination,
        },
        {
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({ flattenedVersions: versions.slice(0, -1), pagination });
  });

  it("deduplicates versions when merging", () => {
    const pagination = {
      nextPageOrder: 0,
      prevPageOrder: 1,
      hasNextPage: false,
      hasPrevPage: true,
    };
    expect(
      mergeVersions(
        {
          flattenedVersions: versions.slice(0, 4),
        },
        {
          flattenedVersions: versions.slice(2),
          pagination,
        },
        {
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({ flattenedVersions: versions, pagination });
  });

  it("returns an identical cache when duplicate data is incoming", () => {
    const pagination = {
      nextPageOrder: 0,
      prevPageOrder: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };
    expect(
      mergeVersions(
        {
          flattenedVersions: versions,
        },
        {
          flattenedVersions: versions,
          pagination,
        },
        {
          readField,
        } as FieldFunctionOptions,
      ),
    ).toStrictEqual({ flattenedVersions: versions, pagination });
  });
});

describe("readVersions", () => {
  it("returns undefined when the cache is empty", () => {
    expect(
      readVersions(
        undefined,
        // @ts-expect-error
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
          flattenedVersions: versions,
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error
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
        hasPrevPage: false,
        hasNextPage: false,
        prevPageOrder: 0,
        nextPageOrder: 0,
      },
    });
  });

  it("truncates after limit active versions", () => {
    expect(
      readVersions(
        {
          flattenedVersions: versions,
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error
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
        hasPrevPage: true,
        hasNextPage: true,
        prevPageOrder: 4,
        nextPageOrder: 3,
      },
    });
  });

  it("correctly reads a page", () => {
    expect(
      readVersions(
        {
          flattenedVersions: versions,
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error
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
        hasPrevPage: true,
        hasNextPage: false,
        prevPageOrder: 3,
        nextPageOrder: 0,
      },
    });
  });

  it("reads a page using minOrder", () => {
    expect(
      readVersions(
        {
          flattenedVersions: versions,
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error
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
        hasPrevPage: false,
        hasNextPage: true,
        prevPageOrder: 0,
        nextPageOrder: 3,
      },
    });
  });

  it("reads a page using minOrder with previous pages", () => {
    expect(
      readVersions(
        {
          flattenedVersions: versions,
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error
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
        hasPrevPage: true,
        hasNextPage: true,
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
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error
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
          pagination: {
            mostRecentVersionOrder: 5,
          },
        },
        // @ts-expect-error
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
});
