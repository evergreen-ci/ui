import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import { Size } from "@leafygreen-ui/tokens";
import { Subtitle } from "@leafygreen-ui/typography";
import Cookies from "js-cookie";
import { size } from "@evg-ui/lib/constants";
import { useQueryParams } from "@evg-ui/lib/hooks";
import { useTaskHistoryAnalytics } from "analytics";
import { DateFilter } from "components/DateFilter";
import { TASK_HISTORY_INACTIVE_COMMITS_VIEW } from "constants/cookies";
import {
  walkthroughDateFilterProps,
  walkthroughJumpButtonProps,
  walkthroughInactiveViewProps,
} from "../constants";
import { useTaskHistoryContext } from "../context";
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
  const { isPatch } = useTaskHistoryContext();
  const [queryParams, setQueryParams] = useQueryParams();
  const { sendEvent } = useTaskHistoryAnalytics();

  return (
    <Container>
      <LeftContainer>
        <Subtitle>Task History Overview</Subtitle>
        <DateFilter
          dataCyProps={walkthroughDateFilterProps}
          onChange={(newDate) => {
            sendEvent({
              name: "Filtered by date",
              date: newDate,
            });
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
        <Button
          data-cy="jump-to-this-task-button"
          onClick={() => {
            sendEvent({
              name: "Clicked jump to this task button",
            });
            setQueryParams({
              ...queryParams,
              [TaskHistoryOptions.Direction]: undefined,
              [TaskHistoryOptions.CursorID]: undefined,
              [TaskHistoryOptions.IncludeCursor]: undefined,
              [TaskHistoryOptions.Date]: undefined,
            });
          }}
          size={Size.XSmall}
          {...walkthroughJumpButtonProps}
        >
          Jump to {isPatch ? "base task" : "this task"}
        </Button>
      </LeftContainer>
      <SegmentedControl
        aria-controls="[data-cy='task-timeline']"
        label="Inactive Commits"
        onChange={(t) => {
          sendEvent({
            name: "Toggled inactive tasks view",
            expanded: t === ViewOptions.Expanded,
          });
          setViewOption(t as ViewOptions);
          Cookies.set(TASK_HISTORY_INACTIVE_COMMITS_VIEW, t);
        }}
        size="xsmall"
        value={viewOption}
        {...walkthroughInactiveViewProps}
      >
        <SegmentedControlOption
          data-cy="collapsed-option"
          value={ViewOptions.Collapsed}
        >
          Collapse
        </SegmentedControlOption>
        <SegmentedControlOption
          data-cy="expanded-option"
          value={ViewOptions.Expanded}
        >
          Expand
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
