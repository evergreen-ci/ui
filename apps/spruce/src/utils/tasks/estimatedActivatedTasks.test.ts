import { GeneratedTaskCountResults, VariantTask } from "gql/generated/types";
import { VariantTasksState } from "pages/configurePatch/configurePatchCore/useConfigurePatch/types";
import {
  sumActivatedTasksInSelectedTasks,
  sumActivatedTasksInSet,
  sumActivatedTasksInVariantsTasks,
} from "./estimatedActivatedTasks";

describe("getNumEstimatedActivatedTasks", () => {
  const generatedTaskCounts: GeneratedTaskCountResults[] = [
    { taskName: "task1", buildVariantName: "variant1", estimatedTasks: 5 },
    { taskName: "task2", buildVariantName: "variant1", estimatedTasks: 10 },
    { taskName: "task4", buildVariantName: "variant1", estimatedTasks: 20 },
    { taskId: "task1-variant2", estimatedTasks: 100 },
    { taskId: "task2-variant2", estimatedTasks: 50 },
    { taskId: "task4-variant2", estimatedTasks: 25 },
  ];

  it("should compute the correct number of activated tasks to be created when configuring a patch where some tasks have already been created", () => {
    const selectedBuildVariantTasks: VariantTasksState = {
      variant1: {
        task1: true,
        task2: true,
        task3: true,
        task4: false,
      },
    };
    const variantsTasks: Array<VariantTask> = [
      { name: "variant1", tasks: ["task1"] },
    ];
    expect(
      sumActivatedTasksInVariantsTasks(
        selectedBuildVariantTasks,
        generatedTaskCounts,
        variantsTasks,
      ),
    ).toBe(12);
  });
  it("should compute zero when configuring a patch where all selected tasks have already been created", () => {
    const selectedBuildVariantTasks: VariantTasksState = {
      variant1: {
        task1: true,
        task2: true,
        task3: true,
      },
    };
    const variantsTasks: Array<VariantTask> = [
      { name: "variant1", tasks: ["task1"] },
      { name: "variant1", tasks: ["task2"] },
      { name: "variant1", tasks: ["task3"] },
    ];
    expect(
      sumActivatedTasksInVariantsTasks(
        selectedBuildVariantTasks,
        generatedTaskCounts,
        variantsTasks,
      ),
    ).toBe(0);
  });
  it("should compute the correct number of activated tasks to be created when configuring a patch where no tasks have already been created", () => {
    const selectedBuildVariantTasks: VariantTasksState = {
      variant1: {
        task1: true,
        task2: true,
        task3: true,
      },
    };
    expect(
      sumActivatedTasksInVariantsTasks(
        selectedBuildVariantTasks,
        generatedTaskCounts,
        [],
      ),
    ).toBe(18);
  });
  it("should compute the correct number of activated tasks to be created when scheduling multiple unscheduled tasks", () => {
    const set = new Set(["task1-variant2", "task2-variant2", "task3-variant2"]);
    expect(sumActivatedTasksInSet(set, generatedTaskCounts)).toBe(153);
  });
  it("should compute the correct number of activated tasks to be created when restarting all tasks in a version", () => {
    const vsts = new Set([
      "task1-variant2",
      "task2-variant2",
      "task3-variant2",
    ]);
    expect(sumActivatedTasksInSelectedTasks([vsts], generatedTaskCounts)).toBe(
      153,
    );
  });
  it("should compute the correct number of activated tasks to be created when restarting some tasks in a version", () => {
    const vsts = new Set(["task1-variant2", "task3-variant2"]);
    expect(sumActivatedTasksInSelectedTasks([vsts], generatedTaskCounts)).toBe(
      102,
    );
  });
  it("should compute zero for empty input", () => {
    expect(sumActivatedTasksInSelectedTasks([], [])).toBe(0);
  });
});
