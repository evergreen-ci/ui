import { TaskStatus, TaskStatusUmbrella } from "@evg-ui/lib/types/task";
import { groupedTaskStats, groupedTaskStatsAll } from "../testData";
import {
  getStatusesWithZeroCount,
  injectGlobalDimStyle,
  injectGlobalHighlightStyle,
  removeGlobalDimStyle,
  removeGlobalHighlightStyle,
} from "./utils";

describe("getStatusesWithZeroCount", () => {
  it("return an array of umbrella statuses that have 0 count", () => {
    expect(getStatusesWithZeroCount(groupedTaskStats)).toStrictEqual([
      TaskStatusUmbrella.Failed,
      TaskStatusUmbrella.Running,
      TaskStatusUmbrella.Scheduled,
      TaskStatusUmbrella.SystemFailure,
      TaskStatusUmbrella.Undispatched,
    ]);
  });
  it("should return an empty array when all umbrella statuses are present", () => {
    expect(getStatusesWithZeroCount(groupedTaskStatsAll)).toStrictEqual([]);
  });
  it("return an array of all umbrella statuses when no umbrella status exists", () => {
    expect(getStatusesWithZeroCount([])).toStrictEqual([
      TaskStatusUmbrella.Failed,
      TaskStatus.Succeeded,
      TaskStatusUmbrella.Running,
      TaskStatusUmbrella.Scheduled,
      TaskStatusUmbrella.SystemFailure,
      TaskStatusUmbrella.Undispatched,
      TaskStatus.SetupFailed,
    ]);
  });
});

describe("injectGlobalStyle", () => {
  it("should properly inject global style using the task identifier", () => {
    const dimIconStyle = "dim-icon-style";
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      dimIconStyle,
    );

    injectGlobalDimStyle();
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      dimIconStyle,
    );
  });
});

describe("removeGlobalDimStyle", () => {
  it("should properly remove global style", () => {
    const dimIconStyle = "dim-icon-style";

    // Styles should persist from previous test.
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      dimIconStyle,
    );

    removeGlobalDimStyle();
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      dimIconStyle,
    );
  });
});

describe("injectGlobalHighlightStyle", () => {
  it("should properly inject global style using the task identifier", () => {
    const taskIconStyle = "task-icon-style";
    const taskIdentifier = "ubuntu1604-test_util";
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      taskIconStyle,
    );
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      taskIdentifier,
    );

    injectGlobalHighlightStyle("ubuntu1604-test_util");
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      taskIconStyle,
    );
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      taskIdentifier,
    );
  });
});

describe("removeGlobalHighlightStyle", () => {
  it("should properly remove global style", () => {
    const taskIconStyle = "task-icon-style";
    const taskIdentifier = "ubuntu1604-test_util";

    // Styles should persist from previous test.
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      taskIconStyle,
    );
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      taskIdentifier,
    );

    removeGlobalHighlightStyle();
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      taskIconStyle,
    );
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      taskIdentifier,
    );
  });
});
