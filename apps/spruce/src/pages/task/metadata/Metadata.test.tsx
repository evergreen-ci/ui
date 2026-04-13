import { addMilliseconds } from "date-fns";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { getUserMock } from "gql/mocks/getUser";
import { taskQuery, TaskQueryType } from "gql/mocks/taskData";
import { Metadata } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
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
      screen.queryByDataCy("task-metadata-estimated-start"),
    ).toHaveTextContent("1s");
    expect(screen.queryByDataCy("task-metadata-eta")).toBeNull();
    expect(screen.queryByDataCy("task-metadata-started")).toBeNull();
    expect(screen.queryByDataCy("task-metadata-finished")).toBeNull();
  });

  it("renders the metadata card with a started status", () => {
    render(<Metadata loading={false} task={taskStarted.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(screen.queryByDataCy("task-metadata-estimated_start")).toBeNull();
    expect(screen.getByDataCy("task-metadata-started")).toBeInTheDocument();
    expect(screen.queryByDataCy("task-metadata-finished")).toBeNull();
    expect(screen.queryByDataCy("task-trace-link")).toBeNull();
    expect(screen.queryByDataCy("task-metrics-link")).toBeNull();
  });

  it("renders the metadata card with a succeeded status", async () => {
    render(<Metadata loading={false} task={taskSucceeded.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });
    expect(screen.queryByDataCy("task-metadata-estimated_start")).toBeNull();
    expect(screen.queryByDataCy("task-metadata-eta")).toBeNull();
    expect(screen.getByDataCy("task-metadata-started")).toBeInTheDocument();
    expect(screen.getByDataCy("task-metadata-finished")).toBeInTheDocument();
    expect(screen.getByDataCy("task-trace-link")).toBeInTheDocument();
    expect(screen.getByDataCy("task-metrics-link")).toBeInTheDocument();
  });

  it("renders failing command and other failing commands", async () => {
    const user = userEvent.setup();
    render(<Metadata loading={false} task={taskSucceeded.task} />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
      wrapper,
    });

    expect(screen.getByDataCy("task-metadata-command")).toBeInTheDocument();
    expect(screen.getByText("more")).toBeInTheDocument();
    await user.hover(screen.getByText("more"));
    await screen.findByDataCy("task-metadata-command-tooltip");
    expect(
      screen.getByDataCy("task-metadata-command-tooltip"),
    ).toHaveTextContent(failingCommand);

    expect(
      screen.getByDataCy("task-metadata-other-failing-commands"),
    ).toBeInTheDocument();
    expect(screen.queryByText("other failing command")).not.toBeVisible();
    await user.click(screen.getByDataCy("other-failing-commands-summary"));
    expect(screen.getByText("other failing command")).toBeVisible();
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
