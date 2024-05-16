import styled from "@emotion/styled";
import { Divider } from "components/styles/divider";
import { TaskStatusFilters } from "components/TaskStatusFilters";
import { BuildVariantsWithChildrenQuery } from "gql/generated/types";
import { versionSelectedTasks } from "hooks/useVersionTaskStatusSelect";
import { BuildVariantAccordion } from "./BuildVariantAccordion";

interface VersionTasksProps {
  baseStatusFilterTerm: string[];
  selectedTasks: versionSelectedTasks;
  setBaseStatusFilterTerm: (statuses: string[]) => void;
  setVersionStatusFilterTerm: (statuses: string[]) => void;
  toggleSelectedTask: (
    taskIds: { [patchId: string]: string } | { [patchId: string]: string[] },
  ) => void;
  version: BuildVariantsWithChildrenQuery["version"];
  versionStatusFilterTerm: string[];
}

const VersionTasks: React.FC<VersionTasksProps> = ({
  baseStatusFilterTerm,
  selectedTasks,
  setBaseStatusFilterTerm,
  setVersionStatusFilterTerm,
  toggleSelectedTask,
  version,
  versionStatusFilterTerm,
}) => {
  const { buildVariants, id: versionId } = version || {};
  const tasks = selectedTasks[versionId] || {};

  return versionId && buildVariants ? (
    <>
      <TaskStatusFilters
        onChangeBaseStatusFilter={setBaseStatusFilterTerm}
        onChangeStatusFilter={setVersionStatusFilterTerm}
        versionId={versionId}
        selectedBaseStatuses={baseStatusFilterTerm || []}
        selectedStatuses={versionStatusFilterTerm || []}
      />
      <ContentWrapper>
        {[...buildVariants]
          // @ts-ignore: FIXME. This comment was added by an automated script.
          .sort((a, b) => a.displayName.localeCompare(b.displayName))
          .map((patchBuildVariant) => (
            <BuildVariantAccordion
              versionId={versionId}
              // @ts-ignore: FIXME. This comment was added by an automated script.
              key={`accordion_${patchBuildVariant.variant}`}
              // @ts-ignore: FIXME. This comment was added by an automated script.
              tasks={patchBuildVariant.tasks}
              // @ts-ignore: FIXME. This comment was added by an automated script.
              displayName={patchBuildVariant.displayName}
              selectedTasks={tasks}
              toggleSelectedTask={toggleSelectedTask}
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
