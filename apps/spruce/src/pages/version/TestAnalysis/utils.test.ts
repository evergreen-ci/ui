import {
  TestAnalysisQueryTasks,
  GroupedTestMap,
  TaskBuildVariantField,
} from "./types";
import {
  groupTestsByName,
  filterGroupedTests,
  getAllBuildVariants,
} from "./utils";

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
        id: "task1_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
      },
      {
        taskName: "task1",
        buildVariant: "variant1",
        id: "task1_id",
        status: "success",
        logs: {
          urlParsley: "",
        },
      },
    ]);
  });
});

describe("filterGroupedTests", () => {
  let groupedTests: GroupedTestMap;

  beforeEach(() => {
    groupedTests = new Map<string, TaskBuildVariantField[]>([
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
  });

  it("filters tests by regex pattern, statuses, and build variants", () => {
    const testNamePattern = "^test\\d$"; // Matches 'test1' and 'test2'
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
    const testNamePattern = "^test1$";
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
    const testNamePattern = "^nonexistentTest$";
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
    const testNamePattern = "^test1$";
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

  it("handles invalid regex pattern gracefully", () => {
    const testNamePattern = "["; // Invalid regex
    const statuses = ["failed", "success"];
    const variants = ["variant1", "variant2"];

    expect(() => {
      filterGroupedTests(groupedTests, testNamePattern, statuses, variants);
    }).toThrowError();
  });

  it("filters when statuses or variants are undefined (no filtering on that criterion)", () => {
    const testNamePattern = "^test1$";
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
});

describe("getAllBuildVariants", () => {
  it("should return an empty array when the map is empty", () => {
    const taskMap = new Map<string, TaskBuildVariantField[]>();

    const result = getAllBuildVariants(taskMap);
    expect(result).toEqual([]);
  });

  it("should return a list of unique build variants", () => {
    const taskMap = new Map<string, TaskBuildVariantField[]>([
      [
        "test1",
        [
          {
            taskName: "task1",
            buildVariant: "variant1",
            id: "id1",
            status: "passed",
            logs: {
              urlParsley: "",
            },
          },
          {
            taskName: "task2",
            buildVariant: "variant2",
            id: "id2",
            status: "failed",
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
            id: "id3",
            status: "passed",
            logs: {
              urlParsley: "",
            },
          },
          {
            taskName: "task4",
            buildVariant: "variant3",
            id: "id4",
            status: "failed",
            logs: {
              urlParsley: "",
            },
          },
        ],
      ],
    ]);

    const result = getAllBuildVariants(taskMap);
    expect(result).toEqual(["variant1", "variant2", "variant3"]);
  });

  it("should handle tasks with duplicate build variants", () => {
    const taskMap = new Map<string, TaskBuildVariantField[]>([
      [
        "test1",
        [
          {
            taskName: "task1",
            buildVariant: "variant1",
            id: "id1",
            status: "passed",
            logs: {
              urlParsley: "",
            },
          },
          {
            taskName: "task2",
            buildVariant: "variant1",
            id: "id2",
            status: "failed",
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
            buildVariant: "variant2",
            id: "id3",
            status: "passed",
            logs: {
              urlParsley: "",
            },
          },
        ],
      ],
    ]);

    const result = getAllBuildVariants(taskMap);
    expect(result).toEqual(["variant1", "variant2"]);
  });

  it("should return unique build variants from tasks with different build variants", () => {
    const taskMap = new Map<string, TaskBuildVariantField[]>([
      [
        "test1",
        [
          {
            taskName: "task1",
            buildVariant: "variant1",
            id: "id1",
            status: "passed",
            logs: {
              urlParsley: "",
            },
          },
          {
            taskName: "task2",
            buildVariant: "variant2",
            id: "id2",
            status: "failed",
            logs: { urlParsley: "" },
          },
        ],
      ],
      [
        "test2",
        [
          {
            taskName: "task3",
            buildVariant: "variant3",
            id: "id3",
            status: "passed",
            logs: { urlParsley: "" },
          },
          {
            taskName: "task4",
            buildVariant: "variant4",
            id: "id4",
            status: "failed",
            logs: { urlParsley: "" },
          },
        ],
      ],
    ]);

    const result = getAllBuildVariants(taskMap);
    expect(result).toEqual(["variant1", "variant2", "variant3", "variant4"]);
  });

  it("should return build variants even if there are no tasks", () => {
    const taskMap = new Map<string, TaskBuildVariantField[]>([
      ["test1", []],
      ["test2", []],
    ]);

    const result = getAllBuildVariants(taskMap);
    expect(result).toEqual([]);
  });
});
