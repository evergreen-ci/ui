import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { slugs } from "constants/routes";
import { useToastContext } from "context/toast";
import { ProjectQuery, ProjectQueryVariables } from "gql/generated/types";
import { PROJECT } from "gql/queries";
import { validators } from "utils";

const { validateObjectId } = validators;

interface UseProjectRedirectProps {
  sendAnalyticsEvent: (projectId: string, projectIdentifier: string) => void;
  shouldRedirect?: boolean;
}

/**
 * useProjectRedirect will replace the project id with the project identifier in the URL.
 * @param props - Object containing the following:
 * @param props.sendAnalyticsEvent - analytics event to send upon redirect
 * @param props.shouldRedirect - boolean to indicate if a redirect should be attempted
 * @returns isRedirecting - boolean to indicate if a redirect is in progress
 */
export const useProjectRedirect = ({
  sendAnalyticsEvent = () => {},
  shouldRedirect,
}: UseProjectRedirectProps) => {
  const [attemptedRedirect, setAttemptedRedirect] = useState(false);
  const { [slugs.projectIdentifier]: project } = useParams();
  const dispatchToast = useToastContext();
  const navigate = useNavigate();
  const location = useLocation();

  const needsRedirect = validateObjectId(project) && shouldRedirect;

  const { loading } = useQuery<ProjectQuery, ProjectQueryVariables>(PROJECT, {
    skip: !needsRedirect,
    variables: {
      idOrIdentifier: project,
    },
    onCompleted: (projectData) => {
      const { identifier } = projectData.project;
      const currentUrl = location.pathname.concat(location.search);
      const redirectPathname = currentUrl.replace(project, identifier);
      sendAnalyticsEvent(project, identifier);
      navigate(redirectPathname, { replace: true });
      setAttemptedRedirect(true);
    },
    onError: (e) => {
      setAttemptedRedirect(true);
      dispatchToast.error(`There was an error redirecting: ${e.message}`);
    },
  });

  return { isRedirecting: needsRedirect && loading, attemptedRedirect };
};
