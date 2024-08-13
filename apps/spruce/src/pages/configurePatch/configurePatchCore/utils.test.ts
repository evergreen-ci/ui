import { VariantTask } from "../../../gql/generated/types";
import { VariantTasksState } from "./useConfigurePatch/types";
import { getNumEstimatedActivatedGeneratedTasks } from "./utils";

describe("getNumEstimatedActivatedGeneratedTasks", () => {
  it("should print all tasks for one variant", () => {
    const generatedTaskCounts: { [key: string]: number } = {
      "variant1-task1": 5,
      "variant1-task2": 10,
    };
    const selectedBuildVariantTasks: VariantTasksState = {
      variant1: {
        task1: true,
        task2: true,
      },
    };
    const variantsTasks: Array<VariantTask> = [
      { name: "variant1", tasks: ["task1"] },
    ];
    expect(
      getNumEstimatedActivatedGeneratedTasks(
        selectedBuildVariantTasks,
        variantsTasks,
        generatedTaskCounts,
      ),
    ).toBe(11);
  });
});
