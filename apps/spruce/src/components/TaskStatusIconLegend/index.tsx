import { useRef, useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import Popover, { Align, Justify } from "@leafygreen-ui/popover";
import { Body, Overline } from "@leafygreen-ui/typography";
import { useMatch } from "react-router-dom";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import Icon from "components/Icon";
import { PopoverContainer } from "components/styles/Popover";
import {
  groupedIconStatuses,
  waterfallGroupedStatuses,
} from "components/TaskStatusIcon";
import { routes } from "constants/routes";
import { taskStatusToCopy } from "constants/task";
import { useOnClickOutside } from "hooks";

type LegendContentProps = {
  useWaterfall: boolean;
};

export const LegendContent: React.FC<LegendContentProps> = ({
  useWaterfall,
}) => {
  const Container = useWaterfall
    ? WaterfallContainer
    : MainlineCommitsContainer;

  const groupedStatuses = useWaterfall
    ? waterfallGroupedStatuses
    : groupedIconStatuses;

  return (
    <Container>
      {groupedStatuses.map(({ icon, statuses }) => (
        <Row key={statuses.join()}>
          <TaskStatusIcon>{icon}</TaskStatusIcon>
          <LabelContainer>
            {statuses.map((status) => (
              <Body key={status}>{taskStatusToCopy[status]}</Body>
            ))}
          </LabelContainer>
        </Row>
      ))}
    </Container>
  );
};

const MainlineCommitsContainer = styled.div`
  width: 420px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${size.xs};
`;

const WaterfallContainer = styled.div`
  width: 420px;
  height: 150px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: ${size.xs};
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${size.xxs};
`;

const TaskStatusIcon = styled.div`
  flex-shrink: 0;
`;

const LabelContainer = styled.div``;

type TaskStatusIconLegendProps = {
  useWaterfall: boolean;
};

export const TaskStatusIconLegend: React.FC<TaskStatusIconLegendProps> = ({
  useWaterfall,
}) => {
  const { sendEvent } = (
    useWaterfall ? useWaterfallAnalytics : useProjectHealthAnalytics
  )({ page: "Commit chart" });

  const isMainlineCommits = !!useMatch(`${routes.commits}/*`);
  const isWaterfall = !!useMatch(`${routes.waterfall}/*`);

  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([buttonRef, popoverRef], () => setOpen(false));

  return (
    <div>
      <IconButton
        ref={buttonRef}
        aria-label="Task status icon legend"
        onClick={() => {
          sendEvent({
            name: "Toggled task icon legend",
            open: !open,
          });
          setOpen(!open);
        }}
      >
        <Icon glyph="QuestionMarkWithCircle" />
      </IconButton>
      <Popover
        ref={popoverRef}
        active={open}
        align={Align.Top}
        justify={Justify.End}
        popoverZIndex={zIndex.popover}
        refEl={buttonRef}
      >
        <StyledPopoverContainer>
          <TitleContainer>
            <Overline>Icon Legend</Overline>
            <IconButton
              aria-label="Close task status icon legend"
              onClick={() => {
                sendEvent({
                  name: "Toggled task icon legend",
                  open: false,
                });
                setOpen(false);
              }}
            >
              <Icon glyph="X" />
            </IconButton>
          </TitleContainer>
          <LegendContent
            useWaterfall={isWaterfall || (useWaterfall && !isMainlineCommits)}
          />
        </StyledPopoverContainer>
      </Popover>
    </div>
  );
};

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${size.s};
`;

const StyledPopoverContainer = styled(PopoverContainer)`
  border-radius: ${size.m};
  padding: ${size.m};
`;
