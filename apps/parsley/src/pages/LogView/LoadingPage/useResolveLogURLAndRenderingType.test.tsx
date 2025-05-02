import { MockedProvider } from "@apollo/client/testing";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import * as ErrorReporting from "@evg-ui/lib/utils/errorReporting";
import { LogTypes } from "constants/enums";
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  TaskQuery,
  TaskQueryVariables,
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables,
} from "gql/generated/types";
import { useResolveLogURLAndRenderingType } from "./useResolveLogURLAndRenderingType";
import {
  evergreenTaskMock,
  getEmptyTestLogURLMock,
  getExistingDefaultTestLogURLMock,
  getExistingDefaultTestLogURLMockEmptyRenderingType,
  getExistingResmokeTestLogURLMock,
  getExistingTestLogURLInvalidRenderingTypeMock,
  getTaskFileURLMock,
} from "./testData/graphqlMocks";

describe("useResolveLogURLAndRenderingType", () => {
  describe("test log renderingType", () => {
    beforeEach(() => {
      vi.spyOn(ErrorReporting, "reportError");
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it("resolves test log renderingType from GraphQL resolver when API value is 'resmoke'", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[
            evergreenTaskMock,
            evergreenTaskMock,
            getExistingResmokeTestLogURLMock,
          ]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () => useResolveLogURLAndRenderingType(hookParams),
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: true,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: false,
          renderingType: "resmoke",
        });
      });
      await waitFor(() => {
        expect(ErrorReporting.reportError).not.toHaveBeenCalled();
      });
    });
    it("resolves test log renderingType from GraphQL resolver when API value is 'default'", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[
            evergreenTaskMock,
            evergreenTaskMock,
            getExistingDefaultTestLogURLMock,
          ]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () => useResolveLogURLAndRenderingType(hookParams),
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: true,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: false,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(ErrorReporting.reportError).not.toHaveBeenCalled();
      });
    });
    it("resolves task log renderingType from GraphQL resolver when API value is empty", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[
            evergreenTaskMock,
            evergreenTaskMock,
            getExistingDefaultTestLogURLMockEmptyRenderingType,
          ]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () => useResolveLogURLAndRenderingType(hookParams),
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: true,
          renderingType: "default",
        });
      });

      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: false,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(ErrorReporting.reportError).not.toHaveBeenCalled();
      });
    });
    it("resolves test log renderingType to 'default' and reports error when API value is not recognized", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[
            evergreenTaskMock,
            evergreenTaskMock,
            getExistingTestLogURLInvalidRenderingTypeMock,
          ]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () => useResolveLogURLAndRenderingType(hookParams),
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: true,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: false,
          renderingType: "default",
        });
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
    });
    const hookParams = {
      execution: "0",
      logType: "EVERGREEN_TEST_LOGS",
      taskID: "a-task-id",
      testID: "a-test-name",
    };
  });
  describe("test/task/file URL generation", () => {
    it("resolves test log URLs from GraphQL resolver when data is available", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[
            evergreenTaskMock,
            evergreenTaskMock,
            getExistingResmokeTestLogURLMock,
          ]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            logType: "EVERGREEN_TEST_LOGS",
            taskID: "a-task-id",
            testID: "a-test-name",
          }),
        {
          wrapper,
        },
      );
      expect(result.current).toMatchObject({
        downloadURL: "",
        htmlLogURL: "",
        jobLogsURL: "",
        loading: true,
        rawLogURL: "",
      });
      await waitFor(() => {
        expect(result.current).toMatchObject({
          downloadURL: "rawURL",
          htmlLogURL: "htmlURL",
          jobLogsURL: "",
          loading: false,
          rawLogURL: "rawURL",
        });
      });
    });

    it("resolves task log URLs from GraphQL resolver when data is available", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[
            evergreenTaskMock,
            evergreenTaskMock,
            getExistingResmokeTestLogURLMock,
          ]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            logType: "EVERGREEN_TASK_LOGS",
            origin: "agent",
            taskID: "a-task-id",
          }),
        {
          wrapper,
        },
      );
      expect(result.current).toMatchObject({
        downloadURL: "",
        htmlLogURL: "",
        jobLogsURL: "",
        loading: true,
        rawLogURL: "",
      });
      await waitFor(() => {
        expect(result.current).toMatchObject({
          downloadURL: "agent-link.com?priority=true&text=true&type=E",
          htmlLogURL: "agent-link.com?text=false&type=E",
          jobLogsURL: "",
          loading: false,
          rawLogURL: "agent-link.com?text=true&type=E",
        });
      });
    });

    it("generates test log URLs without GraphQL data when GraphQL data is empty", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[evergreenTaskMock, evergreenTaskMock, getEmptyTestLogURLMock]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () =>
          useResolveLogURLAndRenderingType({
            execution: "0",
            logType: "EVERGREEN_TEST_LOGS",
            taskID: "a-task-id",
            testID: "a-test-name-that-doesnt-exist",
          }),
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          downloadURL:
            "http://test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=true",
          htmlLogURL:
            "http://test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=false",
          jobLogsURL: "",
          loading: false,
          rawLogURL:
            "http://test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=true",
        });
      });
    });

    it("generates task file urls", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[evergreenTaskMock, evergreenTaskMock, getTaskFileURLMock]}
        >
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
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          downloadURL:
            "http://test-evergreen.com/task_file_raw/a-task-id/0/a-file-name",
          htmlLogURL: "",
          jobLogsURL: "",
          loading: false,
          rawLogURL: "a-file-url",
        });
      });
    });

    it("generates task file urls that are properly encoded", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[evergreenTaskMock, evergreenTaskMock, getTaskFileURLMock]}
        >
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
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          downloadURL:
            "http://test-evergreen.com/task_file_raw/a-task-id/0/a%20file%20name.some%2Fcrazy%2Fpath",
          htmlLogURL: "",
          jobLogsURL: "",
          loading: false,
          rawLogURL: "a-file-url-with-crazy-path",
        });
      });
    });
  });

  it("generates evergreen complete logs URL", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider mocks={[evergreenTaskMock, evergreenTaskMock]}>
        {children}
      </MockedProvider>
    );
    const { result } = renderHook(
      () =>
        useResolveLogURLAndRenderingType({
          execution: "0",
          groupID: "job0",
          logType: LogTypes.EVERGREEN_COMPLETE_LOGS,
          taskID: "a-task-id",
        }),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current).toMatchObject({
        downloadURL:
          "http://test-evergreen.com/rest/v2/tasks/a-task-id/build/TestLogs/job0%2F?execution=0",
        htmlLogURL: "",
        jobLogsURL: "http://test-spruce.com/job-logs/a-task-id/0/job0",
        loading: false,
        rawLogURL:
          "http://test-evergreen.com/rest/v2/tasks/a-task-id/build/TestLogs/job0%2F?execution=0",
      });
    });
  });
});
