import { TestAnalysisQueryTasks, TaskBuildVariantField } from "./types";
import { groupTestsByName, filterGroupedTests, countTotalTests } from "./utils";

const groupedTests = new Map<string, TaskBuildVariantField[]>([
  [
    "test1",
    [
      {
        taskName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
      },
      {
        taskName: "task2",
        buildVariant: "variant2",
        id: "task2_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
      },
    ],
  ],
  [
    "test2",
    [
      {
        taskName: "task3",
        buildVariant: "variant1",
        id: "task3_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
      },
    ],
  ],
  [
    "anotherTest",
    [
      {
        taskName: "task4",
        buildVariant: "variant3",
        id: "task4_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
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
        displayName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "failed",
        execution: 0,
        tests: {
          filteredTestCount: 1,
          testResults: [
            {
              testFile: "test1",
              id: "0",
              status: "fail",
              logs: { urlParsley: "" },
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
        taskName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
      },
    ]);
  });

  it("should group tests correctly when given multiple tasks with overlapping tests", () => {
    const tasks: TestAnalysisQueryTasks = [
      {
        displayName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "failed",
        execution: 0,
        tests: {
          filteredTestCount: 2,
          testResults: [
            {
              testFile: "test1",
              id: "0",
              status: "fail",
              logs: { urlParsley: "" },
            },
            {
              testFile: "test2",
              id: "1",
              status: "fail",
              logs: { urlParsley: "" },
            },
          ],
        },
      },
      {
        displayName: "task2",
        buildVariant: "variant2",
        id: "task2_id",
        status: "failed",
        execution: 0,
        tests: {
          filteredTestCount: 2,
          testResults: [
            {
              testFile: "test2",
              id: "0",
              status: "fail",
              logs: { urlParsley: "" },
            },
            {
              testFile: "test3",
              id: "1",
              status: "fail",
              logs: { urlParsley: "" },
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
        taskName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
      },
    ]);

    expect(result.get("test2")).toEqual([
      {
        taskName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
      },
      {
        taskName: "task2",
        buildVariant: "variant2",
        id: "task2_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
      },
    ]);

    expect(result.get("test3")).toEqual([
      {
        taskName: "task2",
        buildVariant: "variant2",
        id: "task2_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
      },
    ]);
  });

  it("should handle tasks with no tests", () => {
    const tasks: TestAnalysisQueryTasks = [
      {
        displayName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        execution: 0,
        status: "success",
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
        displayName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        execution: 0,
        status: "success",
        tests: {
          filteredTestCount: 2,
          testResults: [
            {
              testFile: "test1",
              id: "1",
              status: "fail",
              logs: { urlParsley: "" },
            },
            {
              testFile: "test1",
              id: "2",
              status: "fail",
              logs: { urlParsley: "" },
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
        taskName: "task1",
        buildVariant: "variant1",
        buildVariantDisplayName: undefined,
        id: "task1_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
      },
    ]);
  });
  it("should handle multiple tasks with the same test name", () => {
    const tasks: TestAnalysisQueryTasks = [
      {
        displayName: "task1",
        buildVariant: "variant1",
        id: "task1_variant1_id",
        execution: 0,
        status: "success",
        tests: {
          filteredTestCount: 2,
          testResults: [
            {
              testFile: "test1",
              id: "1",
              status: "fail",
              logs: { urlParsley: "" },
            },
          ],
        },
      },
      {
        displayName: "task1",
        buildVariant: "variant2",
        id: "task1_variant2_id",
        execution: 0,
        status: "success",
        tests: {
          filteredTestCount: 2,
          testResults: [
            {
              testFile: "test1",
              id: "1",
              status: "fail",
              logs: { urlParsley: "" },
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
        taskName: "task1",
        buildVariant: "variant1",
        buildVariantDisplayName: undefined,
        id: "task1_variant1_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
      },
      {
        taskName: "task1",
        buildVariant: "variant2",
        buildVariantDisplayName: undefined,
        id: "task1_variant2_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
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
        taskName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
      },
      {
        taskName: "task2",
        buildVariant: "variant2",
        id: "task2_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
      },
    ]);

    expect(result.get("test2")).toEqual([
      {
        taskName: "task3",
        buildVariant: "variant1",
        id: "task3_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
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
        taskName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
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
        taskName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
      },
      {
        taskName: "task2",
        buildVariant: "variant2",
        id: "task2_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
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
        taskName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "failed",
        logs: {
          urlParsley: "",
        },
      },
      {
        taskName: "task2",
        buildVariant: "variant2",
        id: "task2_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
      },
    ]);
  });
});
