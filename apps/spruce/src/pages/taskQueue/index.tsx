import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { H2, H3 } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { useParams, useNavigate } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useQueryParam } from "@evg-ui/lib/hooks";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import { useTaskQueueAnalytics } from "analytics";
import SearchableDropdown from "components/SearchableDropdown";
import { PageWrapper } from "components/styles";
import { MCI_USER } from "constants/hosts";
import { getTaskQueueRoute, getAllHostsRoute, slugs } from "constants/routes";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueDistro,
  TaskQueueDistrosQuery,
  TaskQueueDistrosQueryVariables,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE, TASK_QUEUE_DISTROS } from "gql/queries";
import { QueryParams } from "types/task";
import { DistroOption } from "./DistroOption";
import TaskQueueTable from "./TaskQueueTable";

const TaskQueue = () => {
  const taskQueueAnalytics = useTaskQueueAnalytics();

  const { [slugs.distroId]: distroId } = useParams();
  usePageVisibilityAnalytics({
    attributes: { distroId: distroId ?? "" },
  });
  const [taskId] = useQueryParam<string | undefined>(
    QueryParams.TaskId,
    undefined,
  );
  const navigate = useNavigate();
  const [selectedDistro, setSelectedDistro] = useState<
    TaskQueueDistro | undefined
  >(undefined);
  const dispatchToast = useToastContext();
  usePageTitle(`Task Queue - ${distroId}`);
  const { data: distrosData, loading: loadingDistrosData } = useQuery<
    TaskQueueDistrosQuery,
    TaskQueueDistrosQueryVariables
  >(TASK_QUEUE_DISTROS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const { taskQueueDistros } = data;
      const firstDistroInList = taskQueueDistros[0]?.id;
      const defaultDistro = distroId ?? firstDistroInList;
      setSelectedDistro(taskQueueDistros.find((d) => d.id === defaultDistro));
      if (distroId === undefined) {
        navigate(getTaskQueueRoute(defaultDistro));
      }
    },
    onError: (err) => {
      dispatchToast.error(`There was an error loading distros: ${err.message}`);
    },
  });

  const { data: taskQueueItemsData, loading: loadingTaskQueueItems } = useQuery<
    DistroTaskQueueQuery,
    DistroTaskQueueQueryVariables
  >(DISTRO_TASK_QUEUE, {
    fetchPolicy: "cache-and-network",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { distroId },
    skip: !distroId,
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading task queue: ${err.message}`,
      );
    },
  });

  const onChangeDistroSelection = (val: TaskQueueDistro) => {
    taskQueueAnalytics.sendEvent({ name: "Changed distro", distro: val.id });
    navigate(getTaskQueueRoute(val.id));
    setSelectedDistro(val);
  };

  const handleSearch = (options: TaskQueueDistro[], match: string) =>
    options.filter((d) => d.id.toLowerCase().includes(match.toLowerCase()));

  return (
    <PageWrapper>
      <H2>Task Queue</H2>
      <SearchableDropdownWrapper>
        <SearchableDropdown
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          buttonRenderer={(option: TaskQueueDistro) => (
            <DistroLabel>
              {loadingDistrosData || !selectedDistro ? (
                <Badge>Loading...</Badge>
              ) : (
                <>
                  <Badge>
                    {pluralize("task", option?.taskCount ?? 0, true)}
                  </Badge>
                  <Badge>
                    {pluralize("host", option?.hostCount ?? 0, true)}
                  </Badge>
                </>
              )}
              <DistroName> {option?.id} </DistroName>
            </DistroLabel>
          )}
          data-cy="distro-dropdown"
          disabled={selectedDistro === undefined}
          label="Distro"
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          onChange={onChangeDistroSelection}
          optionRenderer={(option, onClick) => (
            <DistroOption
              key={`distro-select-search-option-${option.id}`}
              onClick={onClick}
              option={option}
            />
          )}
          options={distrosData?.taskQueueDistros}
          searchFunc={handleSearch}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          value={selectedDistro}
          valuePlaceholder="Select a distro"
        />
      </SearchableDropdownWrapper>
      {
        /* Only show name & link if distro exists. */
        !loadingDistrosData && (
          <TableHeader>
            <H3>{distroId}</H3>
            <StyledRouterLink
              to={getAllHostsRoute({ distroId, startedBy: MCI_USER })}
            >
              View hosts
            </StyledRouterLink>
          </TableHeader>
        )
      }
      {!loadingTaskQueueItems && (
        <TaskQueueTable
          taskId={taskId}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          taskQueue={taskQueueItemsData?.distroTaskQueue}
        />
      )}
    </PageWrapper>
  );
};

const SearchableDropdownWrapper = styled.div`
  margin-top: ${size.xs};
  width: 400px;
`;
const DistroLabel = styled.div`
  display: flex;
  gap: ${size.xs};
  align-items: center;
  white-space: nowrap;
`;
const DistroName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;
const TableHeader = styled.div`
  display: flex;
  align-items: center;
  margin: ${size.m} 0 ${size.s} 0;
  gap: ${size.s};
`;
export default TaskQueue;
