import { VariantTask } from "gql/generated/types";
import { VariantTasksState } from "hooks/useConfigurePatch";
import { versionSelectedTasks } from "hooks/useVersionTaskStatusSelect";
import { getNumEstimatedActivatedTasks } from "./estimatedActivatedTasks";

describe("getNumEstimatedActivatedTasks", () => {
  const generatedTaskCounts: { [key: string]: number } = {
    "variant1-task1": 5,
    "variant1-task2": 10,
  };
  it("should compute correctly when using VariantTasksState", () => {
    const selectedBuildVariantTasks: VariantTasksState = {
      variant1: {
        task1: true,
        task2: true,
        task3: true,
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
  it("should compute correctly when using a set", () => {
    const set = new Set(["variant1-task1", "variant1-task2", "variant1-task3"]);
    expect(getNumEstimatedActivatedTasks(set, generatedTaskCounts)).toBe(18);
  });
  it("should compute correctly when using versionSelectedTasks", () => {
    const vsts: versionSelectedTasks = {
      variant1: {
        task1: true,
        task2: true,
        task3: true,
      },
    };
    expect(getNumEstimatedActivatedTasks(vsts, generatedTaskCounts)).toBe(18);
  });
});
