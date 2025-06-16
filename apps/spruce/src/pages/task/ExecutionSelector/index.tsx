import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Select, Size as SelectSize, Option } from "@leafygreen-ui/select";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { fontSize, size } from "@evg-ui/lib/constants/tokens";
import {
  TaskAllExecutionsQuery,
  TaskAllExecutionsQueryVariables,
} from "gql/generated/types";
import { TASK_ALL_EXECUTIONS } from "gql/queries";
import { useDateFormat } from "hooks";
import { formatZeroIndexForDisplay } from "utils/numbers";
import { ExecutionStatusIcon } from "./ExecutionStatusIcon";

interface ExecutionSelectProps {
  taskId: string;
  currentExecution: number;
  latestExecution: number | null;
  updateExecution: (execution: number) => void;
}

const ExecutionSelector: React.FC<ExecutionSelectProps> = ({
  currentExecution,
  latestExecution,
  taskId,
  updateExecution,
}) => {
  const allExecutionsResult = useQuery<
    TaskAllExecutionsQuery,
    TaskAllExecutionsQueryVariables
  >(TASK_ALL_EXECUTIONS, {
    variables: { taskId },
  });
  const allExecutions = allExecutionsResult?.data?.taskAllExecutions;
  const executionsLoading = allExecutionsResult?.loading;

  const getDateCopy = useDateFormat();

  return (
    <StyledSelect
      key={currentExecution}
      allowDeselect={false}
      aria-label="Execution Select"
      data-cy="execution-select"
      disabled={executionsLoading}
      onChange={(val: string) => {
        updateExecution(Number(val));
      }}
      size={SelectSize.Small}
      value={currentExecution.toString()}
    >
      {allExecutions?.map(
        ({ activatedTime, displayStatus, execution, ingestTime }) => {
          let optionText = `Execution ${formatZeroIndexForDisplay(execution)}`;
          const dateCopy = getDateCopy(
            activatedTime ?? ingestTime ?? new Date(),
            { omitTimezone: true },
          );
          if (execution === latestExecution) {
            optionText = optionText.concat(" (latest)");
          }
          return (
            <Option
              key={execution}
              data-cy={`execution-${execution}`}
              description={dateCopy}
              glyph={<ExecutionStatusIcon status={displayStatus} />}
              value={execution.toString()}
            >
              <ExecutionInfo>
                <StyledBody>{optionText}</StyledBody>
              </ExecutionInfo>
            </Option>
          );
        },
      )}
    </StyledSelect>
  );
};

const StyledSelect = styled(Select)`
  margin-bottom: ${size.xs};
  width: 100%;
`;

const ExecutionInfo = styled.div`
  display: flex;
  align-items: center;
`;

const StyledBody = styled(Body)<BodyProps>`
  font-size: ${fontSize.m};
`;

export default ExecutionSelector;
