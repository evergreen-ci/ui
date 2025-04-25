import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";

const { gray } = palette;
interface DateSeparatorProps {
  date?: Date | null;
}
const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const formattedDate = new Date(date || "").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <Container>
      <Badge>{formattedDate}</Badge>
      <DashedLine />
    </Container>
  );
};

const Container = styled.div`
  /* Dashed line after */
  display: flex;
  align-items: center;
`;
const DashedLine = styled.div`
  border-bottom: 1px dashed ${gray.light1};
  flex: 1;
  margin-left: 8px;
`;
export default DateSeparator;
