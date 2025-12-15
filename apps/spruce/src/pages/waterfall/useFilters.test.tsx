import { MemoryRouter } from "react-router-dom";
import { renderHook } from "@evg-ui/lib/test_utils";
import { buildVariants, groupedVersions, versions } from "./testData";
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
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
            pins: [],
          }),
        {
          wrapper: createWrapper(),
        },
      );
      expect(result.current).toStrictEqual({
        buildVariants,
        versions: groupedVersions,
        activeVersionIds: ["b", "c", "f"],
      });
    });

    it("should move version into inactive versions list and drop build variant when filter is applied", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
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
            inactiveVersions: versions,
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
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
            pins: ["3", "2"],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall",
          }),
        },
      );

      const pinnedWaterfall = {
        versions: groupedVersions,
        activeVersionIds: ["b", "c", "f"],
        buildVariants: [buildVariants[1], buildVariants[2], buildVariants[0]],
      };

      expect(result.current).toStrictEqual(pinnedWaterfall);
    });
  });

  describe("build variant filters", () => {
    it("should filter build variant list when filter is applied", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
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
            inactiveVersions: versions,
            version: null,
          },
        ],
      };

      expect(result.current).toStrictEqual(filteredWaterfall);
    });

    it("build variant filters are added together with inactive builds included", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall?buildVariants=yooo,bv",
          }),
        },
      );

      const filteredWaterfall = {
        buildVariants: [buildVariants[0], buildVariants[1], buildVariants[2]],
        versions: [
          groupedVersions[0],
          groupedVersions[1],
          groupedVersions[2],
          {
            inactiveVersions: [versions[3], versions[4]],
            version: null,
          },
          groupedVersions[4],
        ],
        activeVersionIds: ["b", "c", "f"],
      };

      expect(result.current).toStrictEqual(filteredWaterfall);
    });
  });

  describe("task filters", () => {
    it("should filter build variant list and tasks when filter is applied", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
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
            ...buildVariants[0],
            builds: [
              {
                ...buildVariants[0].builds[0],
                tasks: [buildVariants[0].builds[0].tasks[1]],
              },
            ],
          },
        ],
        versions: [
          groupedVersions[0],
          groupedVersions[1],
          {
            inactiveVersions: [
              versions[2],
              versions[3],
              versions[4],
              versions[5],
            ],
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
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
            pins: [],
          }),
        {
          wrapper: createWrapper({
            initialEntry: "/project/spruce/waterfall?tasks=1",
          }),
        },
      );

      const filteredWaterfall = {
        versions: [
          groupedVersions[0],
          groupedVersions[1],
          { inactiveVersions: null, version: versions[2] },
          {
            inactiveVersions: [versions[3], versions[4], versions[5]],
            version: null,
          },
        ],
        activeVersionIds: ["b", "c"],
        buildVariants: [
          {
            ...buildVariants[0],
            builds: [
              {
                ...buildVariants[0].builds[0],
                tasks: [buildVariants[0].builds[0].tasks[1]],
              },
            ],
          },
          buildVariants[1],
          {
            ...buildVariants[2],
            builds: [
              {
                ...buildVariants[2].builds[0],
                tasks: [buildVariants[2].builds[0].tasks[0]],
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
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
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
            inactiveVersions: versions,
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
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
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
            inactiveVersions: [versions[0]],
            version: null,
          },
          {
            inactiveVersions: null,
            version: versions[1],
          },
          {
            inactiveVersions: [
              versions[2],
              versions[3],
              versions[4],
              versions[5],
            ],
            version: null,
          },
        ],
        buildVariants: [
          {
            ...buildVariants[0],
            builds: [buildVariants[0].builds[0]],
          },
          buildVariants[1],
        ],
      });
    });

    it("matches on status when no display status is present", () => {
      const { result } = renderHook(
        () =>
          useFilters({
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
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
            inactiveVersions: [versions[0], versions[1]],
            version: null,
          },
          {
            inactiveVersions: null,
            version: versions[2],
          },
          {
            inactiveVersions: [versions[3], versions[4], versions[5]],
            version: null,
          },
        ],
        buildVariants: [
          {
            ...buildVariants[2],
            builds: [
              {
                ...buildVariants[2].builds[0],
                tasks: [buildVariants[2].builds[0].tasks[0]],
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
            activeVersionIds: ["b", "c", "f"],
            flattenedVersions: versions,
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
            inactiveVersions: versions,
            version: null,
          },
        ],
        buildVariants: [],
      });
    });
  });
});
