import { MemoryRouter } from "react-router-dom";
import { renderHook } from "@evg-ui/lib/test_utils";
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
      const { result } = renderHook(() => useFilters(waterfall, []), {
        wrapper: createWrapper(),
      });
      expect(result.current).toMatchObject(waterfall);
    });

    it("should move version into inactive versions list and drop build variant when filter is applied", () => {
      const { result } = renderHook(() => useFilters(waterfall, []), {
        wrapper: createWrapper({
          initialEntry: "/project/spruce/waterfall?requesters=git_tag_request",
        }),
      });

      const filteredWaterfall = {
        buildVariants: [],
        versions: [
          {
            version: null,
            inactiveVersions: [
              waterfall.versions[0]?.inactiveVersions?.[0],
              waterfall.versions[1].version,
            ],
          },
        ],
      };

      expect(result.current).toMatchObject(filteredWaterfall);
    });
  });

  describe("pinned build variants", () => {
    it("should push pins to the top of list of build variants and preserve their original order", () => {
      const { result } = renderHook(() => useFilters(waterfall, ["3", "2"]), {
        wrapper: createWrapper({
          initialEntry: "/project/spruce/waterfall",
        }),
      });

      const pinnedWaterfall = {
        ...waterfall,
        buildVariants: [
          waterfall.buildVariants[1],
          waterfall.buildVariants[2],
          waterfall.buildVariants[0],
        ],
      };

      expect(result.current).toMatchObject(pinnedWaterfall);
    });
  });

  describe("build variant filters", () => {
    it("should filter build variant list when filter is applied", () => {
      const { result } = renderHook(() => useFilters(waterfall, []), {
        wrapper: createWrapper({
          initialEntry: "/project/spruce/waterfall?buildVariants=yooo",
        }),
      });

      const filteredWaterfall = {
        ...waterfall,
        buildVariants: [],
      };

      expect(result.current).toMatchObject(filteredWaterfall);
    });

    it("build variant filters are added together", () => {
      const { result } = renderHook(() => useFilters(waterfall, []), {
        wrapper: createWrapper({
          initialEntry: "/project/spruce/waterfall?buildVariants=yooo,bv",
        }),
      });

      const filteredWaterfall = {
        ...waterfall,
      };

      expect(result.current).toMatchObject(filteredWaterfall);
    });
  });
});

const waterfall = {
  buildVariants: [
    {
      id: "1",
      displayName: "BV 1",
      version: "a",
      builds: [
        {
          activated: true,
          displayName: "Build A",
          id: "i",
          tasks: [],
          version: "a",
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
          tasks: [],
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
          tasks: [],
          version: "c",
        },
      ],
    },
  ],
  versions: [
    {
      inactiveVersions: [
        {
          id: "a",
          author: "sophie.stadler",
          activated: false,
          createTime: new Date("2024-09-20T14:56:08Z"),
          errors: [],
          message: "bar",
          requester: "gitter_request",
          revision: "86f7e437faa5a7fce15d1ddcb9eaeaea377667b8",
        },
      ],
      version: null,
    },
    {
      inactiveVersions: null,
      version: {
        id: "b",
        author: "sophie.stadler",
        activated: true,
        createTime: new Date("2024-09-19T14:56:08Z"),
        errors: [],
        message: "foo",
        requester: "gitter_request",
        revision: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
      },
    },
  ],
};
