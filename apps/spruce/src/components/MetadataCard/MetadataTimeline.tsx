import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { useDateFormat } from "hooks/useDateFormat";

const { blue } = palette;

interface MetadataTimelineRowProps {
  children: React.ReactNode;
  label: string;
  "data-cy"?: string;
  isRunning?: boolean;
}

export const MetadataTimelineRow: React.FC<MetadataTimelineRowProps> = ({
  children,
  "data-cy": dataCy,
  isRunning,
  label,
}) => (
  <TimelineRow data-cy={dataCy} isRunning={isRunning}>
    <Label>{label}</Label>
    <Timestamp isRunning={isRunning}>{children}</Timestamp>
  </TimelineRow>
);

interface MetadataTimelineTimestampRowProps {
  label: string;
  timestamp: Date;
  "data-cy"?: string;
}

export const MetadataTimelineTimestampRow: React.FC<
  MetadataTimelineTimestampRowProps
> = ({ "data-cy": dataCy, label, timestamp }) => {
  const getDateCopy = useDateFormat();

  return (
    <MetadataTimelineRow data-cy={dataCy} label={label}>
      <span title={getDateCopy(timestamp)}>
        {getDateCopy(timestamp, { omitSeconds: true })}
      </span>
    </MetadataTimelineRow>
  );
};

const DOT_SIZE = 10;
const ROW_GAP = 12;
const LABEL_WIDTH = 60;

export const MetadataTimelineContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;

  display: flex;
  flex-direction: column;
  gap: ${ROW_GAP}px;
`;

const Label = styled.b`
  width: ${LABEL_WIDTH}px;
`;

const Timestamp = styled.span<{ isRunning?: boolean }>`
  color: ${({ isRunning }) =>
    isRunning ? palette.gray.base : palette.gray.dark2};
  font-variant-numeric: tabular-nums;
`;

const TimelineRow = styled.li<{ isRunning?: boolean }>`
  font-size: 12px;
  line-height: ${size.s};
  padding-left: ${size.s};

  position: relative;
  display: flex;
  align-items: flex-start;
  gap: ${size.xs};

  // Dashed lines.
  &:not(:last-child)::before {
    content: "";
    position: absolute;
    left: calc(${DOT_SIZE / 2}px);
    top: calc(50% + ${DOT_SIZE / 2}px);
    bottom: -${ROW_GAP}px;

    border-left: 1px dashed ${blue.base};
  }

  // Dots.
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: ${size.xxs};

    width: ${DOT_SIZE}px;
    height: ${DOT_SIZE}px;
    border-radius: 50%;
    background: ${({ isRunning }) =>
      isRunning
        ? `radial-gradient(circle, ${palette.gray.base} 20%, transparent 70%)`
        : `radial-gradient(circle, ${blue.base} 20%, transparent 70%)`};
  }
`;
