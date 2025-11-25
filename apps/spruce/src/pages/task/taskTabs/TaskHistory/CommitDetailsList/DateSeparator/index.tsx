import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { useDateFormat } from "hooks";

const { gray } = palette;
interface DateSeparatorProps {
  date: Date;
}
const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const getDateCopy = useDateFormat();
  return (
    <Container data-cy="horizontal-date-separator">
      <Badge>
        {getDateCopy(date, {
          dateOnly: true,
        })}
      </Badge>
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
  flex: 1;
  margin-left: 8px;
  height: 1px;
  background:
    linear-gradient(to right, transparent 50%, white 50%),
    linear-gradient(to right, ${gray.light1}, ${gray.light1});
  background-size: 12px 4px;
  width: 100%;
`;
export default DateSeparator;
