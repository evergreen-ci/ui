import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";

const { gray } = palette;

export const DATE_SEPARATOR_WIDTH = 8;
interface DateSeparatorProps {
  date?: Date | null;
}
const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const parsedDate = new Date(date || "");
  const formattedDate = parsedDate?.toLocaleDateString("en-US", {
    month: "2-digit",
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
  background-color: ${gray.light1};
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
export default DateSeparator;
