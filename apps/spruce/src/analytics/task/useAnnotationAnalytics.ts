import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { slugs } from "constants/routes";
import {
  BuildBaronQuery,
  BuildBaronQueryVariables,
  AnnotationEventDataQuery,
  AnnotationEventDataQueryVariables,
} from "gql/generated/types";
import { ANNOTATION_EVENT_DATA, BUILD_BARON } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { RequiredQueryParams } from "types/task";

type Action =
  | { name: "Clicked Jira ticket summary link" }
  | { name: "Created build baron ticket" }
  | { name: "Saved annotation note button" }
  | {
      name: "Clicked move annotation button";
      type: "Issue" | "Suspected Issue";
    }
  | {
      name: "Clicked annotation link";
      target: "Jira ticket link";
    }
  | { name: "Deleted annotation"; type: "Issue" | "Suspected Issue" }
  | { name: "Created task annotation"; type: "Issue" | "Suspected Issue" };

export const useAnnotationAnalytics = () => {
  const { [slugs.taskId]: taskId } = useParams();
  const [execution] = useQueryParam(RequiredQueryParams.Execution, 0);

  const { data: eventData } = useQuery<
    AnnotationEventDataQuery,
    AnnotationEventDataQueryVariables
  >(ANNOTATION_EVENT_DATA, {
    variables: { taskId: taskId || "", execution },
    fetchPolicy: "cache-first",
  });

  const { data: bbData } = useQuery<BuildBaronQuery, BuildBaronQueryVariables>(
    BUILD_BARON,
    {
      variables: { taskId: taskId || "", execution },
      fetchPolicy: "cache-first",
    },
  );

  const { annotation } = eventData?.task || {};
  const { buildBaronConfigured } = bbData?.buildBaron || {};

  return useAnalyticsRoot<Action>("Annotations", {
    taskId,
    annotation,
    bbConfigured: buildBaronConfigured,
  });
};
