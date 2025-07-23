import { useCallback, useEffect } from "react";
import { gql, useApolloClient, useFragment } from "@apollo/client";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskQuery } from "gql/generated/types";
import { REVIEWED_TASK_FRAGMENT } from "./utils";

export const useTaskReview = <T extends NonNullable<TaskQuery["task"]>>({
  execution,
  taskId,
}: {
  execution: number;
  taskId: string;
}) => {
  const { cache } = useApolloClient();
  const { data } = useFragment({
    from: {
      __typename: "Task",
      id: taskId,
      execution: execution,
    },
    fragment: REVIEWED_TASK_FRAGMENT,
  });

  const cacheTaskId = cache.identify(data);

  const updateTask = useCallback(
    // Updating a display task whose execution tasks have been modified requires manually specifying its state
    (newReviewedState?: boolean) => {
      cache.updateFragment(
        {
          id: cacheTaskId,
          fragment: gql`
            fragment NonDisplayTaskReviewed on Task {
              reviewed
            }
          `,
        },
        (existing) => ({
          ...existing,
          reviewed: newReviewedState ?? !existing.reviewed,
        }),
      );
    },
    [cache, cacheTaskId],
  );

  // We have to break out display tasks and non-display mostly for testing purposes :(
  // In prod, non-nullable executionTasksFull handles this better.
  const updateDisplayTask = useCallback(() => {
    cache.updateFragment(
      {
        id: cacheTaskId,
        fragment: gql`
          fragment TaskReviewed on Task {
            id
            displayStatus
            execution
            reviewed
            executionTasksFull {
              id
              displayStatus
              execution
              reviewed
            }
          }
        `,
      },
      (existing) => ({
        ...existing,
        reviewed: !existing.reviewed,
        executionTasksFull:
          existing?.executionTasksFull?.map((e: TaskQuery["task"]) =>
            e?.displayStatus === TaskStatus.Succeeded
              ? e
              : {
                  ...e,
                  reviewed: !existing.reviewed,
                },
          ) ?? null,
      }),
    );
  }, [cache, cacheTaskId]);

  const checked = data?.executionTasksFull?.length
    ? data.executionTasksFull?.every(
        (e: T) => e.displayStatus === TaskStatus.Succeeded || e.reviewed,
      )
    : data.reviewed;

  useEffect(() => {
    if (data.executionTasksFull?.length) {
      updateTask(checked);
    }
  }, [checked]);

  return { checked, task: data, updateTask, updateDisplayTask };
};
