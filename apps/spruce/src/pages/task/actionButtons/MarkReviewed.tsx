import { useEffect } from "react";
import { gql } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
import { showTaskReviewUI } from "constants/featureFlags";
import { cache } from "gql/client/cache";
import { TaskQuery } from "gql/generated/types";

export const MarkReviewed: React.FC<{
  task: NonNullable<TaskQuery["task"]>;
}> = ({ task }) => {
  const handleClick = () => {
    cache.updateFragment(
      {
        id: cache.identify(task),
        fragment: gql`
          fragment TaskReviewed on Task {
            reviewed
            executionTasksFull {
              id
              execution
              reviewed
            }
          }
        `,
      },
      (data) => ({
        ...data,
        reviewed: !data.reviewed,
        ...(data.executionTasksFull
          ? {
              executionTasksFull: data.executionTasksFull.map(
                (e: TaskQuery["task"]) => ({
                  ...e,
                  reviewed: !data.reviewed,
                }),
              ),
            }
          : {}),
      }),
    );
  };

  const reviewed = task.executionTasksFull?.length
    ? task.executionTasksFull.every((e) => e.reviewed)
    : task.reviewed;

  useEffect(() => {
    if (task.executionTasksFull?.length) {
      cache.updateFragment(
        {
          id: cache.identify(task),
          fragment: gql`
            fragment TaskReviewed on Task {
              reviewed
            }
          `,
        },
        (data) => ({
          ...data,
          reviewed,
        }),
      );
    }
  }, [reviewed]);

  return showTaskReviewUI ? (
    <Button onClick={handleClick} size={Size.Small}>
      {task.reviewed ? "Mark unreviewed" : "Mark reviewed"}
    </Button>
  ) : null;
};
