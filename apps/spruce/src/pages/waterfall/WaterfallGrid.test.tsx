import { renderWithRouterMatch, screen } from "@evg-ui/lib/test_utils";
import { WaterfallQuery } from "gql/generated/types";
import { useWaterfallData } from "./useWaterfallData";
import {
  useWaterfallNavigationTrace,
  useWaterfallTrace,
} from "./useWaterfallTrace";
import { WaterfallGrid } from "./WaterfallGrid";

vi.mock("analytics", () => ({
  useWaterfallAnalytics: () => ({ sendEvent: vi.fn() }),
}));
vi.mock("hooks", () => ({ useUserTimeZone: () => "UTC" }));
vi.mock("hooks/useIntersectionObserver", () => ({ default: vi.fn() }));
vi.mock("./useWaterfallTrace", () => ({
  useWaterfallTrace: vi.fn(),
  useWaterfallNavigationTrace: vi.fn(),
}));
vi.mock("./useWaterfallData", () => ({ useWaterfallData: vi.fn() }));
vi.mock("./OnboardingTutorial", () => ({ OnboardingTutorial: () => null }));
vi.mock("./EmptyState", () => ({ EmptyState: () => <div>No results</div> }));
vi.mock("./WaterfallSkeleton", () => ({
  default: () => <div>Skeleton</div>,
}));

const pagination: WaterfallQuery["waterfall"]["pagination"] = {
  activeVersionIds: [],
  hasNextPage: false,
  hasPrevPage: false,
  mostRecentVersionOrder: 20,
  nextPageOrder: 0,
  prevPageOrder: 0,
};
const ready: ReturnType<typeof useWaterfallData> = {
  activeVersionIds: [],
  buildVariants: [],
  data: { waterfall: { pagination, versions: [] } },
  fetchingMore: false,
  loading: false,
  settled: true,
  versions: [],
};

const setup = (state: Partial<typeof ready>) => {
  vi.mocked(useWaterfallData).mockReturnValue({ ...ready, ...state });
  const setPagination = vi.fn();
  const utils = renderWithRouterMatch(
    <WaterfallGrid
      guideCueRef={{ current: null }}
      omitInactiveBuilds={false}
      projectIdentifier="project"
      setPagination={setPagination}
    />,
  );
  return { ...utils, setPagination };
};

describe("WaterfallGrid query states", () => {
  it("shows the initial skeleton and disables pagination while loading", () => {
    const { setPagination } = setup({
      data: undefined,
      loading: true,
      settled: false,
    });
    expect(screen.getByText("Skeleton")).toBeVisible();
    expect(screen.queryByText("No results")).not.toBeInTheDocument();
    expect(setPagination).toHaveBeenLastCalledWith(undefined);
    expect(useWaterfallTrace).toHaveBeenLastCalledWith(false);
    expect(useWaterfallNavigationTrace).toHaveBeenLastCalledWith({
      data: undefined,
    });
  });

  it("shows the fetching indicator instead of an empty state for a pending preview", () => {
    const replaceState = vi.spyOn(window.history, "replaceState");
    const { setPagination } = setup({
      fetchingMore: true,
      settled: false,
    });
    expect(screen.getByTestId("fetch-more-loader")).toBeVisible();
    expect(screen.queryByText("Skeleton")).not.toBeInTheDocument();
    expect(screen.queryByText("No results")).not.toBeInTheDocument();
    expect(setPagination).toHaveBeenLastCalledWith(undefined);
    expect(useWaterfallTrace).toHaveBeenLastCalledWith(true);
    expect(useWaterfallNavigationTrace).toHaveBeenLastCalledWith({
      data: undefined,
    });
    expect(replaceState).not.toHaveBeenCalled();
    replaceState.mockRestore();
  });

  it("publishes pagination and the empty state only for a settled view", () => {
    const { setPagination } = setup({});
    expect(screen.getByText("No results")).toBeVisible();
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    expect(setPagination).toHaveBeenLastCalledWith(pagination);
    expect(useWaterfallTrace).toHaveBeenLastCalledWith(true);
    expect(useWaterfallNavigationTrace).toHaveBeenLastCalledWith({
      data: ready.data,
    });
  });
});
