import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import * as ErrorReporting from "@evg-ui/lib/utils/errorReporting";
import { LogTypes } from "constants/enums";
import { useResolveLogURLAndRenderingType } from "./useResolveLogURLAndRenderingType";

// Define GraphQL queries using gql tag for tests
const GET_TEST_LOG_URL_AND_RENDERING_TYPE = gql`
  query TestLogUrlAndRenderingType($taskID: String!, $testName: String!, $execution: Int) {
    task(taskId: $taskID, execution: $execution) {
      id
      tests {
        testResults {
          id
          logs {
            renderingType
            url
            urlRaw
          }
          status
          testFile
        }
      }
    }
  }
`;

const TASK_FILES = gql`
  query TaskFiles($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      execution
      files {
        groupedFiles {
          taskId
          taskName
          execution
          files {
            name
            link
          }
        }
      }
    }
  }
`;

const GET_TASK = gql`
  query Task($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      displayName
      displayStatus
      execution
      logs {
        agentLogLink
        allLogLink
        systemLogLink
        taskLogLink
      }
      patchNumber
      versionMetadata {
        id
        isPatch
        message
        projectIdentifier
        revision
      }
    }
  }
`;

// Mock data
const getExistingResmokeTestLogURLMock: ApolloMock<any, any> = {
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

const getExistingTestLogURLInvalidRenderingTypeMock: ApolloMock<any, any> = {
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

const getExistingDefaultTestLogURLMock: ApolloMock<any, any> = {
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

const getExistingDefaultTestLogURLMockEmptyRenderingType: ApolloMock<any, any> = {
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

const getEmptyTestLogURLMock: ApolloMock<any, any> = {
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

const getTaskFileURLMock: ApolloMock<any, any> = {
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

const evergreenTaskMock: ApolloMock<any, any> = {
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

describe("useResolveLogURLAndRenderingType", () => {
  describe("test log renderingType", () => {
    it("should return resmoke renderingType when the test log has a resmoke renderingType", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockedProvider mocks={[getExistingResmokeTestLogURLMock]}>
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            logType: LogTypes.EVERGREEN_TEST_LOGS,
            taskID: "a-task-id",
            testID: "a-test-name",
          }),
        { wrapper },
      );
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.renderingType).toBe("resmoke");
    });

    it("should return default renderingType when the test log has an invalid renderingType", async () => {
      vi.spyOn(ErrorReporting, "reportError");
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockedProvider mocks={[getExistingTestLogURLInvalidRenderingTypeMock]}>
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            logType: LogTypes.EVERGREEN_TEST_LOGS,
            taskID: "a-task-id",
            testID: "a-test-name",
          }),
        { wrapper },
      );
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      await waitFor(() => {
        expect(ErrorReporting.reportError).toHaveBeenCalledTimes(1);
        expect(ErrorReporting.reportError).toHaveBeenCalledWith(
          new Error("Encountered unsupported renderingType"),
          {
            context: {
              rawLogURL: "rawURL",
              unsupportedRenderingType: "not-a-valid-rendering-type",
            },
          },
        );
      });
      expect(result.current.renderingType).toBe("default");
    });

    it("should return default renderingType when the test log has a default renderingType", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockedProvider mocks={[getExistingDefaultTestLogURLMock]}>
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            logType: LogTypes.EVERGREEN_TEST_LOGS,
            taskID: "a-task-id",
            testID: "a-test-name",
          }),
        { wrapper },
      );
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.renderingType).toBe("default");
    });

    it("should return default renderingType when the test log has a null renderingType", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockedProvider
          mocks={[getExistingDefaultTestLogURLMockEmptyRenderingType]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            logType: LogTypes.EVERGREEN_TEST_LOGS,
            taskID: "a-task-id",
            testID: "a-test-name",
          }),
        { wrapper },
      );
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.renderingType).toBe("default");
    });
  });

  describe("test log URLs", () => {
    it("should return the test log URL when the test exists", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockedProvider mocks={[getExistingDefaultTestLogURLMock]}>
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            logType: LogTypes.EVERGREEN_TEST_LOGS,
            taskID: "a-task-id",
            testID: "a-test-name",
          }),
        { wrapper },
      );
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.rawLogURL).toBe("rawURL");
      expect(result.current.htmlLogURL).toBe("htmlURL");
    });

    it("should return a constructed test log URL when the test does not exist", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockedProvider mocks={[getEmptyTestLogURLMock]}>
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            logType: LogTypes.EVERGREEN_TEST_LOGS,
            taskID: "a-task-id",
            testID: "a-test-name-that-doesnt-exist",
          }),
        { wrapper },
      );
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.rawLogURL).toContain("a-test-name-that-doesnt-exist");
      expect(result.current.htmlLogURL).toContain("a-test-name-that-doesnt-exist");
    });
  });

  describe("task file URLs", () => {
    it("should return the task file URL when the file exists", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockedProvider mocks={[getTaskFileURLMock]}>
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            fileName: "a-file-name",
            logType: LogTypes.EVERGREEN_TASK_FILE,
            taskID: "a-task-id",
          }),
        { wrapper },
      );
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.rawLogURL).toBe("a-file-url");
    });

    it("should return the task file URL when the file has a crazy path", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockedProvider mocks={[getTaskFileURLMock]}>
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            fileName: "a file name.some/crazy/path",
            logType: LogTypes.EVERGREEN_TASK_FILE,
            taskID: "a-task-id",
          }),
        { wrapper },
      );
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.rawLogURL).toBe("a-file-url-with-crazy-path");
    });
  });

  describe("task log URLs", () => {
    it("should return the task log URL when the task exists", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockedProvider mocks={[evergreenTaskMock]}>
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            logType: LogTypes.EVERGREEN_TASK_LOGS,
            origin: "agent",
            taskID: "a-task-id",
          }),
        { wrapper },
      );
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.rawLogURL).toBe("agent-link.com?text=true&type=E");
    });
  });
});
