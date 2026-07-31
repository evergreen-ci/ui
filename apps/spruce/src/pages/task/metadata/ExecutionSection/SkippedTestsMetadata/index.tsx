import { useState } from "react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import pluralize from "pluralize";
import { size } from "@evg-ui/lib/constants/tokens";
import { useTaskAnalytics } from "analytics";
import { MetadataItem } from "components/MetadataCard";
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
      <MetadataItem as="div" label="Tests skipped by TSS">
        <InlineContent data-cy="skipped-tests-metadata">
          <span data-cy="skipped-tests-metadata-count">
            {count} {pluralize("test", count)}
          </span>
          {detailsAvailable && (
            <Button
              data-cy="skipped-tests-details-button"
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
          <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
            Tests skipped by TSS when this execution ran. This snapshot may
            differ from what TSS would skip now.
            {execution !== latestExecution &&
              " Test names are only available for the latest execution."}
          </InfoSprinkle>
        </InlineContent>
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

const InlineContent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${size.xxs};
  vertical-align: middle;
`;
