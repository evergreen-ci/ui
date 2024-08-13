import { VariantTask } from "../../../gql/generated/types";
import { VariantTasksState } from "../../../hooks/useConfigurePatch";

export const getNumEstimatedActivatedGeneratedTasks = (
  selectedBuildVariantTasks: VariantTasksState,
  variantsTasks: Array<VariantTask>,
  generatedTaskCounts: { [key: string]: number },
): number => {
  const existingTasks = new Set<string>();
  let count = 0;

  variantsTasks.forEach((variantTask) => {
    const variant = variantTask.name;
    variantTask.tasks.forEach((task) => {
      existingTasks.add(`${variant}-${task}`);
    });
  });

  Object.keys(selectedBuildVariantTasks).forEach((variant) => {
    Object.keys(selectedBuildVariantTasks[variant]).forEach((task) => {
      if (
        selectedBuildVariantTasks[variant][task] &&
        !existingTasks.has(`${variant}-${task}`)
      ) {
        count += 1;
        if (generatedTaskCounts[`${variant}-${task}`]) {
          count += generatedTaskCounts[`${variant}-${task}`];
        }
      }
    });
  });
  return count;
};
