import { TaskHistoryTask, GroupedTask } from "../types";

/**
 * `groupTasks` groups tasks into active and inactive tasks based on the `shouldCollapse` parameter.
 * @param tasks - an array of tasks returned from the TaskHistory query
 * @param shouldCollapse - a boolean. If set to false, no tasks will be collapsed. If set to true, inactive tasks will be collapsed.
 * @returns an array of grouped tasks
 */
export const groupTasks = (
  tasks: TaskHistoryTask[],
  shouldCollapse: boolean,
) => {
  const groupedTasks: GroupedTask[] = [];

  const pushInactive = (t: TaskHistoryTask) => {
    if (!groupedTasks?.[groupedTasks.length - 1]?.inactiveTasks) {
      groupedTasks.push({ task: null, inactiveTasks: [] });
    }
    groupedTasks[groupedTasks.length - 1].inactiveTasks?.push(t);
  };

  const pushActive = (t: TaskHistoryTask) => {
    groupedTasks.push({
      inactiveTasks: null,
      task: t,
    });
  };

  tasks.forEach((task) => {
    if (!task.activated && shouldCollapse) {
      pushInactive(task);
    } else {
      pushActive(task);
    }
  });

  return groupedTasks;
};
