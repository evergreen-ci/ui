import { useParams, Navigate } from "react-router-dom";
import { getWaterfallRoute, slugs } from "constants/routes";

export const WaterfallCommitsRedirect: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();

  return <Navigate to={getWaterfallRoute(projectIdentifier)} />;
};
