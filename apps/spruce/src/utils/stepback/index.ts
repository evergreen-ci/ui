export const isInStepback = (
  stepbackInfo?: {
    lastFailingStepbackTaskId?: string | null;
    nextStepbackTaskId?: string | null;
  } | null,
) => {
  if (!stepbackInfo) {
    return false;
  }

  // The 'lastFailingStepbackTaskId' is set for all stepback tasks except the first one.
  const hasLastStepback =
    stepbackInfo.lastFailingStepbackTaskId &&
    stepbackInfo.lastFailingStepbackTaskId.length > 0;

  // The 'nextStepbackTaskId' is only set when the next task in stepback is running/finished.
  // This happens in the beginning of stepback or the middle of stepback. This condition is
  // covering for the beginning of stepback.
  const isBeginningStepback =
    stepbackInfo.nextStepbackTaskId &&
    stepbackInfo.nextStepbackTaskId.length > 0;

  // If the task is in stepback or beginning stepback, it is counted as in stepback.
  return hasLastStepback || isBeginningStepback;
};
