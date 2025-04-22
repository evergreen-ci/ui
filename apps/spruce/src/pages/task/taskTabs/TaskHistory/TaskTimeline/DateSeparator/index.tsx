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
    <Container>
      <StyledBadge>{dateString}</StyledBadge>
      <Line />
    </Container>
  );
};

const Container = styled.div`
  width: 16px;
  height: 16px;
  position: relative;
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
const Line = styled.div`
  width: 1px;
  height: 100%;
  background-color: ${gray.light1};
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
export default DateSeparator;
