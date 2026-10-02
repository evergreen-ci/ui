import { addMilliseconds } from "date-fns";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  ExecutionPlatform,
  TaskCompletedByQuery,
  TaskCompletedByQueryVariables,
} from "gql/generated/types";
import { getUserMock } from "gql/mocks/getUser";
import { TaskQueryType, taskQuery } from "gql/mocks/taskData";
import { TASK_COMPLETED_BY } from "gql/queries";
import { Metadata } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[getUserMock, taskCompletedByMock]}>
    {children}
  </MockedProvider>
);

describe("metadata", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("renders the metadata card with a pending status", () => {
    render(<Metadata loading={false} task={taskAboutToStart.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(
      screen.queryByTestId("task-metadata-estimated-start"),
    ).toHaveTextContent("1s");
    expect(screen.queryByTestId("eta-timer")).toBeNull();
    expect(screen.queryByTestId("task-metadata-started")).toBeNull();
    expect(screen.queryByTestId("task-metadata-finished")).toBeNull();
  });

  it("renders the metadata card with a started status", () => {
    render(<Metadata loading={false} task={taskStarted.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(screen.queryByTestId("task-metadata-estimated_start")).toBeNull();
    expect(screen.getByTestId("task-metadata-started")).toBeInTheDocument();
    expect(screen.queryByTestId("task-metadata-finished")).toBeNull();
    expect(screen.queryByTestId("task-trace-link")).toBeNull();
    expect(screen.queryByTestId("task-metrics-link")).toBeNull();
  });

  it("renders the metadata card with a succeeded status", async () => {
    render(<Metadata loading={false} task={taskSucceeded.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(screen.queryByTestId("task-metadata-estimated_start")).toBeNull();
    expect(screen.queryByTestId("eta-timer")).toBeNull();
    expect(screen.getByTestId("task-metadata-started")).toBeInTheDocument();
    expect(screen.getByTestId("task-metadata-finished")).toBeInTheDocument();
    expect(screen.getByTestId("task-trace-link")).toBeInTheDocument();
    expect(screen.getByTestId("task-metrics-link")).toBeInTheDocument();
  });

  it("renders failing command and other failing commands", async () => {
    const user = userEvent.setup();
    render(<Metadata loading={false} task={taskSucceeded.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });

    expect(screen.getByTestId("task-metadata-command")).toBeInTheDocument();
    expect(screen.getByText("more")).toBeInTheDocument();
    await user.hover(screen.getByText("more"));
    await screen.findByTestId("task-metadata-command-tooltip");
    expect(
      screen.getByTestId("task-metadata-command-tooltip"),
    ).toHaveTextContent(failingCommand);

    expect(
      screen.getByTestId("task-metadata-other-failing-commands"),
    ).toBeInTheDocument();
    expect(screen.queryByText("other failing command")).not.toBeVisible();
    await user.click(screen.getByTestId("other-failing-commands-summary"));
    expect(screen.getByText("other failing command")).toBeVisible();
  });

  it("hides cost detail button when task is running", () => {
    render(<Metadata loading={false} task={taskWithCost.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(screen.queryByTestId("cost-details-button")).not.toBeInTheDocument();
  });

  it("shows cost detail button when task is complete", () => {
    render(<Metadata loading={false} task={taskWithCostAndFinishTime.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(screen.getByTestId("cost-details-button")).toBeInTheDocument();
  });

  it("shows a Container badge when the task ran in a container", () => {
    render(<Metadata loading={false} task={taskInContainer.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(
      screen.getByTestId("task-metadata-execution-platform"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("task-metadata-execution-platform"),
    ).toHaveTextContent("Container");
  });

  it("does not show a Container badge when the task ran on a host", () => {
    render(<Metadata loading={false} task={taskQuery.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(
      screen.queryByTestId("task-metadata-execution-platform"),
    ).not.toBeInTheDocument();
  });

  it("can reopen cost modal after closing", async () => {
    const user = userEvent.setup();
    render(<Metadata loading={false} task={taskWithCostAndFinishTime.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    await user.click(screen.getByTestId("cost-details-button"));
    expect(screen.getByTestId("cost-modal")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close modal" }));
    expect(screen.queryByTestId("cost-modal")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("cost-details-button"));
    expect(screen.getByTestId("cost-modal")).toBeInTheDocument();
  });

  it("hides host information and cost for a push-completed virtual task", async () => {
    render(<Metadata loading={false} task={pushCompletedVirtualTask.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(await screen.findByText(runnerTaskDisplayName)).toBeInTheDocument();
    expect(screen.getByTestId("task-metadata-completed-by")).toHaveTextContent(
      runnerTaskDisplayName,
    );
    expect(screen.queryByText("Host Information")).not.toBeInTheDocument();
    expect(screen.queryByTestId("task-host-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("task-distro-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("task-metrics-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cost-details-button")).not.toBeInTheDocument();
    expect(screen.queryByText("External Links")).not.toBeInTheDocument();
  });

  it("hides the External Links section when there are no links to show", () => {
    render(<Metadata loading={false} task={taskStarted.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(screen.queryByText("External Links")).not.toBeInTheDocument();
  });

  it("shows the External Links section when the task has links", () => {
    render(<Metadata loading={false} task={taskSucceeded.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(screen.getByText("External Links")).toBeInTheDocument();
  });

  it("shows host information for a virtual task that ran on a host", () => {
    render(<Metadata loading={false} task={ranVirtualTask.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(
      screen.queryByTestId("task-metadata-completed-by"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Host Information")).toBeInTheDocument();
    expect(screen.getByTestId("cost-details-button")).toBeInTheDocument();
  });
});

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";

const taskAboutToStart: TaskQueryType = {
  task: {
    ...taskQuery.task,
    status: "pending",
  },
};

const taskStarted: TaskQueryType = {
  task: {
    ...taskQuery.task,
    estimatedStart: 0,
    startTime: new Date(),
    status: "started",
  },
};

const failingCommand =
  "exiting due to custom reason: long long long long long long long long long long long long long message";

const taskSucceeded: TaskQueryType = {
  task: {
    ...taskStarted.task,
    finishTime: addMilliseconds(new Date(), 1228078),
    status: "succeeded",
    details: {
      type: "",
      status: "success",
      description: failingCommand,
      traceID: "trace_abcde",
      oomTracker: {
        detected: false,
      },
      failureMetadataTags: [],
      diskDevices: [],
      otherFailingCommands: [
        {
          fullDisplayName: "other failing command",
          failureMetadataTags: ["tag1", "tag2"],
        },
      ],
    },
  },
};

const taskWithCost: TaskQueryType = {
  task: {
    ...taskStarted.task,
    taskCost: {
      __typename: "Cost",
      total: 42.5,
      adjustedEC2Cost: 40,
      adjustedEBSStorageCost: null,
      adjustedEBSThroughputCost: null,
      adjustedS3ArtifactPutCost: null,
      adjustedS3ArtifactStorageCost: null,
      adjustedS3LogPutCost: null,
      adjustedS3LogStorageCost: 2.5,
    },
  },
};

const taskWithCostAndFinishTime: TaskQueryType = {
  task: {
    ...taskWithCost.task,
    finishTime: new Date("2024-01-02"),
    status: "succeeded",
  },
};

const taskInContainer: TaskQueryType = {
  task: {
    ...taskQuery.task,
    executionPlatform: ExecutionPlatform.Container,
  },
};

const runnerTaskId = "runner_task_id";
const runnerTaskDisplayName = "engflow_runner";

const taskCompletedByMock: ApolloMock<
  TaskCompletedByQuery,
  TaskCompletedByQueryVariables
> = {
  request: {
    query: TASK_COMPLETED_BY,
    variables: { taskId: runnerTaskId },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: runnerTaskId,
        displayName: runnerTaskDisplayName,
        execution: 0,
      },
    },
  },
};

const ranVirtualTask: TaskQueryType = {
  task: {
    ...taskWithCostAndFinishTime.task,
    isVirtual: true,
  },
};

const pushCompletedVirtualTask: TaskQueryType = {
  task: {
    ...taskSucceeded.task,
    ...ranVirtualTask.task,
    completedBy: runnerTaskId,
    hostId: null,
  },
};
