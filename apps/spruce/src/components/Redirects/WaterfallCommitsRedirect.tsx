import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useWaterfallAnalytics } from "analytics";
import { getWaterfallRoute, slugs } from "constants/routes";
import { useQueryParam } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "pages/waterfall/types";

export const WaterfallCommitsRedirect: React.FC = () => {
  const { [slugs.projectIdentifier]: projectIdentifier } = useParams();
  const [statusFilters] = useQueryParam<string[]>(
    WaterfallFilterOptions.Statuses,
    [],
  );
  const [taskFilters] = useQueryParam<string[]>(
    WaterfallFilterOptions.Task,
    [],
  );
  const [requesterFilters] = useQueryParam<string[]>(
    WaterfallFilterOptions.Requesters,
    [],
  );
  const [variantFilters] = useQueryParam<string[]>(
    WaterfallFilterOptions.BuildVariant,
    [],
  );
  const { sendEvent } = useWaterfallAnalytics();
  useEffect(() => {
    const { referrer } = document;
    sendEvent({
      name: "System Event redirect",
      referrer,
    });
    console.log("System Event redirect", referrer);
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
