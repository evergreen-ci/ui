import styled from "@emotion/styled";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import { Size } from "@leafygreen-ui/tokens";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { DateFilter } from "components/DateFilter";
import { useQueryParams } from "hooks/useQueryParam";
import { TaskHistoryOptions, ViewOptions } from "../types";

interface ControlsProps {
  date: string;
  setViewOption: (v: ViewOptions) => void;
  viewOption: ViewOptions;
}

export const Controls: React.FC<ControlsProps> = ({
  date,
  setViewOption,
  viewOption,
}) => {
  const [queryParams, setQueryParams] = useQueryParams();

  return (
    <Container>
      <LeftContainer>
        <Subtitle>Task History Overview</Subtitle>
        <DateFilter
          onChange={(newDate) => {
            setQueryParams({
              ...queryParams,
              [TaskHistoryOptions.Direction]: undefined,
              [TaskHistoryOptions.CursorID]: undefined,
              [TaskHistoryOptions.IncludeCursor]: undefined,
              [TaskHistoryOptions.Date]: newDate,
            });
          }}
          size={Size.Small}
          value={date}
        />
      </LeftContainer>
      <SegmentedControl
        aria-controls="[data-cy='task-timeline']"
        onChange={(t) => setViewOption(t as ViewOptions)}
        size="xsmall"
        value={viewOption}
      >
        <SegmentedControlOption
          data-cy="collapsed-option"
          value={ViewOptions.Collapsed}
        >
          Collapsed
        </SegmentedControlOption>
        <SegmentedControlOption
          data-cy="expanded-option"
          value={ViewOptions.Expanded}
        >
          Expanded
        </SegmentedControlOption>
      </SegmentedControl>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${size.s};
`;
