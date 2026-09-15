import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { Badge, BadgeVariant } from "@via-ds/components/badge";
import { H2 } from "@via-ds/components/typography";
import pluralize from "pluralize";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useErrorToast } from "@evg-ui/lib/hooks";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
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
import styles from "./index.module.css";
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
      <div className={styles.searchableDropdownWrapper}>
        <SearchableDropdown<TaskQueueDistro>
          buttonRenderer={(option: TaskQueueDistro | TaskQueueDistro[]) => {
            const distro = Array.isArray(option) ? option[0] : option;
            return (
              <div className={styles.distroLabel}>
                {isDropdownLoading ? (
                  <Badge variant={BadgeVariant.Status}>Loading...</Badge>
                ) : (
                  <>
                    <Badge variant={BadgeVariant.Status}>
                      {pluralize("task", distro?.taskCount ?? 0, true)}
                    </Badge>
                    <Badge variant={BadgeVariant.Status}>
                      {pluralize("host", distro?.hostCount ?? 0, true)}
                    </Badge>
                  </>
                )}
                <div className={styles.distroName}>
                  {" "}
                  {distro?.id ?? distroId}{" "}
                </div>
              </div>
            );
          }}
          data-testid="distro-dropdown"
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
          searchPlaceholder="Search distros"
          value={
            selectedDistro ?? { id: distroId ?? "", hostCount: 0, taskCount: 0 }
          }
          valuePlaceholder="Select a distro"
        />
      </div>
      {distroId && <TaskQueueContent distroId={distroId} />}
    </PageWrapper>
  );
};

export default TaskQueue;
