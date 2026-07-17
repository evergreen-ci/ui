import { TaskBuildVariantField, TestAnalysisQueryTasks } from "./types";
import { countTotalTests, filterGroupedTests, groupTestsByName } from "./utils";

const groupedTests = new Map<string, TaskBuildVariantField[]>([
  [
    "test1",
    [
      {
        buildVariant: "variant1",
        displayStatus: "failed",
        id: "task1_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
      {
        buildVariant: "variant2",
        displayStatus: "success",
        id: "task2_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task2",
      },
    ],
  ],
  [
    "test2",
    [
      {
        buildVariant: "variant1",
        displayStatus: "success",
        id: "task3_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task3",
      },
    ],
  ],
  [
    "anotherTest",
    [
      {
        buildVariant: "variant3",
        displayStatus: "failed",
        id: "task4_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task4",
      },
    ],
  ],
]);
describe("countTotalTests", () => {
  it("should return 0 when given an empty map", () => {
    const result = countTotalTests(new Map());
    expect(result).toBe(0);
  });
  it("should return the correct count when given a map with tasks", () => {
    const result = countTotalTests(groupedTests);
    expect(result).toBe(4);
  });
});

describe("groupTestsByName", () => {
  it("should return an empty map when given an empty array", () => {
    const tasks: TestAnalysisQueryTasks = [];
    const result = groupTestsByName(tasks);
    expect(result.size).toBe(0);
  });

  it("should group tests correctly when given one task with one test", () => {
    const tasks: TestAnalysisQueryTasks = [
      {
        buildVariant: "variant1",
        displayName: "task1",
        displayStatus: "failed",
        execution: 0,
        id: "task1_id",
        tests: {
          filteredTestCount: 1,
          testResults: [
            {
              id: "0",
              logs: { urlParsley: "" },
              status: "fail",
              testFile: "test1",
            },
          ],
        },
      },
    ];
    const result = groupTestsByName(tasks);
    expect(result.size).toBe(1);
    expect(result.has("test1")).toBe(true);
    expect(result.get("test1")).toEqual([
      {
        buildVariant: "variant1",
        displayStatus: "failed",
        id: "task1_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
    ]);
  });

  it("should group tests correctly when given multiple tasks with overlapping tests", () => {
    const tasks: TestAnalysisQueryTasks = [
      {
        buildVariant: "variant1",
        displayName: "task1",
        displayStatus: "failed",
        execution: 0,
        id: "task1_id",
        tests: {
          filteredTestCount: 2,
          testResults: [
            {
              id: "0",
              logs: { urlParsley: "" },
              status: "fail",
              testFile: "test1",
            },
            {
              id: "1",
              logs: { urlParsley: "" },
              status: "fail",
              testFile: "test2",
            },
          ],
        },
      },
      {
        buildVariant: "variant2",
        displayName: "task2",
        displayStatus: "failed",
        execution: 0,
        id: "task2_id",
        tests: {
          filteredTestCount: 2,
          testResults: [
            {
              id: "0",
              logs: { urlParsley: "" },
              status: "fail",
              testFile: "test2",
            },
            {
              id: "1",
              logs: { urlParsley: "" },
              status: "fail",
              testFile: "test3",
            },
          ],
        },
      },
    ];
    const result = groupTestsByName(tasks);

    expect(result.size).toBe(3);
    expect(result.has("test1")).toBe(true);
    expect(result.has("test2")).toBe(true);
    expect(result.has("test3")).toBe(true);

    expect(result.get("test1")).toEqual([
      {
        buildVariant: "variant1",
        displayStatus: "failed",
        id: "task1_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
    ]);

    expect(result.get("test2")).toEqual([
      {
        buildVariant: "variant1",
        displayStatus: "failed",
        id: "task1_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
      {
        buildVariant: "variant2",
        displayStatus: "failed",
        id: "task2_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task2",
      },
    ]);

    expect(result.get("test3")).toEqual([
      {
        buildVariant: "variant2",
        displayStatus: "failed",
        id: "task2_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task2",
      },
    ]);
  });

  it("should handle tasks with no tests", () => {
    const tasks: TestAnalysisQueryTasks = [
      {
        buildVariant: "variant1",
        displayName: "task1",
        displayStatus: "success",
        execution: 0,
        id: "task1_id",
        tests: {
          filteredTestCount: 0,
          testResults: [],
        },
      },
    ];
    const result = groupTestsByName(tasks);
    expect(result.size).toBe(0);
  });

  it("should handle tasks with duplicate test names", () => {
    const tasks: TestAnalysisQueryTasks = [
      {
        buildVariant: "variant1",
        displayName: "task1",
        displayStatus: "success",
        execution: 0,
        id: "task1_id",
        tests: {
          filteredTestCount: 2,
          testResults: [
            {
              id: "1",
              logs: { urlParsley: "" },
              status: "fail",
              testFile: "test1",
            },
            {
              id: "2",
              logs: { urlParsley: "" },
              status: "fail",
              testFile: "test1",
            },
          ],
        },
      },
    ];
    const result = groupTestsByName(tasks);

    expect(result.size).toBe(1);
    expect(result.has("test1")).toBe(true);
    expect(result.get("test1")).toEqual([
      {
        buildVariant: "variant1",
        buildVariantDisplayName: undefined,
        displayStatus: "success",
        id: "task1_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
    ]);
  });
  it("should handle multiple tasks with the same test name", () => {
    const tasks: TestAnalysisQueryTasks = [
      {
        buildVariant: "variant1",
        displayName: "task1",
        displayStatus: "success",
        execution: 0,
        id: "task1_variant1_id",
        tests: {
          filteredTestCount: 2,
          testResults: [
            {
              id: "1",
              logs: { urlParsley: "" },
              status: "fail",
              testFile: "test1",
            },
          ],
        },
      },
      {
        buildVariant: "variant2",
        displayName: "task1",
        displayStatus: "success",
        execution: 0,
        id: "task1_variant2_id",
        tests: {
          filteredTestCount: 2,
          testResults: [
            {
              id: "1",
              logs: { urlParsley: "" },
              status: "fail",
              testFile: "test1",
            },
          ],
        },
      },
    ];
    const result = groupTestsByName(tasks);
    expect(result.size).toBe(1);
    expect(result.has("test1")).toBe(true);
    expect(result.get("test1")).toEqual([
      {
        buildVariant: "variant1",
        buildVariantDisplayName: undefined,
        displayStatus: "success",
        id: "task1_variant1_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
      {
        buildVariant: "variant2",
        buildVariantDisplayName: undefined,
        displayStatus: "success",
        id: "task1_variant2_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
    ]);
  });
});

describe("filterGroupedTests", () => {
  it("filters tests by regex pattern, statuses, and build variants", () => {
    const testNamePattern = /^test\d$/i; // Matches 'test1' and 'test2'
    const statuses = ["failed", "success"];
    const variants = ["variant1", "variant2"];

    const result = filterGroupedTests(
      groupedTests,
      testNamePattern,
      statuses,
      variants,
    );

    expect(result.size).toBe(2);
    expect(result.has("test1")).toBe(true);
    expect(result.has("test2")).toBe(true);

    expect(result.get("test1")).toEqual([
      {
        buildVariant: "variant1",
        displayStatus: "failed",
        id: "task1_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
      {
        buildVariant: "variant2",
        displayStatus: "success",
        id: "task2_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task2",
      },
    ]);

    expect(result.get("test2")).toEqual([
      {
        buildVariant: "variant1",
        displayStatus: "success",
        id: "task3_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task3",
      },
    ]);
  });

  it("filters tasks by statuses and build variants for a specific test", () => {
    const testNamePattern = /^test1$/i;
    const statuses = ["failed"];
    const variants = ["variant1"];

    const result = filterGroupedTests(
      groupedTests,
      testNamePattern,
      statuses,
      variants,
    );

    expect(result.size).toBe(1);
    expect(result.has("test1")).toBe(true);

    expect(result.get("test1")).toEqual([
      {
        buildVariant: "variant1",
        displayStatus: "failed",
        id: "task1_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
    ]);
  });

  it("returns an empty map when no test names match the regex pattern", () => {
    const testNamePattern = /^nonexistentTest$/i;
    const statuses = ["failed", "success"];
    const variants = ["variant1", "variant2", "variant3"];

    const result = filterGroupedTests(
      groupedTests,
      testNamePattern,
      statuses,
      variants,
    );

    expect(result.size).toBe(0);
  });

  it("returns an empty map when no tasks match the statuses and variants", () => {
    const testNamePattern = /^test1$/i;
    const statuses = ["success"];
    const variants = ["variant3"];

    const result = filterGroupedTests(
      groupedTests,
      testNamePattern,
      statuses,
      variants,
    );

    expect(result.size).toBe(0);
  });

  it("filters when statuses or variants are undefined (no filtering on that criterion)", () => {
    const testNamePattern = /^test1$/i;
    const statuses: string[] = []; // No status filtering
    const variants = ["variant1", "variant2"];

    const result = filterGroupedTests(
      groupedTests,
      testNamePattern,
      statuses,
      variants,
    );

    expect(result.size).toBe(1);
    expect(result.get("test1")).toEqual([
      {
        buildVariant: "variant1",
        displayStatus: "failed",
        id: "task1_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
      {
        buildVariant: "variant2",
        displayStatus: "success",
        id: "task2_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task2",
      },
    ]);
  });

  it("performs case insensitive matching on test names", () => {
    const testNamePattern = /^TEST1$/i; // Uppercase
    const statuses = ["failed", "success"];
    const variants = ["variant1", "variant2"];

    const result = filterGroupedTests(
      groupedTests,
      testNamePattern,
      statuses,
      variants,
    );

    expect(result.size).toBe(1);
    expect(result.get("test1")).toEqual([
      {
        buildVariant: "variant1",
        displayStatus: "failed",
        id: "task1_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task1",
      },
      {
        buildVariant: "variant2",
        displayStatus: "success",
        id: "task2_id",
        logs: {
          urlParsley: "",
        },
        taskName: "task2",
      },
    ]);
  });
});
