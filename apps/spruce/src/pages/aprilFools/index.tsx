import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { H1 } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { APRIL_FOOLS_BANNERS, APRIL_FOOLS_IMAGES } from "components/AprilFools";
import { getPreferencesRoute, PreferencesTabRoutes } from "constants/routes";

export const AprilFools: React.FC = () => (
  <PageContainer>
    <H1>April Fools!</H1>
    <Link to={getPreferencesRoute(PreferencesTabRoutes.UISettings)}>
      <Button variant="primary">Subscribe to Evergreen Premium!</Button>
    </Link>
    <Gallery>
      {APRIL_FOOLS_BANNERS.map((src, idx) => (
        <Banner
          key={src}
          alt={`Evergreen April Fools Ad ${idx + 1}`}
          src={src}
        />
      ))}
      {APRIL_FOOLS_IMAGES.map((src, idx) => (
        <Image
          key={src}
          alt={`Evergreen April Fools Image ${idx + 1}`}
          src={src}
        />
      ))}
    </Gallery>
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

const Gallery = styled.div`
  margin-top: ${size.l};
  display: flex;
  flex-wrap: wrap;
  gap: ${size.m};
  justify-content: center;
`;

const Banner = styled.img`
  max-width: 100%;
  max-height: 120px;
  height: auto;
  object-fit: contain;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 240px;
  height: auto;
  object-fit: contain;
`;
