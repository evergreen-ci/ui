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
  mainlineCommitsGroupedStatuses,
  waterfallGroupedStatuses,
} from "components/TaskStatusIcon";
import { routes } from "constants/routes";
import { taskStatusToCopy } from "constants/task";
import { useOnClickOutside } from "hooks";
import { walkthroughSteps, waterfallGuideId } from "pages/waterfall/constants";

type LegendContentProps = {
  isWaterfallPage: boolean;
};

export const LegendContent: React.FC<LegendContentProps> = ({
  isWaterfallPage,
}) => {
  const Container = isWaterfallPage
    ? WaterfallContainer
    : MainlineCommitsContainer;

  const groupedStatuses = isWaterfallPage
    ? waterfallGroupedStatuses
    : mainlineCommitsGroupedStatuses;

  return (
    <Container>
      {groupedStatuses.map(({ icon, statuses }) => (
        <Row key={statuses.join()}>
          <LegendIcon>{icon}</LegendIcon>
          <LegendLabel>
            {statuses.map((status) => (
              <Body key={status}>{taskStatusToCopy[status]}</Body>
            ))}
          </LegendLabel>
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

const LegendIcon = styled.div`
  flex-shrink: 0;
`;

const LegendLabel = styled.div``;

const legendProps = { [waterfallGuideId]: walkthroughSteps[1].targetId };

export const TaskStatusIconLegend: React.FC = () => {
  const isWaterfallPage = !!useMatch(`${routes.waterfall}/*`);

  const { sendEvent } = (
    isWaterfallPage ? useWaterfallAnalytics : useProjectHealthAnalytics
  )({ page: "Commit chart" });

  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([buttonRef, popoverRef], () => setOpen(false));

  return (
    <div {...legendProps}>
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
          <LegendContent isWaterfallPage={isWaterfallPage} />
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
