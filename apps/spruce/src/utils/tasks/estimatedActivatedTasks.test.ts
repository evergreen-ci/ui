import { VariantTask } from "gql/generated/types";
import { VariantTasksState } from "hooks/useConfigurePatch";
import { versionSelectedTasks } from "hooks/useVersionTaskStatusSelect";
import { getNumEstimatedActivatedTasks } from "./estimatedActivatedTasks";

describe("getNumEstimatedActivatedTasks", () => {
  const generatedTaskCounts: { [key: string]: number } = {
    "variant1-task1": 5,
    "variant1-task2": 10,
    "variant1-task4": 20,
  };
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
      getNumEstimatedActivatedTasks(
        selectedBuildVariantTasks,
        generatedTaskCounts,
        variantsTasks,
      ),
    ).toBe(12);
  });
  it("should compute the correct number of activated tasks to be created when configuring a patch where no tasks have already been created", () => {
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
      getNumEstimatedActivatedTasks(
        selectedBuildVariantTasks,
        generatedTaskCounts,
        variantsTasks,
      ),
    ).toBe(0);
  });
  it("should compute zero when configuring a patch where all selected tasks have already been created", () => {
    const selectedBuildVariantTasks: VariantTasksState = {
      variant1: {
        task1: true,
        task2: true,
        task3: true,
      },
    };
    expect(
      getNumEstimatedActivatedTasks(
        selectedBuildVariantTasks,
        generatedTaskCounts,
        [],
      ),
    ).toBe(18);
  });
  it("should compute the correct number of activated tasks to be created when scheduling multiple unscheduled tasks", () => {
    const set = new Set(["variant1-task1", "variant1-task2", "variant1-task3"]);
    expect(getNumEstimatedActivatedTasks(set, generatedTaskCounts)).toBe(18);
  });
  it("should compute the correct number of activated tasks to be created when restarting all tasks in a version", () => {
    const vsts: versionSelectedTasks = {
      variant1: {
        task1: true,
        task2: true,
        task3: true,
      },
    };
    expect(getNumEstimatedActivatedTasks(vsts, generatedTaskCounts)).toBe(18);
  });
  it("should compute the correct number of activated tasks to be created when restarting some tasks in a version", () => {
    const vsts: versionSelectedTasks = {
      variant1: {
        task1: true,
        task2: false,
        task3: true,
      },
    };
    expect(getNumEstimatedActivatedTasks(vsts, generatedTaskCounts)).toBe(7);
  });
  it("should compute zero for empty input", () => {
    expect(getNumEstimatedActivatedTasks({}, {})).toBe(0);
  });
});
