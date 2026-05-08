import { Navigate, useParams, useLocation, Params } from "react-router-dom";
import { useProjectRedirect } from "hooks/useProjectRedirect";

interface ProjectRedirectProps {
  children: React.ReactNode;
  getRedirectRoute: (
    identifier: string,
    params: Readonly<Params<string>>,
  ) => string;
}

export const ProjectRedirect: React.FC<ProjectRedirectProps> = ({
  children,
  getRedirectRoute,
}) => {
  const params = useParams();
  const location = useLocation();
  const { loading, needsRedirect, redirectIdentifier } = useProjectRedirect();

  if (loading) {
    return null;
  }

  if (needsRedirect && redirectIdentifier) {
    const redirectPath = getRedirectRoute(redirectIdentifier, params);
    return <Navigate replace to={`${redirectPath}${location.search}`} />;
  }

  return children;
};
