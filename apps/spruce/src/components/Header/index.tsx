import styled from "@emotion/styled";
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
`;

const BannerContainer = styled.div`
  > * {
    margin: 12px;
  }
`;
