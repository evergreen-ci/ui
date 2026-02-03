import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants";
import { useDateFormat } from "hooks";

interface Props {
  timestamp: Date;
  user: string;
  section?: string | null;
}

export const Header: React.FC<Props> = ({ section, timestamp, user }) => {
  const getDateCopy = useDateFormat();

  return (
    <StyledHeader>
      <Subtitle>{getDateCopy(timestamp)}</Subtitle>
      <UserSection>
        <div>{user}</div>
        {section && <SectionLabel>Section: {section}</SectionLabel>}
      </UserSection>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  padding-bottom: ${size.s};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.s};
`;

const SectionLabel = styled.span`
  font-size: 12px;
  color: ${palette.gray.dark1};
  font-style: italic;
`;
