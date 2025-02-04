import { useParams, Navigate } from "react-router-dom";
import { getCommitsRoute, getWaterfallRoute, slugs } from "constants/routes";
import { useMergedBetaFeatures } from "hooks";

export const WaterfallCommitsRedirect: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();

  const { betaFeatures } = useMergedBetaFeatures();
  const { spruceWaterfallEnabled } = betaFeatures ?? {};

  return (
    <Navigate
      to={
        spruceWaterfallEnabled
          ? getWaterfallRoute(projectIdentifier)
          : getCommitsRoute(projectIdentifier)
      }
    />
  );
};
