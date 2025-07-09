import { gql } from "@apollo/client";
import Button, { Size } from "@leafygreen-ui/button";
import { showTaskReviewedUI } from "constants/featureFlags";
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
          }
        `,
      },
      (data) => ({ ...data, reviewed: data.reviewed ? 0 : 1 }),
    );
  };
  return showTaskReviewedUI ? (
    <Button onClick={handleClick} size={Size.Small}>
      {task.reviewed === 1 ? "Mark unreviewed" : "Mark reviewed"}
    </Button>
  ) : null;
};
