import { useQuery } from "@apollo/client/react";
import { Outlet } from "react-router-dom";
import { FullPageLoad } from "@evg-ui/lib/components/FullPageLoad";
import { useAuthProviderContext } from "@evg-ui/lib/context/AuthProvider";
import { useAnalyticsAttributes } from "analytics";
import { Feedback } from "components/Feedback";
import { Header } from "components/Header";
import { SiteLayout } from "components/styles/Layout";
import { TaskStatusIconLegend } from "components/TaskStatusIconLegend";
import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { USER } from "gql/queries";
import { WaterfallScrollToTop } from "pages/waterfall/ScrollToTop";
import styles from "./Layout.module.css";

export const Layout: React.FC = () => {
  const { isAuthenticated } = useAuthProviderContext();

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
      <div className={styles.floatingContent}>
        <WaterfallScrollToTop />
        <TaskStatusIconLegend />
        <Feedback />
      </div>
    </SiteLayout>
  );
};
