import { useState, ComponentProps } from "react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { size } from "@evg-ui/lib/constants/tokens";
import { MetadataItem } from "components/MetadataCard";
import { TaskQuery, VersionQuery } from "gql/generated/types";
import { formatCost } from "utils/numbers";
import { CostModal } from "./CostModal";

type Task = NonNullable<TaskQuery["task"]>;
type Version = NonNullable<VersionQuery["version"]>;

type CostSummaryProps =
  | {
      onClickDetailsButton: () => void;
      task: Task;
      totalCost: number;
      type: "task";
      version?: never;
    }
  | {
      onClickDetailsButton: () => void;
      task?: never;
      totalCost: number;
      type: "version";
      version: Version;
    };

export const CostSummary: React.FC<CostSummaryProps> = ({
  onClickDetailsButton,
  task,
  totalCost,
  type,
  version,
}) => {
  const [costModalOpen, setCostModalOpen] = useState(false);

  const { modalProps, showDetails, tooltipDescription } =
    type === "task"
      ? getTaskConfig(task)
      : getVersionConfig(version, totalCost);

  return (
    <>
      <MetadataItem label="Cost" tooltipDescription={tooltipDescription}>
        ${formatCost(totalCost)}
        {showDetails && (
          <CostDetailsButton
            data-cy="cost-details-button"
            onClick={() => {
              onClickDetailsButton();
              setCostModalOpen(true);
            }}
            size={ButtonSize.XSmall}
          >
            Cost Details
          </CostDetailsButton>
        )}
      </MetadataItem>
      {showDetails && costModalOpen && (
        <CostModal
          {...modalProps}
          open={costModalOpen}
          setOpen={setCostModalOpen}
        />
      )}
    </>
  );
};

const CostDetailsButton = styled(Button)`
  margin-left: ${size.xxs};
`;

type CostModalProps = Omit<
  ComponentProps<typeof CostModal>,
  "open" | "setOpen"
>;

interface CostConfig {
  modalProps: CostModalProps;
  showDetails: boolean;
  tooltipDescription?: string; // Only populated for versions; tasks have no tooltip.
}

const getTaskConfig = (task: Task): CostConfig => {
  const { displayName, finishTime, id, startTime, taskCost } = task;
  return {
    modalProps: {
      ...taskCost,
      endTs: finishTime ?? undefined,
      name: displayName,
      startTs: startTime ?? undefined,
      taskId: id,
    },
    showDetails: !!finishTime,
  };
};

const getVersionConfig = (version: Version, totalCost: number): CostConfig => {
  const { cost, finishTime, id, isPatch, message, patch, startTime } = version;
  const isVersionComplete = !!finishTime;
  const hasChildPatches = (patch?.childPatches?.length ?? 0) > 0;
  return {
    modalProps: {
      ...cost,
      childPatchesTotalCost: isPatch
        ? patch?.cost?.childPatchesTotalCost
        : null,
      endTs: finishTime ?? undefined,
      name: message ?? id,
      startTs: startTime ?? undefined,
      total: totalCost,
      versionId: id,
    },
    showDetails: isVersionComplete,
    tooltipDescription: getCostTooltip(isVersionComplete, hasChildPatches),
  };
};

const getCostTooltip = (isFinished: boolean, hasChildren: boolean): string => {
  if (isFinished) {
    return hasChildren
      ? "Total cost of all tasks, including child patches."
      : "Total cost of all tasks.";
  }
  return hasChildren
    ? "Estimated cost of completed tasks so far, including child patches."
    : "Estimated cost of completed tasks so far.";
};
