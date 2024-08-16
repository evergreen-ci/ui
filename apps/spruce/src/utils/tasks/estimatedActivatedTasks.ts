import { VariantTask } from "gql/generated/types";
import { VariantTasksState } from "hooks/useConfigurePatch";
import {
  selectedStrings,
  versionSelectedTasks,
} from "hooks/useVersionTaskStatusSelect";

type ValidInputTypes = Set<string> | versionSelectedTasks | VariantTasksState;

export const getNumEstimatedActivatedTasks = (
  inputType: ValidInputTypes,
  map: { [key: string]: number },
  variantsTasks?: Array<VariantTask>,
): number => {
  if (inputType instanceof Set) {
    return countForSet(inputType, map);
  }
  if (isVariantTasksState(inputType)) {
    return countForVariantTasksState(inputType, map, variantsTasks);
  }
  if (isVersionSelectedTasks(inputType)) {
    return countForVersionSelectedTasks(inputType, map);
  }
  throw new Error("Unrecognized input type for counting generated tasks");
};

const countForSet = (
  selectedTasks: Set<string>,
  generatedTaskCounts: { [key: string]: number },
): number => {
  let numEstimatedActivatedGeneratedTasks = selectedTasks.size;
  selectedTasks.forEach((key) => {
    if (generatedTaskCounts[key]) {
      numEstimatedActivatedGeneratedTasks += generatedTaskCounts[key];
    }
  });
  return numEstimatedActivatedGeneratedTasks;
};

const countForVariantTasksState = (
  selectedBuildVariantTasks: VariantTasksState,
  generatedTaskCounts: { [p: string]: number },
  variantsTasks?: Array<VariantTask>,
): number => {
  const existingTasks = new Set<string>();
  let numEstimatedActivatedGeneratedTasks = 0;

  variantsTasks?.forEach((variantTask) => {
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
        numEstimatedActivatedGeneratedTasks += 1;
        if (generatedTaskCounts[`${variant}-${task}`]) {
          numEstimatedActivatedGeneratedTasks +=
            generatedTaskCounts[`${variant}-${task}`];
        }
      }
    });
  });
  return numEstimatedActivatedGeneratedTasks;
};

const countForVersionSelectedTasks = (
  selectedTasks: versionSelectedTasks,
  generatedTaskCounts: { [key: string]: number },
) =>
  Object.values(selectedTasks).reduce(
    (total, selectedTask) =>
      countEstimatedGeneratedTasks(selectedTask, generatedTaskCounts) + total,
    0,
  );

const countEstimatedGeneratedTasks = (
  selected: selectedStrings,
  generatedTaskCounts: { [key: string]: number },
) => {
  let numEstimatedActivatedGeneratedTasks = 0;
  Object.keys(selected).forEach((task) => {
    if (selected[task]) {
      numEstimatedActivatedGeneratedTasks += 1;
      if (generatedTaskCounts[task]) {
        numEstimatedActivatedGeneratedTasks += generatedTaskCounts[task];
      }
    }
  });
  return numEstimatedActivatedGeneratedTasks;
};

const isVersionSelectedTasks = (obj: any): obj is versionSelectedTasks =>
  obj &&
  typeof obj === "object" &&
  Object.values(obj).every((value) => typeof value === "object");

const isVariantTasksState = (obj: any): obj is VariantTasksState =>
  obj &&
  typeof obj === "object" &&
  Object.values(obj).every((value) => typeof value === "object");
