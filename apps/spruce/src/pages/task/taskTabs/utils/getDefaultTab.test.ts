import { TaskTab } from "types/task";
import { getDefaultTab } from "./getDefaultTab";

describe("getDefaultTab", () => {
  const defaultActiveTabs = [
    TaskTab.ExecutionTasks,
    TaskTab.Tests,
    TaskTab.Logs,
    TaskTab.Files,
    TaskTab.Annotations,
    TaskTab.TrendCharts,
    TaskTab.History,
  ];

  describe("url tab handling", () => {
    it("should return the urlTab index if it exists and is valid", () => {
      const result = getDefaultTab({
        urlTab: TaskTab.Tests,
        activeTabs: defaultActiveTabs,
        isDisplayTask: false,
        failedTestCount: 0,
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Tests));
    });

    it("should ignore invalid urlTab and fall back to default logic", () => {
      const result = getDefaultTab({
        urlTab: "invalid-tab" as TaskTab,
        activeTabs: defaultActiveTabs,
        isDisplayTask: false,
        failedTestCount: 0,
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Logs));
    });
  });

  describe("display task handling", () => {
    it("should return execution tasks tab for display tasks", () => {
      const result = getDefaultTab({
        urlTab: undefined,
        activeTabs: defaultActiveTabs,
        isDisplayTask: true,
        failedTestCount: 5, // Even with failed tests
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.ExecutionTasks));
    });
  });

  describe("test status handling", () => {
    it("should return tests tab when there are failed tests", () => {
      const result = getDefaultTab({
        urlTab: undefined,
        activeTabs: defaultActiveTabs,
        isDisplayTask: false,
        failedTestCount: 5,
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Tests));
    });

    it("should return logs tab when there are no failed tests", () => {
      const result = getDefaultTab({
        urlTab: undefined,
        activeTabs: defaultActiveTabs,
        isDisplayTask: false,
        failedTestCount: 0,
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Logs));
    });

    it("should return tests tab when there are tests with failures", () => {
      const result = getDefaultTab({
        urlTab: undefined,
        activeTabs: defaultActiveTabs,
        isDisplayTask: false,
        failedTestCount: 5,
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Tests));
    });
  });

  it("should handle undefined urlTab", () => {
    const result = getDefaultTab({
      urlTab: undefined,
      activeTabs: defaultActiveTabs,
      isDisplayTask: false,
      failedTestCount: 0,
    });
    expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Logs));
  });
});
