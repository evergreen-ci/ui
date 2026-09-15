import { useQuery } from "@apollo/client/react";
import { H3 } from "@via-ds/components/typography";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useErrorToast, useQueryParam } from "@evg-ui/lib/hooks";
import { useNavbarAnalytics } from "analytics";
import { MCI_USER } from "constants/hosts";
import { getAllHostsRoute, getDistroSettingsRoute } from "constants/routes";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import { QueryParams } from "types/task";
import styles from "./TaskQueueContent.module.css";
import TaskQueueTable from "./TaskQueueTable";

type TaskQueueContentProps = {
  distroId: string;
};

const TaskQueueContent: React.FC<TaskQueueContentProps> = ({ distroId }) => {
  const { sendEvent: sendNavbarEvent } = useNavbarAnalytics();
  const [taskId] = useQueryParam<string | undefined>(
    QueryParams.TaskId,
    undefined,
  );

  const {
    data: taskQueueItemsData,
    error: taskQueueError,
    loading: loadingTaskQueueItems,
  } = useQuery<DistroTaskQueueQuery, DistroTaskQueueQueryVariables>(
    DISTRO_TASK_QUEUE,
    {
      fetchPolicy: "cache-and-network",
      variables: { distroId },
    },
  );
  useErrorToast(taskQueueError, "There was an error loading task queue");

  return (
    <>
      <div className={styles.tableHeader}>
        <H3>{distroId}</H3>
        <StyledRouterLink
          onClick={() => sendNavbarEvent({ name: "Clicked all hosts link" })}
          to={getAllHostsRoute({ distroId, startedBy: MCI_USER })}
        >
          View hosts
        </StyledRouterLink>
        <StyledRouterLink
          data-testid="distro-settings-link"
          onClick={() =>
            sendNavbarEvent({ name: "Clicked distro settings link" })
          }
          to={getDistroSettingsRoute(distroId)}
        >
          Distro settings
        </StyledRouterLink>
      </div>
      <TaskQueueTable
        loading={loadingTaskQueueItems}
        taskId={taskId}
        taskQueue={taskQueueItemsData?.distroTaskQueue ?? []}
      />
    </>
  );
};

export default TaskQueueContent;
