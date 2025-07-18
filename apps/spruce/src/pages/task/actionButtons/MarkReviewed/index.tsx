import { useEffect } from "react";
import { gql, useApolloClient } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
import { showTaskReviewUI } from "constants/featureFlags";
import { TaskQuery } from "gql/generated/types";

export const MarkReviewed: React.FC<{
  task: Pick<
    NonNullable<TaskQuery["task"]>,
    "id" | "execution" | "reviewed" | "executionTasksFull"
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
            (e: TaskQuery["task"]) => ({
              ...e,
              reviewed: !data.reviewed,
            }),
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
    ? task.executionTasksFull.every((e) => e.reviewed)
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
    <Button onClick={handleClick} size={Size.Small}>
      {task.reviewed ? "Mark unreviewed" : "Mark reviewed"}
    </Button>
  ) : null;
};
