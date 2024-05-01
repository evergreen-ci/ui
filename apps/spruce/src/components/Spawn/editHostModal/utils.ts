import { diff } from "deep-object-diff";
import isEqual from "lodash.isequal";
import { EditSpawnHostMutationVariables } from "gql/generated/types";

export const computeDiff = (
  initialState: EditSpawnHostMutationVariables,
  currEditState: EditSpawnHostMutationVariables,
): [boolean, EditSpawnHostMutationVariables] => {
  const hasChanges = !isEqual(initialState, currEditState);

  const mutationParams = diff(
    initialState,
    currEditState,
  ) as EditSpawnHostMutationVariables;

  // diff changes the format of these array fields, so we need to reformat them to be correct.
  if (mutationParams.addedInstanceTags) {
    mutationParams.addedInstanceTags = Object.values(
      mutationParams.addedInstanceTags,
    );
  }
  if (mutationParams.deletedInstanceTags) {
    mutationParams.deletedInstanceTags = Object.values(
      mutationParams.deletedInstanceTags,
    );
  }

  // Always overwrite the whole sleep schedule, no need to update on a per-field basis.
  if (mutationParams.sleepSchedule) {
    mutationParams.sleepSchedule = currEditState.sleepSchedule;
  }

  return [hasChanges, mutationParams];
};
