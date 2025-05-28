import { FieldMergeFunction, FieldReadFunction } from "@apollo/client";
import { TaskHistoryQuery, TaskHistoryDirection } from "gql/generated/types";
import { ACTIVATED_TASKS_LIMIT } from "../constants";
import { TaskHistoryTask, TaskHistoryPagination } from "../types";
import { isAllInactive } from "./utils";

type TaskHistoryCache = TaskHistoryQuery["taskHistory"] & {
  allTaskOrders?: Set<number>;
};

export const readTasks = ((existing, { args, readField }) => {
  if (!existing) {
    return undefined;
  }

  // Always query for date, since it's an uncommon operation.
  const date = args?.options?.date ?? "";
  if (date) {
    return undefined;
  }

  const cursorId = args?.options?.cursorParams?.cursorId ?? "";
  const includeCursor = args?.options?.cursorParams?.includeCursor ?? false;
  const direction = args?.options?.cursorParams?.direction ?? "";
  const limit = args?.options?.limit ?? ACTIVATED_TASKS_LIMIT;

  const pagination = readField<TaskHistoryPagination>("pagination", existing);
  const { mostRecentTaskOrder = 0, oldestTaskOrder = 0 } = pagination ?? {};

  const existingTasks = readField<TaskHistoryTask[]>("tasks", existing) ?? [];

  const idx = existingTasks.findIndex((t) => {
    const taskId = readField<string>("id", t) ?? "";
    return taskId === cursorId;
  });

  if (idx === -1) {
    return undefined;
  }

  const pagingBackwards = direction === TaskHistoryDirection.After;
  const pagingForwards = direction === TaskHistoryDirection.Before;
  const activeTasks = new Set<string>();

  let startIndex = 0;
  let endIndex = 0;

  if (pagingBackwards) {
    startIndex = 0;
    endIndex = includeCursor ? idx : idx - 1;

    // Count backwards for paginating backwards.
    for (let i = endIndex; i >= 0; i--) {
      const activated =
        readField<boolean>("activated", existingTasks[i]) ?? false;
      if (activated) {
        const id = readField<string>("id", existingTasks[i]) ?? "";
        activeTasks.add(id);
      }

      // When we've collected LIMIT active tasks, we're done.
      // We should also grab any leading inactive tasks.
      if (activeTasks.size === limit) {
        startIndex = i;
        if (isAllInactive(existingTasks.slice(0, startIndex), readField)) {
          startIndex = 0;
        }
        break;
      }
    }
  }

  if (pagingForwards) {
    startIndex = includeCursor ? idx : idx + 1;
    endIndex = existingTasks.length;

    // Count forwards for paginating forwards.
    for (let i = startIndex; i < existingTasks.length; i++) {
      const activated =
        readField<boolean>("activated", existingTasks[i]) ?? false;
      if (activated) {
        const id = readField<string>("id", existingTasks[i]) ?? "";
        activeTasks.add(id);
      }

      // When we've collected LIMIT active tasks, we're done.
      // We should also grab any trailing inactive tasks.
      if (activeTasks.size === limit) {
        endIndex = i;
        if (isAllInactive(existingTasks.slice(endIndex + 1), readField)) {
          endIndex = existingTasks.length;
        }
        break;
      }
    }
  }

  if (activeTasks.size < limit) {
    const allTaskOrders =
      readField<Set<number>>("allTaskOrders", existing) ?? new Set<number>();
    if (pagingBackwards && !allTaskOrders.has(mostRecentTaskOrder)) {
      return undefined;
    }
    if (pagingForwards && !allTaskOrders.has(oldestTaskOrder)) {
      return undefined;
    }
  }

  // Add 1 because slice is [inclusive, exclusive).
  const tasks = existingTasks.slice(startIndex, endIndex + 1);

  return {
    tasks,
    pagination: {
      mostRecentTaskOrder,
      oldestTaskOrder,
    },
  };
}) satisfies FieldReadFunction<TaskHistoryCache>;

export const mergeTasks = ((existing, incoming, { readField }) => {
  const existingTasks = readField<TaskHistoryTask[]>("tasks", existing) ?? [];
  const incomingTasks = readField<TaskHistoryTask[]>("tasks", incoming) ?? [];
  const tasks = [...existingTasks, ...incomingTasks];

  // Use a map to enforce that there are no duplicates.
  const allTasks = new Map<string, TaskHistoryTask>();
  const allTaskOrders = new Set<number>();
  tasks.forEach((t) => {
    const id = readField<string>("id", t) ?? "";
    allTasks.set(id, t);

    const order = readField<number>("order", t) ?? 0;
    allTaskOrders.add(order);
  });

  // Tasks will be sorted in descending order e.g. 100, 99, 98, ...
  const sortedTasks = Array.from(allTasks.values()).sort((a, b) => {
    const aOrder = readField<number>("order", a) ?? 0;
    const bOrder = readField<number>("order", b) ?? 0;
    return bOrder - aOrder;
  });

  const pagination = readField<TaskHistoryPagination>(
    "pagination",
    incoming,
  ) ?? {
    mostRecentTaskOrder: 0,
    oldestTaskOrder: 0,
  };

  return {
    tasks: sortedTasks,
    pagination,
    allTaskOrders,
  };
}) satisfies FieldMergeFunction<TaskHistoryCache>;
