import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { H3 } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useQueryParam, useErrorToast } from "@evg-ui/lib/hooks";
import { getLocalStorageBoolean } from "@evg-ui/lib/utils/localStorage";
import { getRandomAprilFoolsBanner } from "components/AprilFools";
import { APRIL_FOOLS } from "constants/cookies";
import { MCI_USER } from "constants/hosts";
import { getAllHostsRoute } from "constants/routes";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE } from "gql/queries";
import { QueryParams } from "types/task";
import TaskQueueTable from "./TaskQueueTable";

type TaskQueueContentProps = {
  distroId: string;
};

const TaskQueueContent: React.FC<TaskQueueContentProps> = ({ distroId }) => {
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

  const aprilFoolsEnabled = getLocalStorageBoolean(APRIL_FOOLS, true);
  const randomBanner = useMemo(() => getRandomAprilFoolsBanner(), []);
  const randomBanner2 = useMemo(() => getRandomAprilFoolsBanner(), []);
  const BannerWrapper = styled.div`
    margin: ${size.m} 0;
    display: flex;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100px;
    }
  `;

  return (
    <>
      {aprilFoolsEnabled && (
        <BannerWrapper>
          <img alt="Random Evergreen April Fools Ad" src={randomBanner} />
        </BannerWrapper>
      )}
      <TableHeader>
        <H3>{distroId}</H3>
        <StyledRouterLink
          to={getAllHostsRoute({ distroId, startedBy: MCI_USER })}
        >
          View hosts
        </StyledRouterLink>
      </TableHeader>
      {loadingTaskQueueItems ? (
        <TableSkeleton numCols={8} numRows={10} />
      ) : (
        <TaskQueueTable
          taskId={taskId}
          taskQueue={taskQueueItemsData?.distroTaskQueue ?? []}
        />
      )}
      {aprilFoolsEnabled && (
        <BannerWrapper>
          <img alt="Random Evergreen April Fools Ad" src={randomBanner2} />
        </BannerWrapper>
      )}
    </>
  );
};

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  margin: ${size.m} 0 ${size.s} 0;
  gap: ${size.s};
`;

export default TaskQueueContent;
