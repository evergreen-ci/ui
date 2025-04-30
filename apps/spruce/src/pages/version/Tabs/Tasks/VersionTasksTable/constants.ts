import { TaskSortCategory } from "gql/generated/types";
import { PatchTasksQueryParams } from "types/task";

const mapIdToFilterParam = {
  [TaskSortCategory.Name]: PatchTasksQueryParams.TaskName,
  [TaskSortCategory.Status]: PatchTasksQueryParams.Statuses,
  [TaskSortCategory.BaseStatus]: PatchTasksQueryParams.BaseStatuses,
  [TaskSortCategory.Variant]: PatchTasksQueryParams.Variant,
};

const emptyFilterQueryParams = {
  [PatchTasksQueryParams.TaskName]: undefined,
  [PatchTasksQueryParams.Statuses]: undefined,
  [PatchTasksQueryParams.BaseStatuses]: undefined,
  [PatchTasksQueryParams.Variant]: undefined,
};

const defaultSorting = [
  { id: TaskSortCategory.Status, desc: false },
  { id: TaskSortCategory.BaseStatus, desc: true },
];

export { mapIdToFilterParam, emptyFilterQueryParams, defaultSorting };
