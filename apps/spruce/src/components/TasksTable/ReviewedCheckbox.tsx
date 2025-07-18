import { useEffect } from "react";
import { gql, useApolloClient } from "@apollo/client";
import Checkbox from "@leafygreen-ui/checkbox";
import { LeafyGreenTableRow } from "@leafygreen-ui/table";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskTableInfo } from "./types";

export const ReviewedCheckbox: React.FC<{
  row: LeafyGreenTableRow<TaskTableInfo>;
}> = ({ row }) => {
  const { cache } = useApolloClient();
  const task = row.original;

  const someChecked = row.subRows.some((sr) => sr.original.reviewed);
  const allChecked = row.subRows.every(
    (sr) =>
      sr.original.displayStatus === TaskStatus.Succeeded ||
      sr.original.reviewed,
  );
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
      if (sr.original.displayStatus !== TaskStatus.Succeeded) {
        updateCache(sr.original, e.target.checked);
      }
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
      aria-label={`Mark as ${checked ? "un" : ""}reviewed`}
      checked={checked}
      data-lgid={`lg-reviewed-${row.original.id}`}
      disabled={row.original.displayStatus === TaskStatus.Succeeded}
      indeterminate={indeterminate}
      onChange={handleClick}
    />
  );
};
