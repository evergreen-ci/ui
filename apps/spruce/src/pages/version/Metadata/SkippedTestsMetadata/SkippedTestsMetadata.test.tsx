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
} from "pages/task/metadata/ExecutionSection/SkippedTestsMetadata/utils";
import { SkippedTestsMetadata } from ".";

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

const getVersionTasksErrorMock = (): ApolloMock<
  VersionQuarantinedTasksQuery,
  VersionQuarantinedTasksQueryVariables
> => ({
  request: {
    query: VERSION_QUARANTINED_TASKS,
    variables: { versionId: "v1" },
  },
  error: new Error("Failed to load version skipped tests"),
});

const getSamplesMock = (
  limit: number,
  {
    executions = [0, 0],
    includeSecondTask = true,
  }: {
    executions?: [number, number];
    includeSecondTask?: boolean;
  } = {},
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
            execution: executions[0],
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
          ...(includeSecondTask
            ? [
                {
                  __typename: "TaskQuarantinedTestsSample" as const,
                  taskId: "tb",
                  execution: executions[1],
                  quarantinedTestsSkippedCount: 2,
                  quarantinedTests: [
                    {
                      __typename: "QuarantinedTest" as const,
                      displayTestName: null,
                      testName: "gamma_test",
                    },
                  ],
                },
              ]
            : []),
        ],
      },
    },
  },
});

const getSamplesErrorMock = (
  limit: number,
): ApolloMock<
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables
> => ({
  request: {
    query: TASK_QUARANTINED_TESTS_SAMPLE,
    variables: { versionId: "v1", taskIds: ["ta", "tb"], limit },
  },
  error: new Error("Failed to load skipped test details"),
});

const defaultMocks = [
  getVersionTasksMock([4, 2, 0]),
  getSamplesMock(MODAL_DISPLAY_LIMIT),
  getSamplesMock(FULL_LIST_LIMIT),
];

const Component = ({
  mocks = defaultMocks,
  testSelectionEnabled = true,
}: {
  mocks?: typeof defaultMocks;
  testSelectionEnabled?: boolean;
}) => (
  <MockedProvider mocks={mocks}>
    <SkippedTestsMetadata
      testSelectionEnabled={testSelectionEnabled}
      versionId="v1"
    />
  </MockedProvider>
);

const routerOptions = { path: "/version/:id", route: "/version/v1" };

