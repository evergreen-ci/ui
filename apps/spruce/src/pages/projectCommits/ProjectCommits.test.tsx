import {
  MockedProvider,
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  getProjectCommitsRoute,
  getVersionRoute,
  routes,
} from "constants/routes";
import { cache } from "gql/client/cache";
import {
  ProjectCommitHistoryQuery,
  ProjectCommitHistoryQueryVariables,
} from "gql/generated/types";
import { PROJECT_COMMIT_HISTORY } from "gql/queries";
import {
  firstVersion,
  initialVariables,
  makeCommitHistoryData,
  secondVersion,
} from "./testData";
import ProjectCommits from ".";

vi.mock("analytics", () => ({
  useProjectHistoryAnalytics: () => ({ sendEvent: vi.fn() }),
}));

vi.mock("hooks", () => ({
  useDateFormat: () => (date: Date) => new Date(date).toISOString(),
  useSpruceConfig: () => undefined,
}));

vi.mock("components/Banners", () => ({ ProjectBanner: () => null }));
vi.mock("components/ProjectSelect", () => ({ ProjectSelect: () => null }));

type HistoryMock = ApolloMock<
  ProjectCommitHistoryQuery,
  ProjectCommitHistoryQueryVariables
> & { delay?: number };

const renderPage = (mocks: HistoryMock[]) =>
  renderWithRouterMatch(
    <MockedProvider cache={cache} mocks={mocks}>
      <ProjectCommits />
    </MockedProvider>,
    { path: routes.projectCommits, route: getProjectCommitsRoute("evergreen") },
  );

const firstPageMock: HistoryMock = {
  request: { query: PROJECT_COMMIT_HISTORY, variables: initialVariables },
  result: { data: makeCommitHistoryData([firstVersion], true) },
};

describe("ProjectCommits", () => {
  beforeEach(() => {
    cache.restore({});
  });

  afterEach(() => {
    cache.restore({});
  });

  it("renders commit details, column order, task percentages, and version links", async () => {
    renderPage([firstPageMock]);

    const link = await screen.findByRole("link", { name: "abcdef1" });
    expect(link).toHaveAttribute("href", getVersionRoute(firstVersion.id));
    expect(screen.getByText("Add project commit history")).toBeVisible();
    expect(screen.getByText("Sophie")).toBeVisible();
    expect(screen.getByText("2026-11-19T12:00:00.000Z")).toBeVisible();
    expect(
      screen.getAllByRole("columnheader").map((header) => header.textContent),
    ).toEqual([
      "Commit",
      "Created",
      "Author",
      "Message",
      "Tasks Finished",
      "Tasks Succeeded",
    ]);
    expect(screen.getByText("80%")).toBeVisible();
    expect(screen.getByText("(4/5)")).toBeVisible();
    expect(screen.getByText("75%")).toBeVisible();
    expect(screen.getByText("(3/4)")).toBeVisible();
    expect(document.title).toContain("evergreen Commits");
  });

  it("appends older commits without hiding existing rows and removes the button on the last page", async () => {
    const nextPageMock: HistoryMock = {
      request: {
        query: PROJECT_COMMIT_HISTORY,
        variables: { ...initialVariables, options: { limit: 50, maxOrder: 1 } },
      },
      result: { data: makeCommitHistoryData([secondVersion]) },
      delay: 100,
    };
    renderPage([firstPageMock, nextPageMock]);
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Show more commits" }),
    );
    expect(screen.getByRole("link", { name: "abcdef1" })).toBeVisible();
    expect(await screen.findByRole("link", { name: "123456a" })).toBeVisible();
    const rows = within(screen.getByRole("table")).getAllByTestId(
      "leafygreen-table-row",
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent(firstVersion.message);
    expect(rows[1]).toHaveTextContent(secondVersion.message);
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Show more commits" }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows loading rows until the first page arrives", async () => {
    renderPage([{ ...firstPageMock, delay: 100 }]);

    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      51,
    );
    expect(
      screen.getByRole("heading", { name: "Project Commits" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "abcdef1" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Show more commits" }),
    ).not.toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "abcdef1" })).toBeVisible();
  });

  it("renders an empty table without a load-more button for a project with no commits", async () => {
    renderPage([
      {
        request: firstPageMock.request,
        result: { data: makeCommitHistoryData([]) },
      },
    ]);

    await waitFor(() =>
      expect(
        cache.readQuery({
          query: PROJECT_COMMIT_HISTORY,
          variables: initialVariables,
        }),
      ).not.toBeNull(),
    );
    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.queryAllByTestId("leafygreen-table-row")).toHaveLength(0);
    expect(
      screen.queryByRole("button", { name: "Show more commits" }),
    ).not.toBeInTheDocument();
  });
});
