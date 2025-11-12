import { useState } from "react";
import styled from "@emotion/styled";
import { Divider } from "components/styles/divider";
import { TaskStatusFilters } from "components/TaskStatusFilters";
import { BuildVariantsWithChildrenQuery } from "gql/generated/types";
import { BuildVariantAccordion } from "./BuildVariantAccordion";
import { SelectedTasksMap } from "./types";
import { useSelectRestartTasks } from "./useSelectRestartTasks";

interface VersionTasksProps {
  version: BuildVariantsWithChildrenQuery["version"];
  setSelectedTasksMap: React.Dispatch<React.SetStateAction<SelectedTasksMap>>;
}
const VersionTasks: React.FC<VersionTasksProps> = ({
  setSelectedTasksMap,
  version,
}) => {
  const { buildVariants, id: versionId } = version || {};

  const [baseStatusFilters, setBaseStatusFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const { selectByFilters, selectedTasks, toggleSelectedTask } =
    useSelectRestartTasks(version);

  const onChangeBaseStatusFilters = (filters: string[]) => {
    setBaseStatusFilters(filters);
    setSelectedTasksMap((prev) => {
      const updatedMap = new Map(prev);
      const updatedSelectedTasks = selectByFilters({
        baseStatusFilters: filters,
        statusFilters,
      });
      updatedMap.set(versionId, updatedSelectedTasks);
      return updatedMap;
    });
  };

  const onChangeStatusFilters = (filters: string[]) => {
    setStatusFilters(filters);
    setSelectedTasksMap((prev) => {
      const updatedMap = new Map(prev);
      const updatedSelectedTasks = selectByFilters({
        baseStatusFilters,
        statusFilters: filters,
      });
      updatedMap.set(versionId, updatedSelectedTasks);
      return updatedMap;
    });
  };

  const onToggleTask = (taskIds: string[], isParentCheckbox: boolean) => {
    setSelectedTasksMap((prev) => {
      const updatedMap = new Map(prev);
      const updatedSelectedTasks = toggleSelectedTask(
        taskIds,
        isParentCheckbox,
      );
      updatedMap.set(versionId, updatedSelectedTasks);
      return updatedMap;
    });
  };

  return versionId && buildVariants ? (
    <>
      <TaskStatusFilters
        onChangeBaseStatusFilter={onChangeBaseStatusFilters}
        onChangeStatusFilter={onChangeStatusFilters}
        selectedBaseStatuses={baseStatusFilters}
        selectedStatuses={statusFilters}
        versionId={versionId}
      />
      <ContentWrapper>
        {[...buildVariants]
          .sort((a, b) => a.displayName.localeCompare(b.displayName))
          .map((patchBuildVariant) => (
            <BuildVariantAccordion
              key={`accordion_${patchBuildVariant.variant}`}
              displayName={patchBuildVariant.displayName}
              selectedTasks={selectedTasks}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              tasks={patchBuildVariant.tasks}
              toggleSelectedTask={onToggleTask}
            />
          ))}
        <Divider />
      </ContentWrapper>
    </>
  ) : null;
};

// 425px represents the height to subtract to prevent an overflow on the modal
const ContentWrapper = styled.div`
  max-height: calc(100vh - 425px);
  overflow-y: auto;
`;

export default VersionTasks;
