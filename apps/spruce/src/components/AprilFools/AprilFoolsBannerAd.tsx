import { useMemo } from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { routes } from "constants/routes";
import { useAprilFoolsEnabled } from "hooks/useAprilFoolsEnabled";
import { getRandomAprilFoolsBanner } from ".";

export const AprilFoolsBannerAd: React.FC = () => {
  const { enabled } = useAprilFoolsEnabled();
  const banner = useMemo(() => getRandomAprilFoolsBanner(), []);

  if (!enabled) return null;

  return (
    <BannerWrapper>
      <Link to={routes.aprilFools}>
        <img alt="Random Evergreen April Fools Ad" src={banner} />
      </Link>
    </BannerWrapper>
  );
};

const BannerWrapper = styled.div`
  margin: ${size.m} 0;
  display: flex;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100px;
  }
`;
