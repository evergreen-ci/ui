import { useQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { getUserPatchesRoute } from "constants/routes";
import { UserQuery } from "gql/generated/types";
import { USER } from "gql/queries";

export const MyPatches: React.FC = () => {
  usePageVisibilityAnalytics({ identifier: "MyPatches" });
  const { data } = useQuery<UserQuery>(USER);
  if (data) {
    return <Navigate replace to={getUserPatchesRoute(data.user.userId)} />;
  }
  return null;
};
