import { MemoryRouter } from "react-router-dom";
import { renderHook } from "@evg-ui/lib/test_utils";
import { buildVariants } from "./testData";
import { BuildVariant, Version } from "./types";
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
                ...waterfall.buildVariants[0].builds[0],
                tasks: [waterfall.buildVariants[0].builds[0].tasks[1]],
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
        activeVersionIds: ["b", "c"],
        buildVariants: [
          {
            ...waterfall.buildVariants[0],
            builds: [
              {
                ...waterfall.buildVariants[0].builds[0],
                tasks: [waterfall.buildVariants[0].builds[0].tasks[1]],
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
            builds: [waterfall.buildVariants[0].builds[0]],
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

const flattenedVersions: Version[] = [
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

const waterfall: {
  buildVariants: BuildVariant[];
} = {
  buildVariants,
};
