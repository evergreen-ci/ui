import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { useDateFormat } from "hooks/useDateFormat";

const { blue, gray } = palette;

interface TimelineEvent {
  "data-cy"?: string;
  label: string;
  time: Date;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const getDateCopy = useDateFormat();

  if (events.length === 0) return null;

  return (
    <TimelineContainer>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <EventRow key={event.label}>
            <DotColumn>
              <Dot />
              {!isLast && <Connector />}
            </DotColumn>
            <EventContent data-cy={event["data-cy"]}>
              <EventLabel>{event.label}</EventLabel>
              <EventTime title={getDateCopy(event.time)}>
                {getDateCopy(event.time, { omitSeconds: true })}
              </EventTime>
            </EventContent>
          </EventRow>
        );
      })}
    </TimelineContainer>
  );
};

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const EventRow = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 28px;
`;

const DotColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16px;
  flex-shrink: 0;
  margin-right: ${size.xs};
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${blue.base};
  border: 2px solid ${blue.light1};
  flex-shrink: 0;
  margin-top: 4px;
`;

const Connector = styled.div`
  width: 2px;
  flex-grow: 1;
  min-height: 8px;
  border-left: 2px dotted ${gray.light2};
`;

const EventContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-grow: 1;
  padding-bottom: 4px;
  gap: ${size.xxs};
  min-width: 0;
`;

const EventLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${gray.dark2};
  white-space: nowrap;
`;

const EventTime = styled.span`
  font-size: 12px;
  color: ${gray.dark1};
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
