import styled from "@emotion/styled";
import { H2, H3 } from "@leafygreen-ui/typography";

export const AnnouncementTab = () => (
  <div>
    <TitleContainer>
      <H2 data-cy="preferences-tab-title">Announcements</H2>
    </TitleContainer>
    <H3>Announcements</H3>
    <p>Announcements settings for the application.</p>
  </div>
);

const TitleContainer = styled.div`
  margin-bottom: 30px;
`;
