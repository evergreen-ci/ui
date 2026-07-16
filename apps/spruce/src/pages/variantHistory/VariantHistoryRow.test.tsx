import {
  MockedProvider,
  MockedResponse,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { context, types } from "components/HistoryTable";
import { HistoryTableReducerState } from "components/HistoryTable/historyTableContextReducer";
import { mainlineCommitData } from "components/HistoryTable/testData";
import { CommitRowType } from "components/HistoryTable/types";
import {
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables,
} from "gql/generated/types";
import { TASK_TEST_SAMPLE } from "gql/queries";
import { TestStatus } from "types/history";
import VariantHistoryRow from "./VariantHistoryRow";

const { HistoryTableProvider } = context;
const { rowType } = types;

const initialState: HistoryTableReducerState = {
  columnLimit: 7,
  columns: [],
  commitCache: new Map(),
  commitCount: 10,
  currentPage: 0,
  historyTableFilters: [],
  loadedCommits: [],
  pageCount: 0,
  processedCommitCount: 0,
  processedCommits: [],
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  selectedCommit: null,
  visibleColumns: [],
};

interface wrapperProps {
  children: React.ReactNode;
  mocks?: MockedResponse[];
  state?: Partial<HistoryTableReducerState>;
}

const wrapper: React.FC<wrapperProps> = ({ children, mocks = [], state }) => (
  <MockedProvider mocks={mocks}>
    <HistoryTableProvider initialState={{ ...initialState, ...state }}>
      {children}
    </HistoryTableProvider>
  </MockedProvider>
);

describe("variantHistoryRow", () => {
  it("renders a row when there is data", () => {
    render(<VariantHistoryRow data={taskRow} index={0} />, {
      path: "/variant-history/:projectId/:variantName",
      route: "/variant-history/mci/ubuntu1604",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            // @ts-expect-error FIXME: This will be fixed when we update task history https://jira.mongodb.org/browse/DEVPROD-6584
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: [
              "test-cmd-codegen-core",
              "test-thirdparty",
              "test-db-auth",
              "test-evergreen",
              "test-graphql",
              "test-jira-integration",
              "test-mci",
            ],
          },
        }),
    });
    expect(screen.queryAllByDataCy("loading-cell")).toHaveLength(0);
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(7);
  });

  it("amount of cells rendered corresponds to the amount of visibleColumns", () => {
    render(<VariantHistoryRow data={taskRow} index={0} />, {
      path: "/variant-history/:projectId/:variantName",
      route: "/variant-history/mci/ubuntu1604",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            // @ts-expect-error FIXME: This will be fixed when we update task history https://jira.mongodb.org/browse/DEVPROD-6584
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: [
              "test-cmd-codegen-core",
              "test-thirdparty",
              "test-db-auth",
            ],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(3);
  });

  it("renders a blank cell when there isn't a matching variant for that column", () => {
    render(<VariantHistoryRow data={taskRow} index={0} />, {
      path: "/variant-history/:projectId/:variantName",
      route: "/variant-history/mci/ubuntu1604",
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            // @ts-expect-error FIXME: This will be fixed when we update task history https://jira.mongodb.org/browse/DEVPROD-6584
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: ["test-cmd-codegen-core", "DNE"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(1);
  });

  it("should show failing tests when you hover over a failing task cell and there are no filters applied", async () => {
    const user = userEvent.setup();
    render(<VariantHistoryRow data={taskRow} index={0} />, {
      path: "/variant-history/:projectId/:variantName",
      route: "/variant-history/mci/ubuntu1604",
      wrapper: ({ children }) =>
        wrapper({
          children,
          mocks,
          state: {
            // @ts-expect-error FIXME: This will be fixed when we update task history https://jira.mongodb.org/browse/DEVPROD-6584
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: ["test-cmd-codegen-core"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(0);
    await waitFor(() => {
      expect(screen.queryByDataCy("history-table-icon")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
    });
    await user.hover(screen.getByDataCy("history-table-icon"));
    await screen.findByText("TestJiraIntegration");
  });

  it("should show a matching test label when looking at a task cell with filters applied", async () => {
    const user = userEvent.setup();
    render(<VariantHistoryRow data={taskRow} index={0} />, {
      path: "/variant-history/:projectId/:variantName",
      route: "/variant-history/mci/ubuntu1604",
      wrapper: ({ children }) =>
        wrapper({
          children,
          mocks,
          state: {
            historyTableFilters: [
              {
                testName: "TestJiraIntegration",
                testStatus: TestStatus.Failed,
              },
            ],
            // @ts-expect-error FIXME: This will be fixed when we update task history https://jira.mongodb.org/browse/DEVPROD-6584
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: ["test-cmd-codegen-core"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(0);

    await waitFor(() => {
      expect(screen.queryByDataCy("task-cell")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
    });
    await waitFor(() => {
      expect(screen.queryByDataCy("history-table-icon")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
    });

    expect(screen.queryByText("1 / 1 Failing Tests")).toBeVisible();
    await user.hover(screen.getByDataCy("history-table-icon"));
    await screen.findByText("TestJiraIntegration");
  });

  it("should disable a task cell when there are test filters applied and it does not match the task filters", () => {
    render(<VariantHistoryRow data={taskRow} index={0} />, {
      path: "/variant-history/:projectId/:variantName",
      route: "/variant-history/mci/ubuntu1604",
      wrapper: ({ children }) =>
        wrapper({
          children,
          mocks,
          state: {
            historyTableFilters: [
              { testName: "NotARealTest", testStatus: TestStatus.Failed },
            ],
            // @ts-expect-error FIXME: This will be fixed when we update task history https://jira.mongodb.org/browse/DEVPROD-6584
            loadedCommits: [mainlineCommitData.versions[0].version],
            processedCommitCount: 1,
            processedCommits: [taskRow],
            visibleColumns: ["test-cmd-codegen-core"],
          },
        }),
    });
    expect(screen.queryAllByDataCy("task-cell")).toHaveLength(1);
    expect(screen.queryAllByDataCy("empty-cell")).toHaveLength(0);
    expect(screen.queryByDataCy("task-cell")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

const taskRow: CommitRowType = {
  commit: {
    buildVariants: [
      {
        displayName: "Ubuntu 16.04",
        tasks: [
          {
            displayName: "test-cmd-codegen-core",
            displayStatus: "failed",
            execution: 0,
            id: "some_id_1",
          },
          {
            displayName: "test-thirdparty",
            displayStatus: "success",
            execution: 0,
            id: "some_id_2",
          },
          {
            displayName: "test-db-auth",
            displayStatus: "success",
            execution: 0,
            id: "some_id_3",
          },
          {
            displayName: "test-evergreen",
            displayStatus: "success",
            execution: 0,
            id: "some_id_4",
          },
          {
            displayName: "test-graphql",
            displayStatus: "success",
            execution: 0,
            id: "some_id_5",
          },
          {
            displayName: "test-jira-integration",
            displayStatus: "success",
            execution: 0,
            id: "some_id_6",
          },
          {
            displayName: "test-mci",
            displayStatus: "success",
            execution: 0,
            id: "some_id_7",
          },
        ],
        variant: "ubuntu1604",
      },
    ],
    createTime: new Date("2021-09-02T14:20:04Z"),
    id: "evergreen_d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
    message:
      "EVG-15213: Reference a project’s configuration when interacting with perf plugin configs (#4992)",
    order: 3399,
    revision: "d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
    user: {
      displayName: "Malik Hadjri",
      userId: "malik.hadjri",
    },
  },
  date: new Date("2021-09-02T14:20:04Z"),
  selected: false,
  type: rowType.COMMIT,
};

const noFilterData: ApolloMock<
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables
> = {
  request: {
    query: TASK_TEST_SAMPLE,
    variables: {
      filters: [],
      taskIds: [
        "some_id_1",
        "some_id_2",
        "some_id_3",
        "some_id_4",
        "some_id_5",
        "some_id_6",
        "some_id_7",
      ],
      versionId: "evergreen_d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          __typename: "TaskTestResultSample",
          execution: 0,
          matchingFailedTestNames: ["TestJiraIntegration"],
          taskId: "some_id_1",
          totalTestCount: 1,
        },
      ],
    },
  },
};

const withMatchingFilter: ApolloMock<
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables
> = {
  request: {
    query: TASK_TEST_SAMPLE,
    variables: {
      filters: [
        { testName: "TestJiraIntegration", testStatus: TestStatus.Failed },
      ],
      taskIds: [
        "some_id_1",
        "some_id_2",
        "some_id_3",
        "some_id_4",
        "some_id_5",
        "some_id_6",
        "some_id_7",
      ],
      versionId: "evergreen_d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          __typename: "TaskTestResultSample",
          execution: 0,
          matchingFailedTestNames: ["TestJiraIntegration"],
          taskId: "some_id_1",
          totalTestCount: 1,
        },
      ],
    },
  },
};

const withNonMatchingFilter: ApolloMock<
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables
> = {
  request: {
    query: TASK_TEST_SAMPLE,
    variables: {
      filters: [{ testName: "NotARealTest", testStatus: TestStatus.Failed }],
      taskIds: [
        "some_id_1",
        "some_id_2",
        "some_id_3",
        "some_id_4",
        "some_id_5",
        "some_id_6",
        "some_id_7",
      ],
      versionId: "evergreen_d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
    },
  },
  result: {
    data: {
      taskTestSample: [
        {
          __typename: "TaskTestResultSample",
          execution: 0,
          matchingFailedTestNames: [],
          taskId: "some_id_1",
          totalTestCount: 1,
        },
      ],
    },
  },
};

const mocks = [withMatchingFilter, withNonMatchingFilter, noFilterData];
