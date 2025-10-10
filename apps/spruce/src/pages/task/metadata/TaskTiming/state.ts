import { TASK_TIMING_CONFIG_KEY } from "constants/index";
import { getObject } from "utils/localStorage";

export type TaskTimingConfig = {
  onlyCommits: boolean;
  onlySuccessful: boolean;
};

export type Action<T> = {
  type: "updateField";
  field: keyof T;
  value: T[keyof T];
};

export const reducer = (
  state: TaskTimingConfig,
  action: Action<TaskTimingConfig>,
) => {
  switch (action.type) {
    case "updateField":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
};

const defaultState: TaskTimingConfig = {
  onlyCommits: false,
  onlySuccessful: false,
};

export const createInitialState = (): TaskTimingConfig => {
  const savedConfig = getObject(TASK_TIMING_CONFIG_KEY);
  return {
    ...defaultState,
    ...savedConfig,
  };
};
