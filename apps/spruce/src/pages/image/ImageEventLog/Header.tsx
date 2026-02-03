import styled from "@emotion/styled";
import { Disclaimer, Subtitle } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants";
import { useDateFormat } from "hooks";

interface HeaderProps {
  amiBefore: string;
  amiAfter: string;
  timestamp: Date;
}

export const Header: React.FC<HeaderProps> = ({
  amiAfter,
  amiBefore,
  timestamp,
}) => {
  const getDateCopy = useDateFormat();

  return (
    <StyledHeader>
      <Subtitle data-cy="event-log-timestamp">
        {getDateCopy(timestamp)}
      </Subtitle>
      <Disclaimer data-cy="event-log-ami">
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
