import { renderHook } from "@evg-ui/lib/test_utils";
import { buildVariants, groupedVersions, versions } from "./testData";
import { ServerFilters } from "./types";
import { useFilters } from "./useFilters";

const setup = (options: Partial<Parameters<typeof useFilters>[0]> = {}) =>
  renderHook(() =>
    useFilters({
      activeVersionIds: ["b", "c", "f"],
      filters: {},
      flattenedVersions: versions,
      omitInactiveBuilds: false,
      pins: [],
      ...options,
    }),
  );

describe("useFilters", () => {
  it("does not reapply client filters to server-filtered data", () => {
    const { result } = setup({
      applyClientFilters: false,
      filters: {
        tasks: ["missing"],
        variants: ["missing"],
        statuses: ["failed"],
        requesters: ["git_tag_request"],
      },
      omitInactiveBuilds: true,
      pins: ["3"],
    });
    expect(result.current).toStrictEqual({
      activeVersionIds: ["b", "c", "f"],
      buildVariants: [buildVariants[2], buildVariants[0], buildVariants[1]],
      versions: groupedVersions,
    });
  });

  describe("omitting inactive builds", () => {
    const versionWithInactiveBuild = {
      ...versions[1],
      waterfallBuilds: versions[1].waterfallBuilds?.map((build, index) => ({
        ...build,
        activated: index === 0,
      })),
    };

    it.each([
      { tasks: ["Task"] },
      { variants: ["BV"] },
      { statuses: ["started"] },
      { requesters: ["gitter_request"] },
    ] satisfies ServerFilters[])("omits inactive builds with %j", (filters) => {
      const { result } = setup({
        activeVersionIds: ["b"],
        filters,
        flattenedVersions: [versionWithInactiveBuild],
        omitInactiveBuilds: true,
      });
      expect(result.current.buildVariants).toHaveLength(1);
      expect(result.current.buildVariants[0].id).toBe("1");
    });

    it("keeps inactive builds when omission is disabled", () => {
      const { result } = setup({
        activeVersionIds: ["b"],
        flattenedVersions: [versionWithInactiveBuild],
      });
      expect(result.current.buildVariants).toHaveLength(2);
    });
  });

  describe("requester filters", () => {
    it("should not make any versions inactive when no filters are applied", () => {
      const { result } = setup();
      expect(result.current).toStrictEqual({
        buildVariants,
        versions: groupedVersions,
        activeVersionIds: ["b", "c", "f"],
      });
    });

    it("should move version into inactive versions list and drop build variant when filter is applied", () => {
      const { result } = setup({
        filters: { requesters: ["git_tag_request"] },
      });

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
      const { result } = setup({ pins: ["3", "2"] });

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
      const { result } = setup({ filters: { variants: ["yooo"] } });

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
      const { result } = setup({ filters: { variants: ["yooo", "bv"] } });

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

    it("build variant filters omit inactive builds when setting is enabled", () => {
      const { result } = setup({
        filters: { variants: ["yooo", "bv"] },
        omitInactiveBuilds: true,
      });

      const filteredWaterfall = {
        buildVariants: [
          { ...buildVariants[0], builds: [buildVariants[0].builds[0]] },
          buildVariants[1],
          buildVariants[2],
        ],
        versions: [
          groupedVersions[0],
          groupedVersions[1],
          groupedVersions[2],
          {
            inactiveVersions: [versions[3], versions[4], versions[5]],
            version: null,
          },
        ],
        activeVersionIds: ["b", "c"],
      };

      expect(result.current).toStrictEqual(filteredWaterfall);
    });
  });

  describe("task filters", () => {
    it("should filter build variant list and tasks when filter is applied", () => {
      const { result } = setup({ filters: { tasks: ["15"] } });

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
      const { result } = setup({ filters: { tasks: ["1"] } });

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
      const { result } = setup({
        filters: { tasks: ["1"], variants: ["foo"] },
      });

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
      const { result } = setup({ filters: { statuses: ["started"] } });

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

    it("applies task name and status filter", () => {
      const { result } = setup({
        filters: { statuses: ["success"], tasks: ["foo"] },
      });

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
