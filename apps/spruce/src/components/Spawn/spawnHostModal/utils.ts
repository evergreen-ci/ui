import { SpawnTaskQuery } from "gql/generated/types";

export const validateTask = (taskData: SpawnTaskQuery["task"]) => {
  const {
    buildVariant,
    displayName: taskDisplayName,
    revision,
  } = taskData || {};
  return taskDisplayName && buildVariant && revision;
};
