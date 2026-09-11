import { useQuery } from "@apollo/client/react";
import { Badge, BadgeVariant } from "@via-ds/components/badge";
import { LinkButton } from "@via-ds/components/button";
import { InfoSprinkle } from "@via-ds/components/info-sprinkle";
import { Skeleton } from "@via-ds/components/skeleton";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { getTaskRoute } from "constants/routes";
import {
  StepbackTasksQuery,
  StepbackTasksQueryVariables,
} from "gql/generated/types";
import { STEPBACK_TASKS } from "gql/queries";
import styles from "./index.module.css";

interface StepbackStatusProps {
  finished: boolean;
  isLoading: boolean;
}

const StepbackStatus: React.FC<StepbackStatusProps> = ({
  finished,
  isLoading,
}) => {
  if (isLoading) {
    return <Skeleton isLoading><span /></Skeleton>;
  }
  if (!finished) {
    return <Badge variant={BadgeVariant.Info}>In progress</Badge>;
  }
  return <Badge variant={BadgeVariant.Success}>Complete</Badge>;
};

interface StepbackProps {
  execution: number;
  isPopup?: boolean;
  status: string;
  taskId: string;
}

export const Stepback: React.FC<StepbackProps> = ({
  execution,
  isPopup = false,
  status,
  taskId,
}) => {
  const { data, loading } = useQuery<
    StepbackTasksQuery,
    StepbackTasksQueryVariables
  >(STEPBACK_TASKS, {
    variables: {
      taskId,
      execution,
      isPassing: status === TaskStatus.Succeeded,
    },
  });

  const breakingTask = data?.task?.prevTaskPassing?.nextTaskFailing;
  const currentTaskIsBreaking = breakingTask?.id === taskId;

  // Stepback is finished if there is a breaking task.
  const finished = !!breakingTask;

  return (
    <div className={styles.stepbackLabel}>
      <b className={styles.boldLabel}>Stepback: </b>
      <StepbackStatus finished={finished} isLoading={loading} />
      {!isPopup && (
        <InfoSprinkle>
          When Stepback is completed you can access the breaking commit via the
          Stepback dropdown.
        </InfoSprinkle>
      )}
      {isPopup &&
        (currentTaskIsBreaking ? (
          <em>Current task is breaking</em>
        ) : (
          <LinkButton
            className={styles.breakingTaskButton}
            data-testid="breaking-task-button"
            isDisabled={
              loading || !finished || !breakingTask || currentTaskIsBreaking
            }
            size="small"
            href={
              breakingTask
                ? getTaskRoute(breakingTask.id, {
                    execution: breakingTask.execution,
                  })
                : ""
            }
          >
            Go to breaking task
          </LinkButton>
        ))}
    </div>
  );
};
