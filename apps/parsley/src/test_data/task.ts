import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { TaskQuery, TaskQueryVariables } from "gql/generated/types";
import { GET_TASK } from "gql/queries";

export const evergreenTaskMock: ApolloMock<TaskQuery, TaskQueryVariables> = {
  request: {
    query: GET_TASK,
    variables: {
      execution: 0,
      taskId:
        "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
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
        id: "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
        logs: {
          agentLogLink: "log-link.com?type=E",
          allLogLink: "log-link.com?type=ALL",
          systemLogLink: "log-link.com?type=S",
          taskLogLink: "log-link.com?type=T",
        },
        patchNumber: 1236,
        versionMetadata: {
          __typename: "Version",
          id: "spruce_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f",
          isPatch: false,
          message: "v2.28.5",
          projectIdentifier: "spruce",
          projectMetadata: {
            id: "spruce",
          },
          revision: "d54e2c6ede60e004c48d3c4d996c59579c7bbd1f",
        },
      },
    },
  },
};
