import { useEffect } from "react";
import { gql, useApolloClient } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { showTaskReviewUI } from "constants/featureFlags";
import { TaskQuery } from "gql/generated/types";

export const MarkReviewed: React.FC<{
  task: Pick<
    NonNullable<TaskQuery["task"]>,
    "id" | "displayStatus" | "execution" | "reviewed" | "executionTasksFull"
  >;
}> = ({ task }) => {
  const { cache } = useApolloClient();
  const handleClick = () => {
    if (task?.executionTasksFull?.length) {
      cache.updateFragment(
        {
          id: cache.identify(task),
          fragment: gql`
            fragment TaskReviewed on Task {
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
        (data) => ({
          ...data,
          reviewed: !data.reviewed,
          executionTasksFull: data.executionTasksFull.map(
            (e: TaskQuery["task"]) =>
              e?.displayStatus === TaskStatus.Succeeded
                ? e
                : {
                    ...e,
                    reviewed: !data.reviewed,
                  },
          ),
        }),
      );
    } else {
      cache.updateFragment(
        {
          id: cache.identify(task),
          fragment: gql`
            fragment ExecutionTaskReviewed on Task {
              reviewed
            }
          `,
        },
        (data) => ({
          ...data,
          reviewed: !data.reviewed,
        }),
      );
    }
  };

  const reviewed = task?.executionTasksFull?.length
    ? task.executionTasksFull.every(
        (e) => e.displayStatus === TaskStatus.Succeeded || e.reviewed,
      )
    : task.reviewed;

  useEffect(() => {
    if (task.executionTasksFull?.length) {
      cache.updateFragment(
        {
          id: cache.identify(task),
          fragment: gql`
            fragment DisplayTaskReviewed on Task {
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
    <Button
      disabled={task.displayStatus === TaskStatus.Succeeded}
      onClick={handleClick}
      size={Size.Small}
    >
      {task.reviewed ? "Mark unreviewed" : "Mark reviewed"}
    </Button>
  ) : null;
};
