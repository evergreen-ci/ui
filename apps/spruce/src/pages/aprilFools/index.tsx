import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { H1 } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { getPreferencesRoute, PreferencesTabRoutes } from "constants/routes";

export const AprilFools: React.FC = () => (
  <PageContainer>
    <H1>April Fools!</H1>
    <Link to={getPreferencesRoute(PreferencesTabRoutes.UISettings)}>
      <Button variant="primary">Subscribe to Evergreen Premium!</Button>
    </Link>
    {/* gallery of all ads */}
  </PageContainer>
);

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  padding: ${size.m};
  // Setting overflow-x allows floating content to be correctly positioned on the page.
  overflow-x: hidden;
`;
