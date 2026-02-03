import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Badge } from "@leafygreen-ui/badge";
import { H2 } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { size } from "@evg-ui/lib/constants";
import { useErrorToast, usePageTitle } from "@evg-ui/lib/hooks";
import { useTaskQueueAnalytics } from "analytics";
import SearchableDropdown from "components/SearchableDropdown";
import { PageWrapper } from "components/styles";
import { getTaskQueueRoute, slugs } from "constants/routes";
import {
  TaskQueueDistro,
  TaskQueueDistrosQuery,
  TaskQueueDistrosQueryVariables,
} from "gql/generated/types";
import { TASK_QUEUE_DISTROS } from "gql/queries";
import { DistroOption } from "./DistroOption";
import TaskQueueContent from "./TaskQueueContent";

const TaskQueue = () => {
  const { [slugs.distroId]: distroId } = useParams();
  const navigate = useNavigate();
  const taskQueueAnalytics = useTaskQueueAnalytics();
  usePageTitle(`Task Queue${distroId ? ` - ${distroId}` : ""}`);

  const {
    data: distrosData,
    error: distrosError,
    loading: loadingDistrosData,
  } = useQuery<TaskQueueDistrosQuery, TaskQueueDistrosQueryVariables>(
    TASK_QUEUE_DISTROS,
    {
      fetchPolicy: "cache-and-network",
    },
  );
  useErrorToast(distrosError, "There was an error loading distros");

  const selectedDistro = useMemo(() => {
    if (!distrosData?.taskQueueDistros || !distroId) return undefined;
    return distrosData.taskQueueDistros.find((d) => d.id === distroId);
  }, [distrosData, distroId]);

  // If no distroId in URL, wait for data then redirect to the first distro
  if (!distroId) {
    if (!loadingDistrosData && distrosData?.taskQueueDistros) {
      const firstDistroId = distrosData.taskQueueDistros[0]?.id;
      if (firstDistroId) {
        return <Navigate replace to={getTaskQueueRoute(firstDistroId)} />;
      }
    }
  }

  const onChangeDistroSelection = (
    val: TaskQueueDistro | TaskQueueDistro[],
  ) => {
    const distro = Array.isArray(val) ? val[0] : val;
    taskQueueAnalytics.sendEvent({ name: "Changed distro", distro: distro.id });
    navigate(getTaskQueueRoute(distro.id));
  };

  const handleSearch = (options: TaskQueueDistro[], match: string) =>
    options.filter((d) => d.id.toLowerCase().includes(match.toLowerCase()));

  const isDropdownLoading = loadingDistrosData || !selectedDistro;

  return (
    <PageWrapper>
      <H2>Task Queue</H2>
      <SearchableDropdownWrapper>
        <SearchableDropdown<TaskQueueDistro>
          buttonRenderer={(option: TaskQueueDistro | TaskQueueDistro[]) => {
            const distro = Array.isArray(option) ? option[0] : option;
            return (
              <DistroLabel>
                {isDropdownLoading ? (
                  <Badge>Loading...</Badge>
                ) : (
                  <>
                    <Badge>
                      {pluralize("task", distro?.taskCount ?? 0, true)}
                    </Badge>
                    <Badge>
                      {pluralize("host", distro?.hostCount ?? 0, true)}
                    </Badge>
                  </>
                )}
                <DistroName> {distro?.id ?? distroId} </DistroName>
              </DistroLabel>
            );
          }}
          data-cy="distro-dropdown"
          disabled={isDropdownLoading}
          label="Distro"
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
          value={
            selectedDistro ?? { id: distroId ?? "", hostCount: 0, taskCount: 0 }
          }
          valuePlaceholder="Select a distro"
        />
      </SearchableDropdownWrapper>
      {distroId && <TaskQueueContent distroId={distroId} />}
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

export default TaskQueue;
