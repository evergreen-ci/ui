import { useQuery } from "@apollo/client/react";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { MetadataItem } from "components/MetadataCard";
import { getTaskRoute } from "constants/routes";
import {
  TaskCompletedByQuery,
  TaskCompletedByQueryVariables,
} from "gql/generated/types";
import { TASK_COMPLETED_BY } from "gql/queries";
import styles from "./index.module.css";

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

  const displayName = data?.task?.displayName ?? completedBy;

  return (
    <MetadataItem data-testid="task-metadata-completed-by" label="Completed by">
      <span className={styles.displayName} title={displayName}>
        <StyledRouterLink to={getTaskRoute(completedBy)}>
          {displayName}
        </StyledRouterLink>
      </span>
    </MetadataItem>
  );
};
