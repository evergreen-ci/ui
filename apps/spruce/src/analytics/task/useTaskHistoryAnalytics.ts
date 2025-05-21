import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { slugs } from "constants/routes";
import { useQueryParam } from "hooks/useQueryParam";
import { RequiredQueryParams } from "types/task";

// TODO: Flesh out with more events in DEVPROD-17669.
type Action = {
  name: "Clicked test log link";
  "test.name": string;
};

export const useTaskHistoryAnalytics = () => {
  const { [slugs.taskId]: taskId } = useParams();
  const [execution] = useQueryParam(RequiredQueryParams.Execution, 0);

  return useAnalyticsRoot<Action, AnalyticsIdentifier>("TaskHistory", {
    "task.execution": execution,
    "task.id": taskId || "",
  });
};
