import {
  Suspense,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ApolloClient, ApolloLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { useParams } from "react-router-dom";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  act,
  renderWithRouterMatch,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { WalkthroughGuideCueRef } from "components/WalkthroughGuideCue";
import { cache } from "gql/client/cache";
import {
  WaterfallOptions,
  WaterfallQuery,
  WaterfallQueryVariables,
} from "gql/generated/types";
import { WATERFALL } from "gql/queries";
import { PaginationButtons } from "./PaginationButtons";
import { BuildVariant, Pagination } from "./types";
import WaterfallErrorBoundary from "./WaterfallErrorBoundary";
import { WaterfallGrid } from "./WaterfallGrid";

export const baseOptions: WaterfallOptions = {
  projectIdentifier: "spruce",
  requesters: [],
  statuses: [],
  tasks: [],
  variants: [],
  includeAllBuildsAndTasks: true,
  omitInactiveBuilds: false,
  limit: 5,
  maxOrder: 0,
  minOrder: 0,
  revision: null,
};

type WaterfallMock = MockLink.MockedResponse<
  WaterfallQuery,
  WaterfallQueryVariables
>;

export const makeMock = ({
  data,
  delay = 0,
  options,
}: {
  options: Partial<WaterfallOptions>;
  data: WaterfallQuery;
  delay?: number;
}): WaterfallMock => ({
  request: {
    query: WATERFALL,
    variables: { options: { ...baseOptions, ...options } },
  },
  result: { data },
  delay,
});

export const cachePreview = ({
  data,
  options = {},
}: {
  data: WaterfallQuery;
  options?: Partial<WaterfallOptions>;
}) =>
  cache.writeQuery({
    query: WATERFALL,
    variables: { options: { ...baseOptions, ...options } },
    data,
  });

vi.mock("analytics", () => ({
  useWaterfallAnalytics: () => ({ sendEvent: vi.fn() }),
}));
vi.mock("hooks", () => ({ useUserTimeZone: () => "UTC" }));
vi.mock("hooks/useIntersectionObserver", () => ({ default: vi.fn() }));
const waterfallMocks = vi.hoisted(() => ({
  reportError: vi.fn(() => ({ warning: vi.fn() })),
  useWaterfallTrace: vi.fn(),
  useWaterfallNavigationTrace: vi.fn(),
  startWaterfallNavigationTrace: vi.fn(),
}));

vi.mock("./useWaterfallTrace", () => ({
  useWaterfallTrace: waterfallMocks.useWaterfallTrace,
  useWaterfallNavigationTrace: waterfallMocks.useWaterfallNavigationTrace,
  startWaterfallNavigationTrace: waterfallMocks.startWaterfallNavigationTrace,
}));
vi.mock("./OnboardingTutorial", () => ({ OnboardingTutorial: () => null }));
vi.mock("./WaterfallSkeleton", () => ({ default: () => <Skeleton /> }));
vi.mock("./VersionLabel", () => ({
  VersionLabelView: { Waterfall: "waterfall" },
  VersionLabel: ({ version }: { version: { id: string } }) => (
    <span data-testid="version-label-active">{version.id}</span>
  ),
}));
vi.mock("./InactiveVersions", () => ({
  InactiveVersionsButton: ({
    versions,
  }: {
    versions: WaterfallQuery["waterfall"]["versions"];
  }) => (
    <span data-testid="inactive-versions-group">
      {versions.map(({ id }) => id).join(",")}
    </span>
  ),
}));
vi.mock("./BuildRow", () => ({
  BuildRow: ({ build }: { build: BuildVariant }) => (
    <div data-testid="build-row">
      {build.builds.flatMap((b) =>
        b.tasks.map((task) => (
          <span key={task.id} data-testid="task">
            {task.displayName}
          </span>
        )),
      )}
    </div>
  ),
}));
vi.mock("@evg-ui/lib/utils/errorReporting", () => ({
  reportError: waterfallMocks.reportError,
}));

const SkeletonMountContext = createContext<() => void>(() => {});
const Skeleton = () => {
  const skeletonMounted = useContext(SkeletonMountContext);
  useEffect(() => {
    skeletonMounted();
  }, [skeletonMounted]);
  return <div data-testid="initial-skeleton" />;
};

const Harness = ({
  omitInactiveBuilds = false,
  skeletonMounted,
}: {
  omitInactiveBuilds?: boolean;
  skeletonMounted: () => void;
}) => {
  const { projectIdentifier = "spruce" } = useParams();
  const guideCueRef = useRef<WalkthroughGuideCueRef>(null);
  const [pagination, setPagination] = useState<Pagination>();
  return (
    <SkeletonMountContext.Provider value={skeletonMounted}>
      <PaginationButtons pagination={pagination} />
      <Suspense fallback={<Skeleton />}>
        <WaterfallErrorBoundary projectIdentifier={projectIdentifier}>
          <WaterfallGrid
            key={projectIdentifier}
            guideCueRef={guideCueRef}
            omitInactiveBuilds={omitInactiveBuilds}
            projectIdentifier={projectIdentifier}
            setPagination={setPagination}
          />
        </WaterfallErrorBoundary>
      </Suspense>
    </SkeletonMountContext.Provider>
  );
};

const clients: ApolloClient[] = [];
export const setup = (
  mocks: WaterfallMock[],
  { omitInactiveBuilds = false, search = "" } = {},
) => {
  const { dispatchToast } = RenderFakeToastContext();
  const skeletonMounted = vi.fn();
  const requests: Record<string, unknown>[] = [];
  const link = new ApolloLink((operation, forward) => {
    requests.push(operation.variables);
    return forward(operation);
  });
  const client = new ApolloClient({
    cache,
    link: link.concat(new MockLink(mocks)),
  });
  clients.push(client);
  const { router } = renderWithRouterMatch(
    <ApolloProvider client={client}>
      <Harness
        omitInactiveBuilds={omitInactiveBuilds}
        skeletonMounted={skeletonMounted}
      />
    </ApolloProvider>,
    {
      path: "/project/:projectIdentifier/waterfall",
      route: `/project/spruce/waterfall${search}`,
    },
  );
  const navigate = async (nextSearch: string) => {
    await act(() => router.navigate(`/project/spruce/waterfall${nextSearch}`));
  };
  return { client, dispatchToast, navigate, requests, router, skeletonMounted };
};
export const versionIds = () =>
  screen
    .queryAllByTestId("version-label-active")
    .map((node) => node.textContent);
export const tasks = () =>
  screen.queryAllByTestId("task").map((node) => node.textContent);
export const waitForPageLoad = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
    expect(screen.queryByTestId("initial-skeleton")).not.toBeInTheDocument();
  });
};

export const resetWaterfallGridTest = () => {
  cache.restore({});
  localStorage.clear();
};

export const { reportError, useWaterfallTrace } = waterfallMocks;

export const cleanupWaterfallGridTest = () => {
  const clientsToStop = clients.splice(0);
  clientsToStop.forEach((client) => client.stop());
  vi.useRealTimers();
  vi.restoreAllMocks();
};
