import { FieldFunctionOptions } from "@apollo/client";
import { mergeVersions, readVersions } from "./caching";
import { buildVariants } from "./testData";
import { Version } from "./types";
import { groupBuildVariants, groupInactiveVersions } from "./utils";

describe("groupInactiveVersions", () => {
  it("correctly groups inactive versions", () => {
    const res = groupInactiveVersions(versions, () => true);

    expect(res).toStrictEqual([
      {
        inactiveVersions: [versions[0]],
        version: null,
      },
      {
        inactiveVersions: null,
        version: versions[1],
      },
      {
        inactiveVersions: null,
        version: versions[2],
      },
      {
        inactiveVersions: [versions[3], versions[4]],
        version: null,
      },
      {
        inactiveVersions: null,
        version: versions[5],
      },
    ]);
  });

  it("correctly groups inactive versions when some do not appear in builds", () => {
    const res = groupInactiveVersions(versions, (v) => v.id !== "b");

    expect(res).toStrictEqual([
      {
        inactiveVersions: [versions[0], versions[1]],
        version: null,
      },
      {
        inactiveVersions: null,
        version: versions[2],
      },
      {
        inactiveVersions: [versions[3], versions[4]],
        version: null,
      },
      {
        inactiveVersions: null,
        version: versions[5],
      },
    ]);
  });
});

describe("groupBuildVariants", () => {
  it("correctly groups build variants from versions", () => {
    expect(groupBuildVariants(versions)).toStrictEqual(buildVariants);
  });

  it("sorts display names in an expected order", () => {
    const symbolVersions = [
      {
        activated: true,
        id: "version_1",
        waterfallBuilds: [
          {
            id: "id_a",
            buildVariant: "bv_a",
            displayName: "a",
          },
          {
            id: "id_b",
            buildVariant: "bv_b",
            displayName: "1",
          },
          {
            id: "id_c",
            buildVariant: "bv_c",
            displayName: "!",
          },
          {
            id: "id_d",
            buildVariant: "bv_d",
            displayName: "~",
          },
        ],
      },
    ] as Version[];
    expect(groupBuildVariants(symbolVersions)).toStrictEqual([
      {
        displayName: "!",
        id: "bv_c",
        builds: [
          {
            id: "id_c",
            tasks: [],
            version: "version_1",
          },
        ],
      },
      {
        displayName: "1",
        id: "bv_b",
        builds: [
          {
            id: "id_b",
            tasks: [],
            version: "version_1",
          },
        ],
      },
      {
        displayName: "a",
        id: "bv_a",
        builds: [
          {
            id: "id_a",
            tasks: [],
            version: "version_1",
          },
        ],
      },
      {
        displayName: "~",
        id: "bv_d",
        builds: [
          {
            id: "id_d",
            tasks: [],
            version: "version_1",
          },
        ],
      },
    ]);
  });
});

describe("caching functions", () => {
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
            // @ts-expect-error
            readField: (field, obj) => obj[field],
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
            // @ts-expect-error
            readField: (field, obj) => obj[field],
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
            // @ts-expect-error
            readField: (field, obj) => obj[field],
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
            // @ts-expect-error
            readField: (field, obj) => obj[field],
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
            // @ts-expect-error
            readField: (field, obj) => obj[field],
          } as FieldFunctionOptions,
        ),
      ).toBe(undefined);
    });

    it("reads the first page and returns limit active versions", () => {
      expect(
        readVersions(
          {
            flattenedVersions: versions,
          },
          // @ts-expect-error
          {
            args: {
              options: { limit: 3, maxOrder: 6 },
            },
            // @ts-expect-error
            readField: (field, obj) => obj[field],
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
          },
          // @ts-expect-error
          {
            args: {
              options: { limit: 2, maxOrder: 5 },
            },
            // @ts-expect-error
            readField: (field, obj) => obj[field],
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
          },
          // @ts-expect-error
          {
            args: {
              options: {
                limit: 2,
                maxOrder: 4,
              },
            },
            // @ts-expect-error
            readField: (field, obj) => obj[field],
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
          },
          // @ts-expect-error
          {
            args: {
              options: {
                limit: 2,
                minOrder: 2,
              },
            },
            // @ts-expect-error
            readField: (field, obj) => obj[field],
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

    it("returns undefined when the order is not found in the cache", () => {
      expect(
        readVersions(
          {
            flattenedVersions: versions,
          },
          // @ts-expect-error
          {
            args: {
              options: {
                limit: 5,
                minOrder: 8,
              },
            },
            // @ts-expect-error
            readField: (field, obj) => obj[field],
          } as FieldFunctionOptions,
        ),
      ).toBe(undefined);
    });
  });

  it("returns undefined when the number of activated versions found is less than the limit", () => {
    expect(
      readVersions(
        {
          flattenedVersions: versions,
        },
        // @ts-expect-error
        {
          args: {
            options: {
              limit: 3,
              maxOrder: 4,
            },
          },
          // @ts-expect-error
          readField: (field, obj) => obj[field],
        } as FieldFunctionOptions,
      ),
    ).toBe(undefined);
  });
});

const versions: Version[] = [
  {
    id: "a",
    author: "sophie.stadler",
    activated: false,
    createTime: new Date("2024-09-20T14:56:08Z"),
    errors: [],
    message: "bar",
    requester: "gitter_request",
    revision: "a",
    order: 5,
    waterfallBuilds: null,
  },
  {
    id: "b",
    author: "sophie.stadler",
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "b",
    order: 4,
    waterfallBuilds: [
      {
        id: "ii",
        buildVariant: "1",
        displayName: "BV 1",
        tasks: [
          {
            displayName: "Task 20",
            displayStatusCache: "started",
            execution: 0,
            id: "task_20",
            status: "started",
          },
          {
            displayName: "Task 15",
            displayStatusCache: "started",
            execution: 0,
            id: "task_15",
            status: "started",
          },
        ],
      },
      {
        id: "ii2",
        buildVariant: "2",
        displayName: "BV 2",
        tasks: [
          {
            displayName: "Task 100",
            displayStatusCache: "started",
            execution: 0,
            id: "task_100",
            status: "started",
          },
        ],
      },
    ],
  },
  {
    id: "c",
    author: "sophie.stadler",
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "c",
    order: 3,
    waterfallBuilds: [
      {
        id: "iii",
        buildVariant: "3",
        displayName: "BV 3",
        tasks: [
          {
            displayName: "Task 1",
            displayStatusCache: "",
            execution: 0,
            id: "task_1",
            status: "success",
          },
          {
            displayName: "Task 2",
            displayStatusCache: "task-timed-out",
            execution: 0,
            id: "task_2",
            status: "failed",
          },
        ],
      },
    ],
  },
  {
    id: "d",
    author: "sophie.stadler",
    activated: false,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "d",
    order: 2,
  },
  {
    id: "e",
    author: "sophie.stadler",
    activated: false,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "e",
    order: 1,
  },
  {
    id: "f",
    author: "sophie.stadler",
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "f",
    order: 0,
    waterfallBuilds: [
      {
        id: "i",
        buildVariant: "1",
        displayName: "BV 1",
        tasks: [],
      },
    ],
  },
];
