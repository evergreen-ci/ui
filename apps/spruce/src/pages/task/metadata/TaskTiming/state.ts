import { TASK_TIMING_CONFIG_KEY } from "constants/index";
import { getObject } from "utils/localStorage";

export type TaskTimingConfig = {
  onlyCommits: boolean;
  onlySuccessful: boolean;
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
