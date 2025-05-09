import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { fromZonedTime } from "date-fns-tz";
import { size } from "@evg-ui/lib/constants/tokens";

const { gray } = palette;

export const DATE_SEPARATOR_WIDTH = 12;
interface DateSeparatorProps {
  date?: Date | null;
  timezone?: string;
}
const DateSeparator: React.FC<DateSeparatorProps> = ({ date, timezone }) => {
  const zonedTime = timezone
    ? fromZonedTime(new Date(date || ""), timezone)
    : new Date(date || "");
  const formattedDate = zonedTime.toLocaleDateString("en-US", {
    month: "numeric",
    day: "2-digit",
  });
  const dateString = formattedDate || "";
  return (
    <Container aria-label="date-separator" className="date-separator">
      <StyledBadge className="date-badge">{dateString}</StyledBadge>
      <Dot className="dot" />
      <Line />
    </Container>
  );
};

const Container = styled.div`
  width: ${DATE_SEPARATOR_WIDTH}px;
  height: ${size.s};
  position: relative;
  cursor: pointer;
`;

const StyledBadge = styled(Badge)`
  position: absolute;
  top: -${size.m};
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: ${size.m};
  padding: ${size.xxs};
`;

const Dot = styled.div`
  width: ${size.xxs};
  height: ${size.xxs};
  background-color: ${gray.light1};
  border-radius: 50%;
  position: absolute;
  top: -${size.s};
  left: 50%;
  transform: translateX(-50%);
`;

const Line = styled.div`
  width: 1px;
  height: 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-left: 2px dashed ${gray.base};
  position: absolute;
`;
export default DateSeparator;
