import { useCallback, useEffect } from "react";
import { gql } from "@apollo/client";
import { useApolloClient, useFragment } from "@apollo/client/react";
import { TaskStatus } from "@evg-ui/lib/types";
import { useTaskAnalytics } from "analytics";
import { ReviewedTaskFragment } from "gql/generated/types";
import { setItem, setItems } from "./db";
import { REVIEWED_TASK_FRAGMENT } from "./utils";

export const useTaskReview = ({
  execution,
  taskId,
}: {
  execution: number;
  taskId: string;
}) => {
  const { sendEvent } = useTaskAnalytics();
  const { cache } = useApolloClient();
  const { data } = useFragment<ReviewedTaskFragment>({
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
      cache.updateFragment<{
        id: string;
        execution: number;
        reviewed: boolean;
      }>(
        {
          id: cacheTaskId,
          fragment: gql`
            fragment NonDisplayTaskReviewed on Task {
              id
              execution
              reviewed
            }
          `,
        },
        (existing) => {
          if (!existing) return existing;
          const reviewedUpdate = newReviewedState ?? !existing.reviewed;
          setItem([existing.id, existing.execution], reviewedUpdate);
          sendEvent({ name: "Clicked review task", reviewed: reviewedUpdate });
          return {
            ...existing,
            reviewed: reviewedUpdate,
          };
        },
      );
    },
    [cache, cacheTaskId, sendEvent],
  );

  // We have to break out display tasks and non-display mostly for testing purposes :(
  // In prod, non-nullable executionTasksFull handles this better.
  const updateDisplayTask = useCallback(() => {
    cache.updateFragment<ReviewedTaskFragment>(
      {
        id: cacheTaskId,
        fragment: REVIEWED_TASK_FRAGMENT,
      },
      (existing) => {
        if (!existing) return existing;
        const reviewedUpdate = !existing.reviewed;
        sendEvent({ name: "Clicked review task", reviewed: reviewedUpdate });
        setItems([
          { key: [existing.id, existing.execution], value: reviewedUpdate },
          ...(existing.executionTasksFull ?? [])
            .filter((e) => e.displayStatus !== TaskStatus.Succeeded)
            .map((e) => ({
              key: [e.id, e.execution] as [string, number],
              value: reviewedUpdate,
            })),
        ]);
        return {
          ...existing,
          reviewed: reviewedUpdate,
          executionTasksFull:
            existing?.executionTasksFull?.map((e) =>
              e?.displayStatus === TaskStatus.Succeeded
                ? e
                : {
                    ...e,
                    reviewed: reviewedUpdate,
                  },
            ) ?? null,
        };
      },
    );
  }, [cache, cacheTaskId, sendEvent]);

  const someChecked: boolean =
    (data.displayStatus !== TaskStatus.Succeeded &&
      data?.executionTasksFull?.some((t) => t?.reviewed)) ??
    false;
  const allChecked: boolean =
    (data.displayStatus !== TaskStatus.Succeeded &&
      data.executionTasksFull?.every(
        (e) => e?.displayStatus === TaskStatus.Succeeded || e?.reviewed,
      )) ??
    false;
  const checked: boolean = data?.executionTasksFull?.length
    ? allChecked
    : !!data.reviewed;

  useEffect(() => {
    if (data.executionTasksFull?.length && checked !== data.reviewed) {
      updateTask(checked);
    }
  }, [allChecked]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    allChecked,
    checked,
    someChecked,
    task: data,
    updateTask,
    updateDisplayTask,
  };
};
