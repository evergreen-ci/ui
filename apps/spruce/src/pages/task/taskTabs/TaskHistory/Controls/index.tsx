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

interface HeaderControlProps {
  viewOption: ViewOptions;
  setViewOption: (v: ViewOptions) => void;
  date: string;
}

export const Controls: React.FC<HeaderControlProps> = ({
  date,
  setViewOption,
  viewOption,
}) => {
  const [queryParams, setQueryParams] = useQueryParams();

  return (
    <Container>
      <RightContainer>
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
      </RightContainer>
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

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${size.s};
`;
