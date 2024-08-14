import styled from "@emotion/styled";
import { Disclaimer, Subtitle } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { useDateFormat } from "hooks";

interface Props {
  amiBefore: string;
  amiAfter: string;
  timestamp: Date;
}

export const Header: React.FC<Props> = ({ amiAfter, amiBefore, timestamp }) => {
  const getDateCopy = useDateFormat();

  return (
    <StyledHeader>
      <Subtitle>{getDateCopy(timestamp)}</Subtitle>
      <Disclaimer>
        AMI changed from {amiBefore} to {amiAfter}
      </Disclaimer>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
  padding-bottom: ${size.s};
`;
