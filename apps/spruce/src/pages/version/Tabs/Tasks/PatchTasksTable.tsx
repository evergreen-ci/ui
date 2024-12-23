import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { InputFilterProps } from "components/Table/Filters";
import TasksTable from "components/TasksTable";
import { PaginationQueryParams } from "constants/queryParams";
import { slugs } from "constants/routes";
import { Task, VersionTasksQuery, SortOrder } from "gql/generated/types";
import {
  useTaskStatuses,
  useStatusesFilter,
  useFilterInputChangeHandler,
} from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { PatchTasksQueryParams, TableOnChange } from "types/task";
import { queryString } from "utils";

const { toSortString } = queryString;

interface Props {
  isPatch: boolean;
  tasks: VersionTasksQuery["version"]["tasks"]["data"];
  sorts: SortOrder[];
  loading: boolean;
}

export const PatchTasksTable: React.FC<Props> = ({
  isPatch,
  loading,
  sorts,
  tasks,
}) => {
  const { [slugs.versionId]: versionId } = useParams();
  const [queryParams, setQueryParams] = useQueryParams();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { sendEvent } = useVersionAnalytics(versionId);
  const filterHookProps = {
    resetPage: true,
    sendAnalyticsEvent: (filterBy: string) =>
      sendEvent({ name: "Filtered tasks table", "filter.by": filterBy }),
  };
  const currentStatusesFilter = useStatusesFilter({
    urlParam: PatchTasksQueryParams.Statuses,
    ...filterHookProps,
  });
  const baseStatusesFilter = useStatusesFilter({
    urlParam: PatchTasksQueryParams.BaseStatuses,
    ...filterHookProps,
  });
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { baseStatuses, currentStatuses } = useTaskStatuses({ versionId });
  const statusSelectorProps = {
    state: currentStatusesFilter.inputValue,
    tData: currentStatuses,
    onChange: currentStatusesFilter.setAndSubmitInputValue,
  };
  const baseStatusSelectorProps = {
    state: baseStatusesFilter.inputValue,
    tData: baseStatuses,
    onChange: baseStatusesFilter.setAndSubmitInputValue,
  };
  const variantFilterInputChangeHandler = useFilterInputChangeHandler({
    urlParam: PatchTasksQueryParams.Variant,
    ...filterHookProps,
  });
  const taskNameFilterInputChangeHandler = useFilterInputChangeHandler({
    urlParam: PatchTasksQueryParams.TaskName,
    ...filterHookProps,
  });

  const tableChangeHandler: TableOnChange<Task> = (...[, , sorter]) => {
    setQueryParams({
      ...queryParams,
      sorts: toSortString(sorter),
      [PaginationQueryParams.Page]: "0",
    });
  };

  const variantInputProps: InputFilterProps = {
    placeholder: "Variant name regex",
    value: variantFilterInputChangeHandler.inputValue,
    onChange: ({ target }) =>
      variantFilterInputChangeHandler.setInputValue(target.value),
    onFilter: variantFilterInputChangeHandler.submitInputValue,
  };

  const taskNameInputProps: InputFilterProps = {
    placeholder: "Task name regex",
    value: taskNameFilterInputChangeHandler.inputValue,
    onChange: ({ target }) =>
      taskNameFilterInputChangeHandler.setInputValue(target.value),
    onFilter: taskNameFilterInputChangeHandler.submitInputValue,
  };

  return (
    <TasksTable
      baseStatusSelectorProps={baseStatusSelectorProps}
      isPatch={isPatch}
      loading={loading}
      onClickTaskLink={(taskId) =>
        sendEvent({
          name: "Clicked task table task link",
          "task.id": taskId,
        })
      }
      onColumnHeaderClick={(sortField) =>
        sendEvent({
          name: "Sorted tasks table",
          "sort.by": sortField,
        })
      }
      onExpand={(expanded) => {
        sendEvent({
          name: "Toggled display task expansion",
          expanded,
        });
      }}
      sorts={sorts}
      statusSelectorProps={statusSelectorProps}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      tableChangeHandler={tableChangeHandler}
      taskNameInputProps={taskNameInputProps}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      tasks={tasks}
      variantInputProps={variantInputProps}
    />
  );
};
