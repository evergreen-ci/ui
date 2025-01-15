import { MemoryRouter } from "react-router-dom";
import { renderHook } from "@evg-ui/lib/test_utils";
import { WaterfallVersionFragment } from "gql/generated/types";
import { useFilters } from "./useFilters";

type WrapperProps = {
  initialEntry?: string;
};

const createWrapper = (props = {}) => {
  const { initialEntry = "/project/spruce/waterfall" }: WrapperProps = props;
  return function CreateWrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
    );
  };
};

describe("useFilters", () => {
  describe("requester filters", () => {
    it("should not make any versions inactive when no filters are applied", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: [],
          }),
        {
          wrapper: createWrapper(),
        },
      );
      expect(result.current).toStrictEqual({
        ...waterfall,
        activeVersionIds: ["b", "c"],
      });
    });

    it("should move version into inactive versions list and drop build variant when filter is applied", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry:
              "/project/spruce/waterfall?requesters=git_tag_request",
          }),
        },
      );

      const filteredWaterfall = {
        activeVersionIds: [],
        buildVariants: [],
        versions: [
          {
            version: null,
            inactiveVersions: flattenedVersions,
          },
        ],
      };

      expect(result.current).toStrictEqual(filteredWaterfall);
    });
  });

  describe("pinned build variants", () => {
    it("should push pins to the top of list of build variants and preserve their original order", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: ["3", "2"],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall",
          }),
        },
      );

      const pinnedWaterfall = {
        ...waterfall,
        activeVersionIds: ["b", "c"],
        buildVariants: [
          waterfall.buildVariants[1],
          waterfall.buildVariants[2],
          waterfall.buildVariants[0],
        ],
      };

      expect(result.current).toStrictEqual(pinnedWaterfall);
    });
  });

  describe("build variant filters", () => {
    it("should filter build variant list when filter is applied", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall?buildVariants=yooo",
          }),
        },
      );

      const filteredWaterfall = {
        activeVersionIds: [],
        buildVariants: [],
        versions: [
          {
            inactiveVersions: flattenedVersions,
            version: null,
          },
        ],
      };

      expect(result.current).toStrictEqual(filteredWaterfall);
    });

    it("build variant filters are added together", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall?buildVariants=yooo,bv",
          }),
        },
      );

      const filteredWaterfall = {
        ...waterfall,
        activeVersionIds: ["b", "c"],
      };

      expect(result.current).toStrictEqual(filteredWaterfall);
    });
  });

  describe("task filters", () => {
    it("should filter build variant list and tasks when filter is applied", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall?tasks=15",
          }),
        },
      );

      const filteredWaterfall = {
        activeVersionIds: ["b"],
        buildVariants: [
          {
            ...waterfall.buildVariants[0],
            builds: [
              {
                ...waterfall.buildVariants[0].builds[1],
                tasks: [waterfall.buildVariants[0].builds[1].tasks[1]],
              },
            ],
          },
        ],
        versions: [
          {
            inactiveVersions: [flattenedVersions[0]],
            version: null,
          },
          {
            inactiveVersions: null,
            version: flattenedVersions[1],
          },
          {
            inactiveVersions: [flattenedVersions[2]],
            version: null,
          },
        ],
      };

      expect(result.current).toStrictEqual(filteredWaterfall);
    });

    it("should match on multiple tasks and build variants", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall?tasks=1",
          }),
        },
      );

      const filteredWaterfall = {
        ...waterfall,
        activeVersionIds: ["b", "c"],
        buildVariants: [
          {
            ...waterfall.buildVariants[0],
            builds: [
              {
                ...waterfall.buildVariants[0].builds[1],
                tasks: [waterfall.buildVariants[0].builds[1].tasks[1]],
              },
            ],
          },
          waterfall.buildVariants[1],
          {
            ...waterfall.buildVariants[2],
            builds: [
              {
                ...waterfall.buildVariants[2].builds[0],
                tasks: [waterfall.buildVariants[2].builds[0].tasks[0]],
              },
            ],
          },
        ],
      };

      expect(result.current).toStrictEqual(filteredWaterfall);
    });

    it("applies task and build variant filters", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall?tasks=1&buildVariants=foo",
          }),
        },
      );

      expect(result.current).toStrictEqual({
        activeVersionIds: [],
        versions: [
          {
            inactiveVersions: flattenedVersions,
            version: null,
          },
        ],
        buildVariants: [],
      });
    });
  });

  describe("status filter", () => {
    it("matches on statuses", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall?statuses=started",
          }),
        },
      );

      expect(result.current).toStrictEqual({
        activeVersionIds: ["b"],
        versions: [
          {
            inactiveVersions: [flattenedVersions[0]],
            version: null,
          },
          {
            inactiveVersions: null,
            version: flattenedVersions[1],
          },
          {
            inactiveVersions: [flattenedVersions[2]],
            version: null,
          },
        ],
        buildVariants: [
          {
            ...waterfall.buildVariants[0],
            builds: [waterfall.buildVariants[0].builds[1]],
          },
          waterfall.buildVariants[1],
        ],
      });
    });

    it("matches on status when no display status is present", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall?statuses=success",
          }),
        },
      );

      expect(result.current).toStrictEqual({
        activeVersionIds: ["c"],
        versions: [
          {
            inactiveVersions: [flattenedVersions[0], flattenedVersions[1]],
            version: null,
          },
          {
            inactiveVersions: null,
            version: flattenedVersions[2],
          },
        ],
        buildVariants: [
          {
            ...waterfall.buildVariants[2],
            builds: [
              {
                ...waterfall.buildVariants[2].builds[0],
                tasks: [waterfall.buildVariants[2].builds[0].tasks[0]],
              },
            ],
          },
        ],
      });
    });

    it("applies task name and status filter", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            buildVariants: waterfall.buildVariants,
            flattenedVersions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry:
              "/project/spruce/waterfall?statuses=success&tasks=foo",
          }),
        },
      );

      expect(result.current).toStrictEqual({
        activeVersionIds: [],
        versions: [
          {
            inactiveVersions: flattenedVersions,
            version: null,
          },
        ],
        buildVariants: [],
      });
    });
  });
});

