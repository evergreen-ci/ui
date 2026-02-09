import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Select, Size as SelectSize, Option } from "@leafygreen-ui/select";
import { Body } from "@leafygreen-ui/typography";
import { fontSize, size } from "@evg-ui/lib/constants";
import {
  TaskAllExecutionsQuery,
  TaskAllExecutionsQueryVariables,
} from "gql/generated/types";
import { TASK_ALL_EXECUTIONS } from "gql/queries";
import { useDateFormat } from "hooks";
import { formatZeroIndexForDisplay } from "utils/numbers";
import { ExecutionStatusIcon } from "./ExecutionStatusIcon";

interface ExecutionSelectorProps {
  currentExecution: number;
  latestExecution: number | null;
  taskId: string;
  updateExecution: (execution: number) => void;
}

const ExecutionSelector: React.FC<ExecutionSelectorProps> = ({
  currentExecution,
  latestExecution,
  taskId,
  updateExecution,
}) => {
  const { data, loading } = useQuery<
    TaskAllExecutionsQuery,
    TaskAllExecutionsQueryVariables
  >(TASK_ALL_EXECUTIONS, {
    variables: { taskId },
  });
  const allExecutions = data?.taskAllExecutions;

  const getDateCopy = useDateFormat();

  return (
    <StyledSelect
      key={currentExecution}
      allowDeselect={false}
      aria-label="Execution Select"
      data-cy="execution-select"
      disabled={loading}
      onChange={(val: string) => {
        updateExecution(Number(val));
      }}
      size={SelectSize.Small}
      value={currentExecution.toString()}
    >
      {allExecutions?.map(
        ({ activatedTime, displayStatus, execution, ingestTime }) => {
          const dateCopy = getDateCopy(
            activatedTime ?? ingestTime ?? new Date(),
            { omitTimezone: true },
          );
          const formattedIndex = formatZeroIndexForDisplay(execution);
          const optionText =
            execution === latestExecution
              ? `Execution ${formattedIndex} (latest)`
              : `Execution ${formattedIndex}`;
          return (
            <Option
              key={execution}
              data-cy={`execution-${execution}`}
              description={dateCopy}
              glyph={<ExecutionStatusIcon status={displayStatus} />}
              value={execution.toString()}
            >
              <StyledBody>{optionText}</StyledBody>
            </Option>
          );
        },
      )}
    </StyledSelect>
  );
};

const StyledSelect = styled(Select)`
  margin-bottom: ${size.xs};
`;

const StyledBody = styled(Body)`
  font-size: ${fontSize.m};
`;

export default ExecutionSelector;
