import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useProjectHistoryAnalytics } from "analytics/projectHistory/useProjectHistoryAnalytics";
import {
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import { HistoryQueryParams } from "types/history";

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

  const onChange = (selectedTasks: string[]) => {
    sendEvent({
      name: "Filtered by task",
    });

    setVisibleColumns(selectedTasks);
  };

  const { taskNamesForBuildVariant } = data || {};

  return (
    <Container>
      <Combobox
        data-cy="task-selector"
        disabled={loading}
        label="Tasks"
        multiselect
        onChange={onChange}
        overflow="scroll-x"
        placeholder="Select tasks"
        value={visibleColumns}
      >
        {taskNamesForBuildVariant?.map((taskName) => (
          <ComboboxOption key={taskName} value={taskName} />
        ))}
      </Combobox>
    </Container>
  );
};

const Container = styled.div`
  width: 300px;
`;

export default TaskSelector;
