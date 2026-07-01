import {
  MockedProvider,
  render,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { LogTypes } from "constants/enums";
import { TaskQuery, TaskQueryVariables } from "gql/generated/types";
import { GET_TASK } from "gql/queries";
import { evergreenTaskMock } from "test_data/task";
import { EvergreenTaskSubHeader } from "./EvergreenTaskSubHeader";

describe("evergreen task subheader", () => {
  it("should only render task status for evergreen test log", async () => {
    render(
      <MockedProvider mocks={[evergreenTaskMock]}>
        <EvergreenTaskSubHeader
          execution={0}
          logType={LogTypes.EVERGREEN_TEST_LOGS}
          taskID="spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35"
          testID="JustAFakeTestInALonelyWorld"
        />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("spruce")).toBeInTheDocument();
    });
    // check_codegen task should be failing
    expect(screen.getByText("check_codegen")).toBeInTheDocument();
    expect(screen.getByDataCy("task-status-badge").textContent).toContain(
      "Failed",
    );
    // JustAFakeTestInALonelyWorld test should not be in the document
    expect(screen.queryByText("JustAFakeTestInALonelyWorld")).toBeNull();
    expect(screen.queryByText("test-status-badge")).toBeNull();
  });

  it("does not render a Container badge for a task that ran on a host", async () => {
    render(
      <MockedProvider mocks={[evergreenTaskMock]}>
        <EvergreenTaskSubHeader
          execution={0}
          taskID="spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35"
        />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("check_codegen")).toBeInTheDocument();
    });
    expect(
      screen.queryByDataCy("task-execution-platform-badge"),
    ).not.toBeInTheDocument();
  });

  it("renders a Container badge for a task that ran in a container", async () => {
    const containerTaskMock: ApolloMock<TaskQuery, TaskQueryVariables> = {
      request: {
        query: GET_TASK,
        variables: {
          execution: 0,
          taskId: "a-container-task-id",
        },
      },
      result: {
        data: {
          task: {
            __typename: "Task",
            details: {
              description: "",
              failingCommand: "",
              status: "success",
            },
            displayName: "check_codegen",
            displayStatus: "failed",
            execution: 0,
            executionPlatform: "container",
            id: "a-container-task-id",
            logs: {
              agentLogLink: "log-link.com?type=E",
              allLogLink: "log-link.com?type=ALL",
              systemLogLink: "log-link.com?type=S",
              taskLogLink: "log-link.com?type=T",
            },
            patchNumber: 1236,
            versionMetadata: {
              __typename: "VersionLite",
              id: "spruce_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f",
              isPatch: false,
              message: "v2.28.5",
              projectMetadata: {
                id: "spruce",
                identifier: "spruce",
              },
              revision: "d54e2c6ede60e004c48d3c4d996c59579c7bbd1f",
            },
          },
        },
      },
    };
    render(
      <MockedProvider mocks={[containerTaskMock]}>
        <EvergreenTaskSubHeader execution={0} taskID="a-container-task-id" />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("check_codegen")).toBeInTheDocument();
    });
    expect(
      screen.getByDataCy("task-execution-platform-badge"),
    ).toBeInTheDocument();
    expect(
      screen.getByDataCy("task-execution-platform-badge"),
    ).toHaveTextContent("Container");
  });
});
