import { useQuery } from "@apollo/client/react";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { MetadataItem } from "components/MetadataCard";
import { getTaskRoute } from "constants/routes";
import {
  TaskCompletedByQuery,
  TaskCompletedByQueryVariables,
} from "gql/generated/types";
import { TASK_COMPLETED_BY } from "gql/queries";

interface CompletedByProps {
  completedBy: string;
}

export const CompletedBy: React.FC<CompletedByProps> = ({ completedBy }) => {
  const { data } = useQuery<
    TaskCompletedByQuery,
    TaskCompletedByQueryVariables
  >(TASK_COMPLETED_BY, {
    variables: { taskId: completedBy },
  });

  return (
    <MetadataItem data-testid="task-metadata-completed-by" label="Completed by">
      <StyledRouterLink to={getTaskRoute(completedBy)}>
        {data?.task?.displayName ?? completedBy}
      </StyledRouterLink>
    </MetadataItem>
  );
};