describe("version SkippedTestsMetadata", () => {
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

  it("does not query or show a loading state for projects without TSS", () => {
    const { Component: TestComponent } = RenderFakeToastContext(
      <Component mocks={[]} testSelectionEnabled={false} />,
    );
    render(<TestComponent />, routerOptions);

    expect(
      screen.queryByTestId("version-skipped-tests-metadata-loading"),
    ).toBeNull();
    expect(screen.queryByTestId("version-skipped-tests-metadata")).toBeNull();
  });

  it("renders nothing when no tasks skipped tests", async () => {
    const { Component: TestComponent } = RenderFakeToastContext(
      <Component mocks={[getVersionTasksMock([0, 0, 0])]} />,
    );
    render(<TestComponent />, routerOptions);
    await expect(
      screen.findByTestId("version-skipped-tests-metadata", undefined, {
        timeout: 250,
      }),
    ).rejects.toThrow();
  });

  it("shows an unavailable state and retries when loading version tasks fails", async () => {
    const user = userEvent.setup();
    const { Component: TestComponent } = RenderFakeToastContext(
      <Component
        mocks={[getVersionTasksErrorMock(), getVersionTasksMock([4, 2, 0])]}
      />,
    );
    render(<TestComponent />, routerOptions);

    expect(
      await screen.findByTestId("version-skipped-tests-metadata-error"),
    ).toHaveTextContent("Unavailable");
    await user.click(
      screen.getByTestId("version-skipped-tests-metadata-retry"),
    );
    expect(
      await screen.findByTestId("version-skipped-tests-metadata-count"),
    ).toHaveTextContent("6 tests");
  });

  it("sums the per-task counts and opens the modal", async () => {
    const user = userEvent.setup();
    const { Component: TestComponent } = RenderFakeToastContext(<Component />);
    render(<TestComponent />, routerOptions);
    expect(
      screen.getByTestId("version-skipped-tests-metadata-loading"),
    ).toBeVisible();
    expect(
      await screen.findByTestId("version-skipped-tests-metadata-count"),
    ).toHaveTextContent("6 tests");
    await user.click(
      screen.getByTestId("version-skipped-tests-details-button"),
    );
    expect(screen.getByTestId("skipped-tests-modal")).toBeVisible();
    expect(await screen.findByText("Alpha Test")).toBeVisible();
    expect(screen.getByText("beta_test")).toBeVisible();
    expect(screen.getByText("gamma_test")).toBeVisible();
    const taskLinks = screen.getAllByTestId("version-skipped-tests-task-link");
    expect(taskLinks).toHaveLength(3);
    const href = taskLinks[0].getAttribute("href");
    expect(href).toContain("/task/ta/tests");
    expect(href).toContain("execution=0");
    expect(href).not.toContain("quarantinedTests");
    expect(
      screen.getByTestId("skipped-tests-truncation-note"),
    ).toHaveTextContent("Showing the first 3 of 6");
  });

  it("filters rows by test or task name", async () => {
    const user = userEvent.setup();
    const { Component: TestComponent } = RenderFakeToastContext(<Component />);
    render(<TestComponent />, routerOptions);
    await user.click(
      await screen.findByTestId("version-skipped-tests-details-button"),
    );
    await screen.findByText("Alpha Test");
    await user.type(
      screen.getByPlaceholderText("Search test or task names"),
      "test_agent",
    );
    expect(screen.getByText("gamma_test")).toBeVisible();
    expect(screen.queryByText("Alpha Test")).toBeNull();
  });

  it("shows an error when the details query fails", async () => {
    const user = userEvent.setup();
    const { Component: TestComponent, dispatchToast } = RenderFakeToastContext(
      <Component
        mocks={[
          getVersionTasksMock([4, 2, 0]),
          getSamplesErrorMock(MODAL_DISPLAY_LIMIT),
        ]}
      />,
    );
    render(<TestComponent />, routerOptions);
    await user.click(
      await screen.findByTestId("version-skipped-tests-details-button"),
    );

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledWith(
        "There was an error loading the skipped test details.",
      );
    });
    expect(screen.queryByTestId("skipped-tests-modal")).toBeNull();
  });

  it("does not show samples from a different task execution", async () => {
    const user = userEvent.setup();
    const { Component: TestComponent, dispatchToast } = RenderFakeToastContext(
      <Component
        mocks={[
          getVersionTasksMock([4, 2, 0]),
          getSamplesMock(MODAL_DISPLAY_LIMIT, { executions: [1, 0] }),
        ]}
      />,
    );
    render(<TestComponent />, routerOptions);
    await user.click(
      await screen.findByTestId("version-skipped-tests-details-button"),
    );

    await waitFor(() => {
      expect(dispatchToast.warning).toHaveBeenCalledWith(
        "Skipped test details are not available for this version.",
      );
    });
    expect(screen.queryByTestId("skipped-tests-modal")).toBeNull();
  });

  it("downloads the whole version's list as JSON", async () => {
    const user = userEvent.setup();
    const { Component: TestComponent } = RenderFakeToastContext(<Component />);
    render(<TestComponent />, routerOptions);
    await user.click(
      await screen.findByTestId("version-skipped-tests-details-button"),
    );
    await screen.findByText("Alpha Test");
    await user.click(screen.getByTestId("skipped-tests-download"));
    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    });
    const blob = vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob;
    expect(JSON.parse(await blob.text())).toStrictEqual({
      versionId: "v1",
      skippedTestCount: 6,
      tasks: [
        {
          taskDisplayName: "test_model",
          buildVariantDisplayName: "Ubuntu 16.04",
          taskId: "ta",
          execution: 0,
          skippedTestCount: 4,
          truncated: true,
          skippedTests: [
            { testName: "alpha_test", displayTestName: "Alpha Test" },
            { testName: "beta_test" },
          ],
        },
        {
          taskDisplayName: "test_agent",
          buildVariantDisplayName: "Ubuntu 16.04",
          taskId: "tb",
          execution: 0,
          skippedTestCount: 2,
          truncated: true,
          skippedTests: [{ testName: "gamma_test" }],
        },
      ],
    });
  });

  it("does not download an incomplete task list", async () => {
    const user = userEvent.setup();
    const { Component: TestComponent, dispatchToast } = RenderFakeToastContext(
      <Component
        mocks={[
          getVersionTasksMock([4, 2, 0]),
          getSamplesMock(MODAL_DISPLAY_LIMIT),
          getSamplesMock(FULL_LIST_LIMIT, { includeSecondTask: false }),
        ]}
      />,
    );
    render(<TestComponent />, routerOptions);
    await user.click(
      await screen.findByTestId("version-skipped-tests-details-button"),
    );
    await screen.findByText("Alpha Test");
    await user.click(screen.getByTestId("skipped-tests-download"));

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledWith(
        "There was an error downloading the skipped test list.",
      );
    });
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
