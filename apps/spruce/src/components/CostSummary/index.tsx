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
  | { type: "task"; task: Task; onClickDetailsButton: () => void }
  | { type: "version"; version: Version; onClickDetailsButton: () => void };

export const CostSummary: React.FC<CostSummaryProps> = (props) => {
  const [costModalOpen, setCostModalOpen] = useState(false);

  const { onClickDetailsButton, type } = props;
  const config =
    type === "task"
      ? deriveTaskConfig(props.task)
      : deriveVersionConfig(props.version);

  if (!config) {
    return null;
  }

  const {
    costModalProps,
    dataCy,
    detailsButtonDataCy,
    showDetailsButton,
    tooltipDescription,
    totalCost,
  } = config;

  return (
    <>
      <MetadataItem
        data-cy={dataCy}
        label="Cost"
        tooltipDescription={tooltipDescription}
      >
        ${formatCost(totalCost)}
        {showDetailsButton && (
          <CostDetailsButton
            data-cy={detailsButtonDataCy}
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
      {costModalProps && costModalOpen && (
        <CostModal
          {...costModalProps}
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
  costModalProps?: CostModalProps;
  dataCy: string;
  detailsButtonDataCy: string;
  showDetailsButton: boolean;
  tooltipDescription?: string;
  totalCost: number;
}

const deriveTaskConfig = (task: Task): CostConfig | null => {
  const { displayName, finishTime, id, startTime, taskCost } = task;
  if (!finishTime || taskCost?.total == null) {
    return null;
  }
  return {
    costModalProps: {
      ...taskCost,
      endTs: finishTime ?? undefined,
      name: displayName,
      startTs: startTime ?? undefined,
      taskId: id,
    },
    dataCy: "task-metadata-cost",
    detailsButtonDataCy: "cost-details-button",
    showDetailsButton: taskCost.total > 0,
    totalCost: taskCost.total,
  };
};

const deriveVersionConfig = (version: Version): CostConfig | null => {
  const { cost, finishTime, id, isPatch, message, patch, startTime } = version;
  const totalCost = isPatch ? patch?.cost?.total : cost?.total;
  if (!startTime || totalCost == null || totalCost <= 0) {
    return null;
  }
  const isVersionComplete = !!finishTime;
  const hasChildPatches = (patch?.childPatches?.length ?? 0) > 0;
  return {
    costModalProps:
      cost != null
        ? {
            ...cost,
            childPatchesTotalCost: isPatch
              ? patch?.cost?.childPatchesTotalCost
              : null,
            endTs: finishTime ?? undefined,
            name: message ?? id,
            startTs: startTime ?? undefined,
            total: totalCost ?? cost.total,
            versionId: id,
          }
        : undefined,
    dataCy: "version-metadata-cost",
    detailsButtonDataCy: "version-cost-details-button",
    showDetailsButton: cost != null && isVersionComplete,
    tooltipDescription: getCostTooltip(isVersionComplete, hasChildPatches),
    totalCost,
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
