import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import { Outlet } from "react-router-dom";
import { FullPageLoad } from "@evg-ui/lib/components/FullPageLoad";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import { useAnalyticsAttributes } from "analytics";
import { Feedback } from "components/Feedback";
import { Header } from "components/Header";
import { SiteLayout } from "components/styles/Layout";
import { TaskStatusIconLegend } from "components/TaskStatusIconLegend";
import WelcomeModal from "components/WelcomeModal";
import { CY_DISABLE_NEW_USER_WELCOME_MODAL } from "constants/cookies";
import { newSpruceUser } from "constants/welcomeModalProps";
import { useAuthStateContext } from "context/Auth";
import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { USER } from "gql/queries";
import { useUserSettings } from "hooks";
import { useAnnouncementToast } from "hooks/useAnnouncementToast";
import { WaterfallScrollToTop } from "pages/waterfall/ScrollToTop";
import { isProduction } from "utils/environmentVariables";

const { gray, white } = palette;

const shouldDisableForTest =
  !isProduction() && Cookies.get(CY_DISABLE_NEW_USER_WELCOME_MODAL) === "true";

export const Layout: React.FC = () => {
  const { isAuthenticated } = useAuthStateContext();
  useAnnouncementToast();

  // this top-level query is required for authentication to work
  // afterware is used at apollo link level to authenticate or deauthenticate user based on response to query
  // therefore this could be any query as long as it is top-level
  const { data } = useQuery<UserQuery, UserQueryVariables>(USER);
  useAnalyticsAttributes(data?.user?.userId ?? "");
  localStorage.setItem("userId", data?.user?.userId ?? "");
  const { userSettings } = useUserSettings();
  const { useSpruceOptions } = userSettings ?? {};
  const { hasUsedSpruceBefore = true } = useSpruceOptions ?? {};

  if (!isAuthenticated) {
    return <FullPageLoad />;
  }

  return (
    <SiteLayout>
      <Header />
      <Outlet />
      {!shouldDisableForTest && !hasUsedSpruceBefore && (
        <WelcomeModal
          carouselCards={newSpruceUser}
          param="hasUsedSpruceBefore"
          title="Welcome to the New Evergreen UI!"
        />
      )}
      <FloatingContent>
        <TaskStatusIconLegend />
        <Feedback />
        <WaterfallScrollToTop />
      </FloatingContent>
    </SiteLayout>
  );
};

const FloatingContent = styled.div`
  display: flex;
  flex-direction: column;

  position: fixed;
  bottom: 0;
  right: 0;

  margin-bottom: ${size.s};
  margin-right: ${size.s};
  padding: ${size.xxs};

  background-color: ${gray.light3};
  border-radius: ${size.m};
  border: 1px solid transparent;
  opacity: 0.5;

  transition: all ${transitionDuration.default}ms ease-in-out;

  :hover {
    background-color: ${white};
    border: 1px solid ${gray.light1};
    opacity: 1;

    transition: all ${transitionDuration.default}ms ease-in-out;
  }
`;
