import { useEffect, useRef, useState } from "react";
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
  onError?: (repoId: string) => void;
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
  const { [slugs.projectIdentifier]: projectIdentifier = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const needsRedirect = validateObjectId(projectIdentifier) && shouldRedirect;

  const [attemptedRedirect, setAttemptedRedirect] = useState(false);
  const hasRedirected = useRef(false);

  const { data, error, loading } = useQuery<
    ProjectQuery,
    ProjectQueryVariables
  >(PROJECT, {
    skip: !needsRedirect,
    variables: {
      idOrIdentifier: projectIdentifier,
    },
  });

  // Reset redirect flag when project changes
  useEffect(() => {
    hasRedirected.current = false;
    setAttemptedRedirect(false);
  }, [projectIdentifier]);

  // Handle successful redirect
  useEffect(() => {
    if (data?.project && !hasRedirected.current) {
      hasRedirected.current = true;
      const { identifier } = data.project;
      const currentUrl = location.pathname.concat(location.search);
      const redirectPathname = currentUrl.replace(
        projectIdentifier,
        identifier,
      );
      sendAnalyticsEvent(projectIdentifier, identifier);
      navigate(redirectPathname, { replace: true });
      setAttemptedRedirect(true);
    }
  }, [data, location, navigate, projectIdentifier, sendAnalyticsEvent]);

  // Handle error
  useEffect(() => {
    if (error && !hasRedirected.current) {
      hasRedirected.current = true;
      setAttemptedRedirect(true);
      onError?.(projectIdentifier ?? "");
    }
  }, [error, onError, projectIdentifier]);

  return {
    isRedirecting: needsRedirect && loading,
    attemptedRedirect,
  };
};
