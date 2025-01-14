import styled from "@emotion/styled";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import {
  AdminBanner,
  ConnectivityBanner,
  SlackNotificationBanner,
  GithubUsernameBanner,
} from "components/Banners";
import { Navbar } from "./Navbar";

export const Header: React.FC = () => (
  <StyledHeader>
    <Navbar />
    <BannerContainer id="banner-container">
      <AdminBanner />
      <ConnectivityBanner />
      <GithubUsernameBanner />
      <SlackNotificationBanner />
    </BannerContainer>
  </StyledHeader>
);

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: ${zIndex.header};
`;

const BannerContainer = styled.div`
  > * {
    margin: 12px;
  }
`;
