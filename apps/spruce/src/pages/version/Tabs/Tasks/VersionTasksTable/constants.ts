import { TaskSortCategory } from "gql/generated/types";
import { PatchTasksQueryParams } from "types/task";

const mapIdToFilterParam = {
  [TaskSortCategory.BaseStatus]: PatchTasksQueryParams.BaseStatuses,
  [TaskSortCategory.Name]: PatchTasksQueryParams.TaskName,
  [TaskSortCategory.Status]: PatchTasksQueryParams.Statuses,
  [TaskSortCategory.Variant]: PatchTasksQueryParams.Variant,
};

const emptyFilterQueryParams = {
  [PatchTasksQueryParams.BaseStatuses]: undefined,
  [PatchTasksQueryParams.Statuses]: undefined,
  [PatchTasksQueryParams.TaskName]: undefined,
  [PatchTasksQueryParams.Variant]: undefined,
};

const defaultSorting = [
  { desc: false, id: TaskSortCategory.Status },
  { desc: true, id: TaskSortCategory.BaseStatus },
];

export { mapIdToFilterParam, emptyFilterQueryParams, defaultSorting };
