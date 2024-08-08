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
      <StyledDisclaimer>
        AMI changed from {amiBefore} to {amiAfter}
      </StyledDisclaimer>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  padding-bottom: ${size.s};
`;

const StyledDisclaimer = styled(Disclaimer)`
  padding-top: ${size.xxs};
`;
