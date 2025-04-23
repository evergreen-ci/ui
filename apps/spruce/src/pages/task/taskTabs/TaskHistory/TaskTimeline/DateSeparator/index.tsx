import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";

const { gray } = palette;
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
  width: 8px;
  height: 16px;
  position: relative;
  cursor: pointer;
`;
const StyledBadge = styled(Badge)`
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 4px;
  padding: 4px;
  font-size: 12px;
  color: black;
  :hover {
    z-index: 1;
  }
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  background-color: ${gray.light1};
  border-radius: 50%;
  position: absolute;
  top: -16px;
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
