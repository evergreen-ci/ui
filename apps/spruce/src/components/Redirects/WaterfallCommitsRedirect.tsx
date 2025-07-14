import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { useWaterfallAnalytics } from "analytics";
import { getWaterfallRoute, slugs } from "constants/routes";

export const WaterfallCommitsRedirect: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  const [statusFilters] = useQueryParam<string[]>("statuses", []);
  const [taskFilters] = useQueryParam<string[]>("taskNames", []);
  const [requesterFilters] = useQueryParam<string[]>("requester", []);
  const [variantFilters] = useQueryParam<string[]>("buildVariants", []);
  const { sendEvent } = useWaterfallAnalytics();
  useEffect(() => {
    const { referrer } = document;
    sendEvent({
      name: "Redirected to waterfall page",
      referrer,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Navigate
      to={getWaterfallRoute(projectIdentifier, {
        statusFilters,
        taskFilters,
        requesterFilters,
        variantFilters,
      })}
    />
  );
};
