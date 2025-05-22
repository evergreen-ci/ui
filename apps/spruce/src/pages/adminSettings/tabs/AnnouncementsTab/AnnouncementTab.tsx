import styled from "@emotion/styled";
import { H2, H3 } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";

export const AnnouncementTab = () => (
  <div>
    <TitleContainer>
      <H2>Announcements</H2>
    </TitleContainer>
    <H3>Announcements</H3>
    <p>Announcements settings for the application.</p>
  </div>
);

const TitleContainer = styled.div`
  margin-bottom: ${size.m};
`;
