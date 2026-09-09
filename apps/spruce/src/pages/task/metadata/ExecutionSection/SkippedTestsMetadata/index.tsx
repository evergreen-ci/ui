import { useState } from "react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import pluralize from "pluralize";
import { size } from "@evg-ui/lib/constants/tokens";
import { useTaskAnalytics } from "analytics";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
import { SkippedTestsDetails } from "./SkippedTestsDetails";

type Props = {
  count: number;
  execution: number;
  latestExecution: number;
  taskId: string;
  testSelectionEnabled: boolean;
  versionId: string;
};

export const SkippedTestsMetadata: React.FC<Props> = ({
  count,
  execution,
  latestExecution,
  taskId,
  testSelectionEnabled,
  versionId,
}) => {
  const { sendEvent } = useTaskAnalytics();
  const [detailsOpen, setDetailsOpen] = useState(false);

  // A zero count is only meaningful as a trust signal when test selection
  // actually ran on this task.
  if (count === 0 && !testSelectionEnabled) {
    return null;
  }

  const detailsAvailable = count > 0 && execution === latestExecution;

  return (
    <>
      <MetadataItem elementType="div">
        <MetadataContent data-testid="skipped-tests-metadata">
          <SummaryRow>
            <MetadataLabel>Tests skipped by TSS:</MetadataLabel>
            <Count data-testid="skipped-tests-metadata-count">
              {count} {pluralize("test", count)}
            </Count>
            <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
              Tests skipped by TSS when this execution ran. This snapshot may
              differ from what TSS would skip now.
              {execution !== latestExecution &&
                " Test names are only available for the latest execution."}
            </InfoSprinkle>
          </SummaryRow>
          {detailsAvailable && (
            <Button
              onClick={() => {
                sendEvent({
                  name: "Clicked skipped tests details button",
                });
                setDetailsOpen(true);
              }}
              size={ButtonSize.XSmall}
            >
              Details
            </Button>
          )}
        </MetadataContent>
      </MetadataItem>
      {detailsAvailable && detailsOpen && (
        <SkippedTestsDetails
          count={count}
          execution={execution}
          setOpen={setDetailsOpen}
          taskId={taskId}
          versionId={versionId}
        />
      )}
    </>
  );
};

const MetadataContent = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${size.xxs};
`;

const SummaryRow = styled.span`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  column-gap: ${size.xxs};
  row-gap: ${size.xxs};
`;

const Count = styled.span`
  white-space: nowrap;
`;
