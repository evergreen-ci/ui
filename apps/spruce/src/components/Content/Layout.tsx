import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Outlet } from "react-router-dom";
import { FullPageLoad } from "@evg-ui/lib/components/FullPageLoad";
import { size, transitionDuration } from "@evg-ui/lib/constants/tokens";
import { useAuthProviderContext } from "@evg-ui/lib/context/AuthProvider";
import { useAnalyticsAttributes } from "analytics";
import { Feedback } from "components/Feedback";
import { Header } from "components/Header";
import { SiteLayout } from "components/styles/Layout";
import { TaskStatusIconLegend } from "components/TaskStatusIconLegend";
import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { USER } from "gql/queries";
import { useAnnouncementToast } from "hooks/useAnnouncementToast";
import { WaterfallScrollToTop } from "pages/waterfall/ScrollToTop";

const { gray, white } = palette;

export const Layout: React.FC = () => {
  const { isAuthenticated } = useAuthProviderContext();
  useAnnouncementToast();

  // this top-level query is required for authentication to work
  // afterware is used at apollo link level to authenticate or deauthenticate user based on response to query
  // therefore this could be any query as long as it is top-level
  const { data } = useQuery<UserQuery, UserQueryVariables>(USER);
  useAnalyticsAttributes(data?.user?.userId ?? "");
  localStorage.setItem("userId", data?.user?.userId ?? "");

  if (!isAuthenticated) {
    return <FullPageLoad />;
  }

  return (
    <SiteLayout>
      <Header />
      <Outlet />
      <FloatingContent>
        <WaterfallScrollToTop />
        <TaskStatusIconLegend />
        <Feedback />
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
