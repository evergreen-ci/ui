/**
 * isPushCompletedVirtualTask determines whether a task execution was push-completed by a runner task
 * rather than run on a host. Push-completed executions have no host-specific information.
 * @param task - the task to check
 * @param task.isVirtual - whether the task is a virtual task
 * @param task.completedBy - the ID of the runner task that push-completed this execution, if any
 * @returns true if the task execution was push-completed
 */
export const isPushCompletedVirtualTask = (task: {
  isVirtual?: boolean | null;
  completedBy?: string | null;
}) => !!task.isVirtual && !!task.completedBy;
