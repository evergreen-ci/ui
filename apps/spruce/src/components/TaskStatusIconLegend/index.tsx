import { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import Popover from "@leafygreen-ui/popover";
import { Disclaimer, Overline } from "@leafygreen-ui/typography";
import { size, zIndex } from "@evg-ui/lib/constants/tokens";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import Icon from "components/Icon";
import { PopoverContainer } from "components/styles/Popover";
import { groupedIconStatuses } from "components/TaskStatusIcon";
import { taskStatusToCopy } from "constants/task";

export const LegendContent = () => (
  <Container>
    {groupedIconStatuses.map(({ icon, statuses }) => {
      const label = statuses.map((status) => (
        <Disclaimer key={status}>{taskStatusToCopy[status]}</Disclaimer>
      ));
      return (
        <Row key={statuses.join()}>
          {icon}
          <LabelContainer>{label}</LabelContainer>
        </Row>
      );
    })}
  </Container>
);

export const TaskStatusIconLegend: React.FC = () => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <IconButton
        aria-label="Task Status Icon Legend"
        onClick={() => {
          setIsActive(!isActive);
          sendEvent({
            name: "Toggled task icon legend",
            open: true,
          });
        }}
      >
        <StyledIcon glyph="QuestionMarkWithCircle" />
      </IconButton>
      <Popover
        active={isActive}
        align="top"
        justify="end"
        // In some cases, the z-index of the popover needs to be higher than the rest
        // of the app due to some components having a higher z-index.
        popoverZIndex={zIndex.tooltip}
        usePortal
      >
        <StyledPopoverContainer>
          <TitleContainer>
            <Overline>Icon Legend</Overline>
            <IconButton
              aria-label="Close Task Status Icon Legend"
              onClick={() => {
                sendEvent({
                  name: "Toggled task icon legend",
                  open: false,
                });
                setIsActive(false);
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

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${size.xs};
  margin-right: ${size.xs};
`;

const Container = styled.div`
  width: 400px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const LabelContainer = styled.div`
  margin-left: ${size.xs};
`;

const TitleContainer = styled.div`
  margin-bottom: ${size.m};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledPopoverContainer = styled(PopoverContainer)`
  border-radius: ${size.xs};
`;
