import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { useDateFormat } from "hooks";

interface Props {
  amiBefore: string;
  amiAfter: string;
  timestamp: Date;
}

export const Header: React.FC<Props> = ({ timestamp }) => {
  const getDateCopy = useDateFormat();

  return (
    <StyledHeader>
      <Subtitle>{getDateCopy(timestamp)}</Subtitle>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  padding-bottom: ${size.s};
`;
