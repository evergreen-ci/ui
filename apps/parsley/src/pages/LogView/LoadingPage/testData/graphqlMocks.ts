import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  TaskQuery,
  TaskQueryVariables,
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables,
} from "gql/generated/types";
import GET_TASK from "gql/queries/get-task.graphql";
import GET_TEST_LOG_URL_AND_RENDERING_TYPE from "gql/queries/get-test-log-url-and-rendering-type.graphql";
import TASK_FILES from "gql/queries/task-files.graphql";

export const getExistingResmokeTestLogURLMock: ApolloMock<
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL_AND_RENDERING_TYPE,
    variables: {
      execution: 0,
      taskID: "a-task-id",
      testName: "^a-test-name$",
    },
  },
  result: {
    data: {
      task: {
        id: "taskID",
        tests: {
          testResults: [
            {
              id: "testID",
              logs: {
                renderingType: "resmoke",
                url: "htmlURL",
                urlRaw: "rawURL",
              },
              status: "success",
              testFile: "testFile",
            },
          ],
        },
      },
    },
  },
};

export const getExistingTestLogURLInvalidRenderingTypeMock: ApolloMock<
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL_AND_RENDERING_TYPE,
    variables: {
      execution: 0,
      taskID: "a-task-id",
      testName: "^a-test-name$",
    },
  },
  result: {
    data: {
      task: {
        id: "taskID",
        tests: {
          testResults: [
            {
              id: "testID",
              logs: {
                renderingType: "not-a-valid-rendering-type",
                url: "htmlURL",
                urlRaw: "rawURL",
              },
              status: "success",
              testFile: "testFile",
            },
          ],
        },
      },
    },
  },
};

export const getExistingDefaultTestLogURLMock: ApolloMock<
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL_AND_RENDERING_TYPE,
    variables: {
      execution: 0,
      taskID: "a-task-id",
      testName: "^a-test-name$",
    },
  },
  result: {
    data: {
      task: {
        id: "taskID",
        tests: {
          testResults: [
            {
              id: "testID",
              logs: {
                renderingType: "default",
                url: "htmlURL",
                urlRaw: "rawURL",
              },
              status: "success",
              testFile: "testFile",
            },
          ],
        },
      },
    },
  },
};

export const getExistingDefaultTestLogURLMockEmptyRenderingType: ApolloMock<
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL_AND_RENDERING_TYPE,
    variables: {
      execution: 0,
      taskID: "a-task-id",
      testName: "^a-test-name$",
    },
  },
  result: {
    data: {
      task: {
        id: "taskID",
        tests: {
          testResults: [
            {
              id: "testID",
              logs: {
                renderingType: null,
                url: "htmlURL",
                urlRaw: "rawURL",
              },
              status: "success",
              testFile: "testFile",
            },
          ],
        },
      },
    },
  },
};

export const getEmptyTestLogURLMock: ApolloMock<
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL_AND_RENDERING_TYPE,
    variables: {
      execution: 0,
      taskID: "a-task-id",
      testName: "^a-test-name-that-doesnt-exist$",
    },
  },
  result: {
    data: {
      task: {
        id: "taskID",
        tests: {
          testResults: [],
        },
      },
    },
  },
};

export const getTaskFileURLMock: ApolloMock<TaskFilesQuery, TaskFilesQueryVariables> = {
  request: {
    query: TASK_FILES,
    variables: {
      execution: 0,
      taskId: "a-task-id",
    },
  },
  result: {
    data: {
      task: {
        execution: 0,
        files: {
          groupedFiles: [
            {
              execution: 0,
              files: [
                {
                  link: "a-file-url",
                  name: "a-file-name",
                },
                {
                  link: "a-file-url-with-crazy-path",
                  name: "a file name.some/crazy/path",
                },
              ],
              taskId: "a-task-id",
              taskName: "a-task-name",
            },
          ],
        },
        id: "taskID",
      },
    },
  },
};

export const evergreenTaskMock: ApolloMock<TaskQuery, TaskQueryVariables> = {
  request: {
    query: GET_TASK,
    variables: {
      execution: 0,
      taskId: "a-task-id",
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        displayName: "check_codegen",
        displayStatus: "failed",
        execution: 0,
        id: "a-task-id",
        logs: {
          agentLogLink: "agent-link.com?type=E",
          allLogLink: "all-log-link.com?type=ALL",
          systemLogLink: "system-log-link.com?type=S",
          taskLogLink: "task-log-link.com?type=T",
        },
        patchNumber: 1,
        versionMetadata: {
          __typename: "Version",
          id: "spruce_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f",
          isPatch: false,
          message: "v2.28.5",
          projectIdentifier: "spruce",
          revision: "d54e2c6ede60e004c48d3c4d996c59579c7bbd1f",
        },
      },
    },
  },
};
