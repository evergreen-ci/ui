import { useQuery } from "@apollo/client/react";
import { Combobox, ComboboxItem } from "@via-ds/components/combobox";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useProjectHistoryAnalytics } from "analytics/projectHistory/useProjectHistoryAnalytics";
import {
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import { HistoryQueryParams } from "types/history";
import styles from "./TaskSelector.module.css";

interface TaskSelectorProps {
  projectIdentifier: string;
  buildVariant: string;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({
  buildVariant,
  projectIdentifier,
}) => {
  const { sendEvent } = useProjectHistoryAnalytics({ page: "Variant history" });

  const [visibleColumns, setVisibleColumns] = useQueryParam<string[]>(
    HistoryQueryParams.VisibleColumns,
    [],
  );

  const { data, loading } = useQuery<
    TaskNamesForBuildVariantQuery,
    TaskNamesForBuildVariantQueryVariables
  >(TASK_NAMES_FOR_BUILD_VARIANT, {
    variables: {
      projectIdentifier,
      buildVariant,
    },
  });

  const { taskNamesForBuildVariant } = data || {};

  return (
    <div className={styles.container}>
      <Combobox<object, "multiple">
        data-testid="task-selector"
        isDisabled={loading}
        isLoading={loading}
        label="Tasks"
        menuTriggerAriaLabel="Tasks"
        onChange={(keys) => {
          sendEvent({ name: "Filtered by task" });
          setVisibleColumns(keys.map(String));
        }}
        placeholder="Select tasks"
        selectionMode="multiple"
        value={visibleColumns}
      >
        {(taskNamesForBuildVariant ?? []).map((taskName) => (
          <ComboboxItem key={taskName} id={taskName}>
            {taskName}
          </ComboboxItem>
        ))}
      </Combobox>
    </div>
  );
};

export default TaskSelector;
