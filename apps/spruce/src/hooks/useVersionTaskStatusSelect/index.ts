import { useEffect, useReducer } from "react";
import { GroupedBuildVariant } from "gql/generated/types";
import { usePrevious } from "hooks";

export interface selectedStrings {
  [id: string]: boolean | undefined;
}

export type versionSelectedTasks = {
  [id: string]: selectedStrings;
};

type versionFilters = {
  [versionId: string]: string[];
};

type Action =
  | { type: "setSelectedTasks"; data: versionSelectedTasks }
  | { type: "setVersionStatusFilterTerm"; data: versionFilters }
  | { type: "setBaseStatusFilterTerm"; data: versionFilters };

interface State {
  versionStatusFilterTerm: versionFilters;
  baseStatusFilterTerm: versionFilters;
  selectedTasks: versionSelectedTasks;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setSelectedTasks":
      return {
        ...state,
        selectedTasks: action.data,
      };
    case "setVersionStatusFilterTerm":
      return {
        ...state,
        versionStatusFilterTerm: action.data,
      };
    case "setBaseStatusFilterTerm":
      return {
        ...state,
        baseStatusFilterTerm: action.data,
      };
    default:
      throw new Error();
  }
};

type FilterSetter = (statuses: versionFilters) => void;

type HookResult = {
  selectedTasks: versionSelectedTasks;
  versionStatusFilterTerm: versionFilters;
  baseStatusFilterTerm: versionFilters;
  toggleSelectedTask: (
    taskIds:
      | { [versionId: string]: string }
      | { [versionId: string]: string[] },
  ) => void;
  setVersionStatusFilterTerm: FilterSetter;
  setBaseStatusFilterTerm: FilterSetter;
};

type UpdatedVersionBuildVariantType = Omit<GroupedBuildVariant, "tasks"> & {
  tasks?: task[];
};

type task = {
  id: string;
  baseStatus?: string;
  displayName: string;
  displayStatus: string;
  execution: number;
};

