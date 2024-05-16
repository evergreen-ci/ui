import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { slugs } from "constants/routes";
import { ProjectQuery, ProjectQueryVariables } from "gql/generated/types";
import { PROJECT } from "gql/queries";
import { validators } from "utils";

const { validateObjectId } = validators;

interface UseProjectRedirectProps {
  sendAnalyticsEvent: (projectId: string, projectIdentifier: string) => void;
  shouldRedirect?: boolean;
  onError?: (e: Error) => void;
}

/**
 * useProjectRedirect will replace the project id with the project identifier in the URL.
 * @param props - Object containing the following:
 * @param props.sendAnalyticsEvent - analytics event to send upon redirect
 * @param props.shouldRedirect - boolean to indicate if a redirect should be attempted
 * @param props.onError - function to call if an error occurs during the redirect
 * @returns isRedirecting - boolean to indicate if a redirect is in progress
 */
export const useProjectRedirect = ({
  onError,
  sendAnalyticsEvent = () => {},
  shouldRedirect,
}: UseProjectRedirectProps) => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // @ts-ignore: FIXME. This comment was added by an automated script.
  const needsRedirect = validateObjectId(projectIdentifier) && shouldRedirect;

  const [attemptedRedirect, setAttemptedRedirect] = useState(false);

  const { loading } = useQuery<ProjectQuery, ProjectQueryVariables>(PROJECT, {
    skip: !needsRedirect,
    variables: {
      // @ts-ignore: FIXME. This comment was added by an automated script.
      idOrIdentifier: projectIdentifier,
    },
    onCompleted: (projectData) => {
      const { identifier } = projectData.project;
      const currentUrl = location.pathname.concat(location.search);
      const redirectPathname = currentUrl.replace(
        // @ts-ignore: FIXME. This comment was added by an automated script.
        projectIdentifier,
        identifier,
      );
      // @ts-ignore: FIXME. This comment was added by an automated script.
      sendAnalyticsEvent(projectIdentifier, identifier);
      navigate(redirectPathname, { replace: true });
      setAttemptedRedirect(true);
    },
    onError: (e) => {
      setAttemptedRedirect(true);
      onError?.(
        Error(
          `There was an error loading the project ${projectIdentifier}: ${e.message}`,
        ),
      );
    },
  });

  return {
    isRedirecting: needsRedirect && loading,
    attemptedRedirect,
  };
};
