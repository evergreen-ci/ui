import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Cookies from "js-cookie";
import { Outlet } from "react-router-dom";
import { FullPageLoad } from "@evg-ui/lib/components/FullPageLoad";
import { size } from "@evg-ui/lib/constants/tokens";
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
      </FloatingContent>
    </SiteLayout>
  );
};

const FloatingContent = styled.div`
  background-color: ${white};
  border-radius: ${size.s};
  bottom: 0;
  margin-bottom: ${size.s};
  margin-right: ${size.s};
  opacity: 0.2;
  padding: ${size.xs};
  position: fixed;
  right: 0;
  transition: opacity 0.2s ease-in-out;

  :hover {
    box-shadow: 0 3px 4px ${gray.base};
    opacity: 1;
    transition: all 0.2s ease-in-out;
  }
`;
