import { useQuery } from "@apollo/client/react";
import { ColumnFiltersState } from "@leafygreen-ui/table";
import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { slugs } from "constants/routes";
import { TaskQuery, TaskQueryVariables } from "gql/generated/types";
import { TASK } from "gql/queries";
import { RequiredQueryParams } from "types/task";

type Action =
  | {
      name: "Clicked test log link";
      "test.name": string;
    }
  | {
      name: "Filtered to test failure";
      "test.name": string;
    }
  | {
      name: "Clicked schedule task button";
      "task.id": string;
    }
  | {
      name: "Clicked restart task button";
      "task.id": string;
    }
  | {
      name: "Clicked task link";
      "task.id": string;
    }
  | {
      name: "Filtered table";
      "table.filters": ColumnFiltersState;
    }
  | {
      name: "Toggled commit description";
      expanded: boolean;
    }
  | {
      name: "Toggled inactive tasks view";
      expanded: boolean;
    }
  | { name: "Toggled failed tests table"; open: boolean }
  | {
      name: "Clicked task box";
      "task.id": string;
    }
  | {
      name: "Used test failure search";
      "test.name": string;
    }
  | {
      name: "Clicked jump to this task button";
    }
  | { name: "Filtered by date"; date: string }
  | {
      name: "Clicked to dismiss walkthrough before completion";
    }
  | {
      name: "Clicked next page button";
    }
  | {
      name: "Clicked previous page button";
    };

export const useTaskHistoryAnalytics = () => {
  const { [slugs.taskId]: taskId = "" } = useParams();
  const [execution] = useQueryParam(RequiredQueryParams.Execution, 0);

  const { data: eventData } = useQuery<TaskQuery, TaskQueryVariables>(TASK, {
    skip: !taskId,
    variables: { taskId, execution },
    errorPolicy: "all",
    fetchPolicy: "cache-first",
  });

  const { buildVariant, displayName, project } = eventData?.task || {};
  const { identifier } = project || {};

  return useAnalyticsRoot<Action, AnalyticsIdentifier>("TaskHistory", {
    "task.execution": execution,
    "task.id": taskId || "",
    "task.name": displayName || "",
    "task.variant": buildVariant || "",
    "task.project.identifier": identifier || "",
  });
};
