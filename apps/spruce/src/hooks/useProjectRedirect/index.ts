import { skipToken, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { useErrorToast, useQueryCompleted } from "@evg-ui/lib/hooks";
import { slugs } from "constants/routes";
import { ProjectQuery, ProjectQueryVariables } from "gql/generated/types";
import { PROJECT } from "gql/queries";
import { validators } from "utils";

const { validateObjectId } = validators;

interface UseProjectRedirectProps {
  onRedirect?: (projectId: string, projectIdentifier: string) => void;
}

/**
 * useProjectRedirect will replace the project id with the project identifier in the URL.
 * @param props - Object containing the following:
 * @param props.onRedirect - callback to call when a redirect is about to occur
 * @returns
 * - redirectIdentifier: the project identifier to redirect to
 * - needsRedirect: boolean indicating whether a redirect is needed
 * - loading: boolean indicating whether the query is still loading
 * - error: any error that occurred during the query
 */
export const useProjectRedirect = ({
  onRedirect,
}: UseProjectRedirectProps = {}) => {
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

  const onRedirectCallback = () => {
    if (onRedirect && redirectIdentifier) {
      onRedirect(projectIdentifier, redirectIdentifier);
    }
  };

  useErrorToast(
    error,
    `Failed to redirect to project identifier for project '${projectIdentifier}'`,
  );
  useQueryCompleted(loading, onRedirectCallback);

  return {
    redirectIdentifier,
    needsRedirect,
    loading,
    error,
  };
};
