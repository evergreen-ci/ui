import { useEffect } from "react";
import { gql } from "@apollo/client";
import Checkbox from "@leafygreen-ui/checkbox";
import { LeafyGreenTableRow } from "@leafygreen-ui/table";
import { cache } from "gql/client/cache";
import { TaskTableInfo } from "./types";

export const ReviewedCheckbox: React.FC<{
  row: LeafyGreenTableRow<TaskTableInfo>;
}> = ({ row }) => {
  const task = row.original;

  const someChecked = row.subRows.some((sr) => sr.original.reviewed);
  const allChecked = row.subRows.every((sr) => sr.original.reviewed);
  const indeterminate = someChecked && !allChecked;

  const updateCache = (t: TaskTableInfo, reviewedUpdate: boolean) => {
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
    updateCache(task, e.target.checked);

    // If display task is clicked, update its children with the same state
    row.subRows.forEach((sr) => {
      updateCache(sr.original, e.target.checked);
    });
  };

  const checked = row.subRows.length ? allChecked : !!task.reviewed;

  useEffect(() => {
    // If parent is checked or unchecked as a result of its children, persist to cache
    if (row.subRows.length) {
      updateCache(task, checked);
    }
  }, [checked]);

  return (
    <Checkbox
      aria-label="reviewed"
      checked={checked}
      indeterminate={indeterminate}
      onChange={handleClick}
    />
  );
};
