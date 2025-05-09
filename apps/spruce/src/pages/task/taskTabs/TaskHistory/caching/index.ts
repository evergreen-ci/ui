import { FieldMergeFunction, FieldReadFunction } from "@apollo/client";
import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import { TaskHistoryQuery, TaskHistoryDirection } from "gql/generated/types";
import { ACTIVATED_TASKS_LIMIT } from "../constants";

export const isAllInactive = (
  tasks: TaskHistoryQuery["taskHistory"]["tasks"],
  readField: ReadFieldFunction,
) => {
  for (let i = 0; i < tasks.length; i++) {
    const activated = readField<boolean>("activated", tasks[i]) ?? "";
    if (activated) {
      return false;
    }
  }
  return true;
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

  const pagination = readField<TaskHistoryQuery["taskHistory"]["pagination"]>(
    "pagination",
    existing,
  );
  const { mostRecentTaskOrder = 0, oldestTaskOrder = 0 } = pagination ?? {};

  const existingTasks =
    readField<TaskHistoryQuery["taskHistory"]["tasks"]>("tasks", existing) ??
    [];

  const idx = existingTasks.findIndex((t) => {
    const taskId = readField<string>("id", t) ?? "";
    return taskId === cursorId;
  });

  if (idx === -1) {
    return undefined;
  }

  const pagingBackwards = direction === TaskHistoryDirection.After;
  const pagingForwards = direction === TaskHistoryDirection.Before;
  const activeVersions = new Set();

  let startIndex = 0;
  let endIndex = 0;

  if (pagingBackwards) {
    startIndex = 0;
    endIndex = includeCursor ? idx : idx - 1;

    // Count backwards for paginating backwards.
    for (let i = endIndex; i >= 0; i--) {
      const id = readField<string>("id", existingTasks[i]) ?? "";
      const activated = readField<boolean>("activated", existingTasks[i]) ?? "";
      if (activated) {
        activeVersions.add(id);
      }

      // When we've collected LIMIT active versions, we're done.
      // We should also grab any leading inactive versions.
      if (activeVersions.size === limit) {
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
      const id = readField<string>("id", existingTasks[i]) ?? "";
      const activated = readField<boolean>("activated", existingTasks[i]) ?? "";
      if (activated) {
        activeVersions.add(id);
      }

      // When we've collected LIMIT active versions, we're done.
      // We should also grab any trailing inactive versions.
      if (activeVersions.size === limit) {
        endIndex = i;
        if (isAllInactive(existingTasks.slice(endIndex + 1), readField)) {
          endIndex = existingTasks.length;
        }
        break;
      }
    }
  }

  if (activeVersions.size < limit) {
    return undefined;
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
}) satisfies FieldReadFunction<TaskHistoryQuery["taskHistory"]>;

export const mergeTasks = ((existing, incoming, { readField }) => {
  const existingTasks =
    readField<TaskHistoryQuery["taskHistory"]["tasks"]>("tasks", existing) ??
    [];
  const incomingTasks =
    readField<TaskHistoryQuery["taskHistory"]["tasks"]>("tasks", incoming) ??
    [];
  const tasks = [...existingTasks, ...incomingTasks];

  // Use a map to enforce that there are no duplicates.
  const tasksMap = new Map();
  tasks.forEach((t) => {
    const taskId = readField<number>("id", t) ?? 0;
    tasksMap.set(taskId, t);
  });

  // Tasks will be sorted in descending order e.g. 100, 99, 98, ...
  const sortedTasks = Array.from(tasksMap.values()).sort((a, b) => {
    const aOrder = readField<number>("order", a) ?? 0;
    const bOrder = readField<number>("order", b) ?? 0;
    return bOrder - aOrder;
  });

  const pagination = readField<TaskHistoryQuery["taskHistory"]["pagination"]>(
    "pagination",
    incoming,
  ) ?? {
    mostRecentTaskOrder: 0,
    oldestTaskOrder: 0,
  };

  return {
    tasks: sortedTasks,
    pagination,
  };
}) satisfies FieldMergeFunction<TaskHistoryQuery["taskHistory"]>;
