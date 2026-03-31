import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { Body, H1, Subtitle } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { APRIL_FOOLS_BANNERS, APRIL_FOOLS_IMAGES } from "components/AprilFools";
import { getPreferencesRoute, PreferencesTabRoutes } from "constants/routes";

export const AprilFools: React.FC = () => (
  <PageContainer>
    <H1>Evergreen Premium&trade;</H1>
    <Body>
      Thank you for being a valued Evergreen Premium subscriber! Your monthly
      fee of $49.99 helps us keep the hamsters running on their wheels in our
      data centers.
    </Body>
    <Body>
      Upgrade to <strong>Evergreen Premium Ultra&trade;</strong> for just
      $99.99/mo to unlock exciting features like: faster builds (we just remove
      the <code>sleep(30)</code> we added), dark mode for your terminal
      (it&apos;s already dark), and priority access to our 24/7 AI support bot
      (it&apos;s just a while loop that prints &quot;have you tried
      restarting?&quot;).
    </Body>
    <Link to={getPreferencesRoute(PreferencesTabRoutes.UISettings)}>
      <Button variant="primary">Manage Subscription</Button>
    </Link>
    <Subtitle>
      As a Premium subscriber, please enjoy these exclusive ads hand-crafted by
      our world-class design team:
    </Subtitle>
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
    <FinePrint>
      * Evergreen Premium is not real. Happy April Fools&apos; Day! No hamsters
      were harmed in the making of these ads.
    </FinePrint>
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

const FinePrint = styled(Body)`
  margin-top: ${size.l};
  font-size: 12px;
  font-style: italic;
  text-align: center;
`;
