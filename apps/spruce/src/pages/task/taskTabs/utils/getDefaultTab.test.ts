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
    it("should return the urlTab index if it exists and is valid (priority 1)", () => {
      const result = getDefaultTab({
        activeTabs: defaultActiveTabs,
        failedTestCount: 0,
        isDisplayTask: false,
        urlTab: TaskTab.Tests,
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Tests));
    });

    it("should ignore invalid urlTab and fall back to default logic (priority 1)", () => {
      const result = getDefaultTab({
        activeTabs: defaultActiveTabs,
        failedTestCount: 0,
        isDisplayTask: false,
        urlTab: "invalid-tab" as TaskTab,
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Logs));
    });
  });

  describe("display task handling", () => {
    it("should return execution tasks tab for display tasks (priority 2)", () => {
      const result = getDefaultTab({
        activeTabs: defaultActiveTabs,
        failedTestCount: 5, // Even with failed tests
        isDisplayTask: true,
        urlTab: undefined,
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.ExecutionTasks));
    });
  });

  describe("test status handling", () => {
    it("should return tests tab when there are failed tests (priority 3)", () => {
      const result = getDefaultTab({
        activeTabs: defaultActiveTabs,
        failedTestCount: 5,
        isDisplayTask: false,
        urlTab: undefined,
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Tests));
    });

    it("should return logs tab when there are no failed tests (priority 4)", () => {
      const result = getDefaultTab({
        activeTabs: defaultActiveTabs,
        failedTestCount: 0,
        isDisplayTask: false,
        urlTab: undefined,
      });
      expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Logs));
    });
  });

  it("should handle undefined urlTab with no other matching tab (priority 5)", () => {
    const result = getDefaultTab({
      activeTabs: defaultActiveTabs,
      failedTestCount: 0,
      isDisplayTask: false,
      urlTab: undefined,
    });
    expect(result).toBe(defaultActiveTabs.indexOf(TaskTab.Logs));
  });
});