const flattenedVersions: WaterfallVersionFragment[] = [
  {
    id: "a",
    author: "sophie.stadler",
    activated: false,
    createTime: new Date("2024-09-20T14:56:08Z"),
    errors: [],
    message: "bar",
    requester: "gitter_request",
    revision: "86f7e437faa5a7fce15d1ddcb9eaeaea377667b8",
    order: 2,
  },
  {
    id: "b",
    author: "sophie.stadler",
    activated: true,
    createTime: new Date("2024-09-19T14:56:08Z"),
    errors: [],
    message: "foo",
    requester: "gitter_request",
    revision: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    order: 1,
  },
  {
    id: "c",
    author: "sophie.stadler",
    activated: true,
    createTime: new Date("2024-11-07T14:56:08Z"),
    errors: [],
    message: "baz",
    requester: "trigger_request",
    revision:
      "9b0eb8edb5878371ca459839d0dfdbc9d175d2de0a4fcfb8f55f516687a1e920",
    order: 1,
  },
];

const waterfall = {
  buildVariants: [
    {
      id: "1",
      version: "a",
      displayName: "BV 1",
      builds: [
        {
          activated: false,
          displayName: "Build A",
          id: "i",
          tasks: [],
          version: "a",
        },
        {
          activated: true,
          displayName: "Build 12345",
          id: "ii",
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
          version: "b",
        },
      ],
    },
    {
      id: "2",
      displayName: "BV 2",
      version: "b",
      builds: [
        {
          activated: true,
          displayName: "Build B",
          id: "ii",
          tasks: [
            {
              displayName: "Task 100",
              displayStatusCache: "started",
              execution: 0,
              id: "task_100",
              status: "started",
            },
          ],
          version: "b",
        },
      ],
    },
    {
      id: "3",
      displayName: "BV 3",
      version: "c",
      builds: [
        {
          activated: true,
          displayName: "Build C",
          id: "iii",
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
          version: "c",
        },
      ],
    },
  ],
  versions: [
    {
      inactiveVersions: [flattenedVersions[0]],
      version: null,
    },
    {
      inactiveVersions: null,
      version: flattenedVersions[1],
    },
    {
      inactiveVersions: null,
      version: flattenedVersions[2],
    },
  ],
};
