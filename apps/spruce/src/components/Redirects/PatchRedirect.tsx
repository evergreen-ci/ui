import { useQuery } from "@apollo/client/react";
import { useParams, Navigate } from "react-router-dom";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import { getPatchRoute, getVersionRoute, slugs } from "constants/routes";
import { HasVersionQuery, HasVersionQueryVariables } from "gql/generated/types";
import { HAS_VERSION } from "gql/queries";

export const PatchRedirect: React.FC = () => {
  const { [slugs.versionId]: versionId } = useParams();

  const { data, loading } = useQuery<HasVersionQuery, HasVersionQueryVariables>(
    HAS_VERSION,
    {
      skip: !versionId,
      variables: { id: versionId ?? "" },
    },
  );

  if (loading) {
    return <PatchAndTaskFullPageLoad />;
  }

  return data?.hasVersion ? (
    <Navigate replace to={getVersionRoute(versionId ?? "")} />
  ) : (
    <Navigate
      replace
      to={getPatchRoute(versionId ?? "", { configure: true })}
    />
  );
};
