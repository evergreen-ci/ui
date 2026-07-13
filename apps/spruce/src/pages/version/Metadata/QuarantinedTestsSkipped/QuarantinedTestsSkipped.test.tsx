import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables,
  VersionQuarantinedTasksQuery,
  VersionQuarantinedTasksQueryVariables,
} from "gql/generated/types";
import {
  TASK_QUARANTINED_TESTS_SAMPLE,
  VERSION_QUARANTINED_TASKS,
} from "gql/queries";
import {
  FULL_LIST_LIMIT,
  MODAL_DISPLAY_LIMIT,
} from "pages/task/taskTabs/testsTable/QuarantinedTests/utils";
import { QuarantinedTestsSkipped } from ".";

const getVersionTasksMock = (
  counts: [number, number, number],
): ApolloMock<
  VersionQuarantinedTasksQuery,
  VersionQuarantinedTasksQueryVariables
> => ({
  request: {
    query: VERSION_QUARANTINED_TASKS,
    variables: { versionId: "v1" },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: "v1",
        tasks: {
          __typename: "VersionTasks",
          count: 3,
          data: [
            {
              __typename: "Task",
              id: "ta",
              buildVariantDisplayName: "Ubuntu 16.04",
              displayName: "test_model",
              execution: 0,
              quarantinedTestsSkippedCount: counts[0],
            },
            {
              __typename: "Task",
              id: "tb",
              buildVariantDisplayName: "Ubuntu 16.04",
              displayName: "test_agent",
              execution: 0,
              quarantinedTestsSkippedCount: counts[1],
            },
            {
              __typename: "Task",
              id: "tc",
              buildVariantDisplayName: "Ubuntu 16.04",
              displayName: "clean_task",
              execution: 0,
              quarantinedTestsSkippedCount: counts[2],
            },
          ],
        },
      },
    },
  },
});

const getSamplesMock = (
  limit: number,
): ApolloMock<
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables
> => ({
  request: {
    query: TASK_QUARANTINED_TESTS_SAMPLE,
    variables: { versionId: "v1", taskIds: ["ta", "tb"], limit },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: "v1",
        taskQuarantinedTestsSample: [
          {
            __typename: "TaskQuarantinedTestsSample",
            taskId: "ta",
            execution: 0,
            quarantinedTestsSkippedCount: 4,
            quarantinedTests: [
              {
                __typename: "QuarantinedTest",
                displayTestName: "Alpha Test",
                testName: "alpha_test",
              },
              {
                __typename: "QuarantinedTest",
                displayTestName: null,
                testName: "beta_test",
              },
            ],
          },
          {
            __typename: "TaskQuarantinedTestsSample",
            taskId: "tb",
            execution: 0,
            quarantinedTestsSkippedCount: 2,
            quarantinedTests: [
              {
                __typename: "QuarantinedTest",
                displayTestName: null,
                testName: "gamma_test",
              },
            ],
          },
        ],
      },
    },
  },
});

const defaultMocks = [
  getVersionTasksMock([4, 2, 0]),
  getSamplesMock(MODAL_DISPLAY_LIMIT),
  getSamplesMock(FULL_LIST_LIMIT),
];

const Component = ({
  mocks = defaultMocks,
}: {
  mocks?: typeof defaultMocks;
}) => (
  <MockedProvider mocks={mocks}>
    <QuarantinedTestsSkipped versionId="v1" />
  </MockedProvider>
);

const routerOptions = { path: "/version/:id", route: "/version/v1" };

describe("version QuarantinedTestsSkipped", () => {
  beforeAll(() => {
    stubGetClientRects();
    Object.defineProperty(URL, "createObjectURL", {
      value: vi.fn(() => "blob:mock"),
      writable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: vi.fn(),
      writable: true,
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when no tasks skipped tests", async () => {
    const { Component: TestComponent } = RenderFakeToastContext(
      <Component mocks={[getVersionTasksMock([0, 0, 0])]} />,
    );
    render(<TestComponent />, routerOptions);
    await expect(
      screen.findByDataCy("version-quarantined-test-skips", undefined, {
        timeout: 250,
      }),
    ).rejects.toThrow();
  });

  it("sums the per-task counts into the badge and opens the modal", async () => {
    const user = userEvent.setup();
    const { Component: TestComponent } = RenderFakeToastContext(<Component />);
    render(<TestComponent />, routerOptions);
    expect(
      await screen.findByDataCy("version-quarantined-test-skips-badge"),
    ).toHaveTextContent("6");
    await user.click(screen.getByDataCy("version-quarantined-test-skips-link"));
    expect(screen.getByDataCy("version-quarantined-tests-modal")).toBeVisible();
    expect(await screen.findByText("Alpha Test")).toBeVisible();
    expect(screen.getByText("beta_test")).toBeVisible();
    expect(screen.getByText("gamma_test")).toBeVisible();
    const taskLinks = screen.getAllByDataCy(
      "version-quarantined-tests-task-link",
    );
    expect(taskLinks).toHaveLength(3);
    const href = taskLinks[0].getAttribute("href");
    expect(href).toContain("/task/ta/tests");
    expect(href).toContain("execution=0");
    expect(href).not.toContain("quarantinedTests");
    expect(
      screen.getByDataCy("version-quarantined-tests-truncation-note"),
    ).toHaveTextContent("Showing the first 3 of 6");
  });

  it("filters rows by test or task name", async () => {
    const user = userEvent.setup();
    const { Component: TestComponent } = RenderFakeToastContext(<Component />);
    render(<TestComponent />, routerOptions);
    await user.click(
      await screen.findByDataCy("version-quarantined-test-skips-link"),
    );
    await screen.findByText("Alpha Test");
    await user.type(
      screen.getByPlaceholderText("Search test or task names"),
      "test_agent",
    );
    expect(screen.getByText("gamma_test")).toBeVisible();
    expect(screen.queryByText("Alpha Test")).toBeNull();
  });

  it("downloads the whole version's list as JSON", async () => {
    const user = userEvent.setup();
    const { Component: TestComponent } = RenderFakeToastContext(<Component />);
    render(<TestComponent />, routerOptions);
    await user.click(
      await screen.findByDataCy("version-quarantined-test-skips-link"),
    );
    await screen.findByText("Alpha Test");
    await user.click(screen.getByDataCy("version-quarantined-tests-download"));
    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    });
    const blob = vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob;
    expect(JSON.parse(await blob.text())).toStrictEqual({
      versionId: "v1",
      quarantinedTestsSkippedCount: 6,
      tasks: [
        {
          taskDisplayName: "test_model",
          buildVariantDisplayName: "Ubuntu 16.04",
          taskId: "ta",
          execution: 0,
          quarantinedTestsSkippedCount: 4,
          truncated: true,
          quarantinedTests: [
            { testName: "alpha_test", displayTestName: "Alpha Test" },
            { testName: "beta_test" },
          ],
        },
        {
          taskDisplayName: "test_agent",
          buildVariantDisplayName: "Ubuntu 16.04",
          taskId: "tb",
          execution: 0,
          quarantinedTestsSkippedCount: 2,
          truncated: true,
          quarantinedTests: [{ testName: "gamma_test" }],
        },
      ],
    });
  });
});
