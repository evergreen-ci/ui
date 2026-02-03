import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { IconButton } from "@leafygreen-ui/icon-button";
import { Popover, Align, Justify } from "@leafygreen-ui/popover";
import { Body, Overline } from "@leafygreen-ui/typography";
import { Icon } from "@evg-ui/lib/components";
import { taskStatusToCopy, size } from "@evg-ui/lib/constants";
import { useOnClickOutside } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types";
import { useWaterfallAnalytics } from "analytics";
import { PopoverContainer } from "components/styles/Popover";
import { waterfallGroupedStatuses } from "components/TaskStatusIcon";
import { walkthroughSteps, waterfallGuideId } from "pages/waterfall/constants";

export const LegendContent: React.FC = () => (
  <Container>
    {waterfallGroupedStatuses.map(({ icon, statuses }) => (
      <Row key={statuses.join()}>
        <LegendIcon>{icon}</LegendIcon>
        <LegendLabel>
          {statuses.map((status) => (
            <Body key={status}>{taskStatusToCopy[status as TaskStatus]}</Body>
          ))}
        </LegendLabel>
      </Row>
    ))}
  </Container>
);

const Container = styled.div`
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
  const { sendEvent } = useWaterfallAnalytics();

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
          <LegendContent />
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
