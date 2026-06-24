import { useState } from "react";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { useVersionAnalytics } from "analytics";
import { CostModal } from "components/CostModal";
import { MetadataItem, MetadataSection } from "components/MetadataCard";
import { VersionQuery } from "gql/generated/types";
import { formatCost } from "utils/numbers";
import { ParametersModal } from "../../ParametersModal";

type Version = NonNullable<VersionQuery["version"]>;

interface ExecutionSectionProps {
  version: Version;
}

export const ExecutionSection: React.FC<ExecutionSectionProps> = ({
  version,
}) => {
  const [costModalOpen, setCostModalOpen] = useState(false);
  const {
    cost,
    finishTime,
    id,
    isPatch,
    message,
    parameters,
    patch,
    startTime,
  } = version;
  const { sendEvent } = useVersionAnalytics(id);

  const totalCost = isPatch ? patch?.cost?.total : cost?.total;
  const isVersionComplete = !!finishTime;
  const hasChildPatches = (patch?.childPatches?.length ?? 0) > 0;
  const costTooltip = getCostTooltip(isVersionComplete, hasChildPatches);
  const hasCost = !!startTime && totalCost != null && totalCost > 0;
  const hasParameters = parameters.length > 0;

  if (!hasCost && !hasParameters && !costModalOpen) return null;

  return (
    <MetadataSection title="Execution">
      {hasCost && (
        <MetadataItem
          data-cy="version-metadata-cost"
          label="Cost"
          tooltipDescription={costTooltip}
        >
          ${formatCost(totalCost)}
          {cost != null && isVersionComplete && (
            <>
              {" "}
              <Button
                data-cy="version-cost-details-button"
                onClick={() => {
                  sendEvent({ name: "Clicked version cost details button" });
                  setCostModalOpen(true);
                }}
                size={ButtonSize.XSmall}
              >
                Cost Details
              </Button>
            </>
          )}
        </MetadataItem>
      )}
      {hasParameters && <ParametersModal parameters={parameters} />}
      {cost && costModalOpen && (
        <CostModal
          {...cost}
          childPatchesTotalCost={
            isPatch ? patch?.cost?.childPatchesTotalCost : null
          }
          endTs={finishTime ?? undefined}
          name={message ?? id}
          open={costModalOpen}
          setOpen={setCostModalOpen}
          startTs={startTime ?? undefined}
          total={totalCost ?? cost.total}
          versionId={id}
        />
      )}
    </MetadataSection>
  );
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
