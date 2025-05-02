import { MockedProvider } from "@apollo/client/testing";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import * as ErrorReporting from "@evg-ui/lib/utils/errorReporting";
import { LogTypes } from "constants/enums";
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
