import { skipToken, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { slugs } from "constants/routes";
import { ProjectQuery, ProjectQueryVariables } from "gql/generated/types";
import { PROJECT } from "gql/queries";
import { validators } from "utils";

const { validateObjectId } = validators;

/**
 * `useProjectRedirect` will replace the project ID with the project identifier in the URL.
 * @returns
 * - redirectIdentifier: the project identifier to redirect to
 * - needsRedirect: boolean indicating whether a redirect is needed
 * - loading: boolean indicating whether the query is still loading
 * - error: any error that occurred during the query
 */
export const useProjectRedirect = () => {
  const { [slugs.projectIdentifier]: projectIdentifier = "" } = useParams();
  const needsRedirect = validateObjectId(projectIdentifier);

  const { data, error, loading } = useQuery<
    ProjectQuery,
    ProjectQueryVariables
  >(
    PROJECT,
    needsRedirect
      ? {
          variables: {
            idOrIdentifier: projectIdentifier,
          },
        }
      : skipToken,
  );

  const redirectIdentifier = data?.project?.identifier;

  useErrorToast(
    error,
    `Failed to redirect to project identifier for project '${projectIdentifier}'`,
  );

  return {
    redirectIdentifier,
    needsRedirect,
    loading,
    error,
  };
};
