import { gql } from "@apollo/client";
import Checkbox from "@leafygreen-ui/checkbox";
import { LeafyGreenTableRow } from "@leafygreen-ui/table";
import { cache } from "gql/client/cache";
import { TaskTableInfo } from "./types";

export const ReviewedCheckbox: React.FC<{
  reviewed: number;
  row: LeafyGreenTableRow<TaskTableInfo>;
  task: TaskTableInfo;
  taskId: string;
}> = ({ reviewed, row, task }) => {
  const checked = reviewed === 1;
  // TODO: Add indeterminate handling
  const indeterminate = reviewed === -1;

  const updateCache = (t: TaskTableInfo, reviewedUpdate: number) => {
    cache.writeFragment({
      id: cache.identify(t),
      fragment: gql`
        fragment TaskReviewed on Task {
          reviewed
        }
      `,
      data: {
        reviewed: reviewedUpdate,
      },
    });
  };

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCache(task, +e.target.checked);

    row.subRows.forEach((sr) => {
      updateCache(sr.original, +e.target.checked);
    });
  };

  return (
    <Checkbox
      aria-label="reviewed"
      checked={checked}
      indeterminate={indeterminate}
      onChange={handleClick}
    />
  );
};
