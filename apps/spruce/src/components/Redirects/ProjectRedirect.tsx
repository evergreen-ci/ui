import { Navigate, useParams, Params } from "react-router-dom";
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
  const { loading, needsRedirect, redirectIdentifier } = useProjectRedirect();

  if (loading) {
    return null;
  }

  if (needsRedirect && redirectIdentifier) {
    return (
      <Navigate replace to={getRedirectRoute(redirectIdentifier, params)} />
    );
  }

  return children;
};
