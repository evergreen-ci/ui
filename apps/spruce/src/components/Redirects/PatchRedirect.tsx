import { useParams, Navigate } from "react-router-dom";
import { getPatchRoute, slugs } from "constants/routes";

export const PatchRedirect: React.FC = () => {
  const { [slugs.versionId]: versionId } = useParams();
  return (
    <Navigate
      replace
      to={getPatchRoute(versionId ?? "", { configure: true })}
    />
  );
};