type ChildVersions = {
  id: string;
  buildVariants?: UpdatedVersionBuildVariantType[];
}[];
export const useVersionTaskStatusSelect = (
  versionBuildVariants: UpdatedVersionBuildVariantType[],
  versionId: string,
  childVersions: ChildVersions,
): HookResult => {
  const [
    { baseStatusFilterTerm, selectedTasks, versionStatusFilterTerm },
    dispatch,
  ] = useReducer(reducer, {
    baseStatusFilterTerm: {},
    versionStatusFilterTerm: {},
    selectedTasks: {},
  });

  const toggleSelectedTask = (
    taskIds:
      | { [versionId: string]: string }
      | { [versionId: string]: string[] },
  ) => {
    const newState = { ...selectedTasks };
    const taskVersion = Object.keys(taskIds)[0];

    const selected = taskIds[taskVersion];

    if (typeof selected === "string") {
      if (newState[taskVersion][selected]) {
        newState[taskVersion][selected] = false;
      } else {
        newState[taskVersion][selected] = true;
      }
    } else {
      // Enter this condition when a parent checkbox is clicked.
      // If every task is already checked, uncheck them. Otherwise, check them.
      const nextCheckedState = !selected.every(
        (selectedId) => selectedTasks[taskVersion][selectedId],
      );
      selected.forEach((selectedId) => {
        newState[taskVersion][selectedId] = nextCheckedState;
      });
    }
    dispatch({ type: "setSelectedTasks", data: newState });
  };

  // Determine if a task is a selected based on the filter terms and available tasks
  const prevVersionBuildVariants = usePrevious(versionBuildVariants);
  const prevVersionStatusFilterTerm = usePrevious(versionStatusFilterTerm);
  const prevBaseStatusFilterTerm = usePrevious(baseStatusFilterTerm);
  useEffect(() => {
    const filterTermOrVersionTasksChanged =
      versionBuildVariants !== prevVersionBuildVariants ||
      versionStatusFilterTerm !== prevVersionStatusFilterTerm ||
      baseStatusFilterTerm !== prevBaseStatusFilterTerm;

    if (filterTermOrVersionTasksChanged) {
      const parentNextState =
        reduceBuildVariants({
          parentTasksChanged: versionBuildVariants !== prevVersionBuildVariants,
          buildVariants: versionBuildVariants,
          versionStatusFilterTerm: versionStatusFilterTerm[versionId],
          baseStatusFilterTerm: baseStatusFilterTerm[versionId],
          selectedTasks: selectedTasks[versionId],
        }) ?? {};
      const newTaskSelect = { [versionId]: parentNextState };
      childVersions?.forEach((cv) => {
        const childId = cv.id;
        const childNextState =
          reduceBuildVariants({
            parentTasksChanged:
              versionBuildVariants !== prevVersionBuildVariants,
            buildVariants: cv.buildVariants ?? [],
            versionStatusFilterTerm: versionStatusFilterTerm[childId],
            baseStatusFilterTerm: baseStatusFilterTerm[childId],
            selectedTasks: selectedTasks[childId],
          }) ?? {};
        newTaskSelect[childId] = childNextState;
      });

      // @ts-expect-error: FIXME. This comment was added by an automated script.
      dispatch({ type: "setSelectedTasks", data: newTaskSelect });
    }
  }, [
    baseStatusFilterTerm,
    childVersions,
    versionBuildVariants,
    versionStatusFilterTerm,
    prevBaseStatusFilterTerm,
    prevVersionBuildVariants,
    prevVersionStatusFilterTerm,
    selectedTasks,
    versionId,
  ]);

  const setVersionStatusFilterTerm = (statuses: versionFilters) => {
    const vId = Object.keys(statuses)[0];

    const nextState = { ...versionStatusFilterTerm };
    nextState[vId] = statuses[vId];
    dispatch({ type: "setVersionStatusFilterTerm", data: nextState });
  };
  const setBaseStatusFilterTerm = (statuses: versionFilters) => {
    const vId = Object.keys(statuses)[0];

    const nextState = { ...baseStatusFilterTerm };
    nextState[vId] = statuses[vId];
    dispatch({ type: "setBaseStatusFilterTerm", data: nextState });
  };
  return {
    selectedTasks,
    versionStatusFilterTerm,
    baseStatusFilterTerm,
    toggleSelectedTask,
    setVersionStatusFilterTerm,
    setBaseStatusFilterTerm,
  };
};

type reduceInput = {
  parentTasksChanged: boolean;
  buildVariants: UpdatedVersionBuildVariantType[];
  versionStatusFilterTerm: string[];
  baseStatusFilterTerm: string[];
  selectedTasks: selectedStrings | undefined;
};

const reduceBuildVariants = (filterDetails: reduceInput) => {
  const {
    baseStatusFilterTerm,
    buildVariants,
    parentTasksChanged,
    selectedTasks,
    versionStatusFilterTerm,
  } = filterDetails;

  const statuses = new Set(versionStatusFilterTerm);
  const baseStatuses = new Set(baseStatusFilterTerm);
  // if 1 of the 2 filters is empty, ignore the empty filter
  const hasFilter =
    !!versionStatusFilterTerm?.length || !!baseStatusFilterTerm?.length;

  const hasStatus = (status: string) =>
    versionStatusFilterTerm?.length ? statuses.has(status) : true;

  const hasBaseStatus = (status?: string) =>
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    baseStatusFilterTerm?.length ? baseStatuses.has(status) : true;

  const isSelected = (task: task) =>
    hasFilter &&
    hasStatus(task.displayStatus) &&
    hasBaseStatus(task.baseStatus);

  if (versionStatusFilterTerm || baseStatusFilterTerm || parentTasksChanged) {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const taskReducer = (acc, task: task) => ({
      ...acc,
      [task.id]: isSelected(task),
    });

    const bvReducer = (
      acc: UpdatedVersionBuildVariantType,
      versionBuildVariant: UpdatedVersionBuildVariantType,
    ) => versionBuildVariant.tasks?.reduce(taskReducer, acc);

    // Iterate through VersionBuildVariants and determine if a task should be
    // selected or not based on if the task status correlates with the 2 filters.
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    const reducedVariants = buildVariants?.reduce(bvReducer, {
      ...selectedTasks,
    });

    return reducedVariants;
  }
  return selectedTasks;
};
