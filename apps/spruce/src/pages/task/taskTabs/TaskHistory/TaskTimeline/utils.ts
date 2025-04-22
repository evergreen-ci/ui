import { GroupedTask } from "../types";

const areDatesOnSameDay = (
  date1?: Date | null,
  date2?: Date | null,
): boolean => {
  if (!date1 || !date2) {
    return false;
  }
  const parsedDate1 = new Date(date1);
  const parsedDate2 = new Date(date2);
  return (
    parsedDate1.getFullYear() === parsedDate2.getFullYear() &&
    parsedDate1.getMonth() === parsedDate2.getMonth() &&
    parsedDate1.getDate() === parsedDate2.getDate()
  );
};

const extractTask = (task: GroupedTask) => {
  if (task.task) {
    return task.task;
  }
  return task.inactiveTasks?.[0] || null;
};
export { areDatesOnSameDay, extractTask };
