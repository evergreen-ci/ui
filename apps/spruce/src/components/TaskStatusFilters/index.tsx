import styled from "@emotion/styled";
import { TreeSelect } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import Dropdown from "components/Dropdown";
import { noFilterMessage } from "constants/strings";
import { useTaskStatuses } from "hooks";

interface Props {
  versionId: string;
  selectedStatuses: string[];
  selectedBaseStatuses: string[];
  onChangeStatusFilter: (s: string[]) => void;
  onChangeBaseStatusFilter: (s: string[]) => void;
}

export const TaskStatusFilters: React.FC<Props> = ({
  onChangeBaseStatusFilter,
  onChangeStatusFilter,
  selectedBaseStatuses,
  selectedStatuses,
  versionId,
}) => {
  const { baseStatuses, currentStatuses } = useTaskStatuses({ versionId });

  return (
    <Container>
      <SelectorWrapper>
        <Dropdown
          buttonText={`Task Status: ${
            selectedStatuses.length
              ? selectedStatuses.join(", ")
              : noFilterMessage
          }`}
          data-cy="task-status-filter"
        >
          <TreeSelect
            onChange={onChangeStatusFilter}
            state={selectedStatuses}
            tData={currentStatuses}
          />
        </Dropdown>
      </SelectorWrapper>
      <SelectorWrapper>
        <Dropdown
          buttonText={`Base Task Status: ${
            selectedBaseStatuses.length
              ? selectedBaseStatuses.join(", ")
              : noFilterMessage
          }`}
          data-cy="base-task-status-filter"
        >
          <TreeSelect
            onChange={onChangeBaseStatusFilter}
            state={selectedBaseStatuses}
            tData={baseStatuses}
          />
        </Dropdown>
      </SelectorWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;

const SelectorWrapper = styled.div`
  width: 50%;
`;
