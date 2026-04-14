import { useParams, Navigate } from "react-router";
import { getUserPatchesRoute, slugs } from "constants/routes";

export const UserPatchesRedirect: React.FC = () => {
  const { [slugs.userId]: userId } = useParams();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  return <Navigate replace to={getUserPatchesRoute(userId)} />;
};
