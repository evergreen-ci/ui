import { useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useVersionAnalytics } from "analytics";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
import {
  VersionQuarantinedTasksQuery,
  VersionQuarantinedTasksQueryVariables,
} from "gql/generated/types";
import { VERSION_QUARANTINED_TASKS } from "gql/queries";
import { VersionSkippedTestsModal } from "./VersionSkippedTestsModal";

type Props = {
  skippedTestsCount: number;
  testSelectionEnabled: boolean;
  versionId: string;
};

export const SkippedTestsMetadata: React.FC<Props> = ({
  skippedTestsCount,
  testSelectionEnabled,
  versionId,
}) => {
  const { sendEvent } = useVersionAnalytics(versionId);
  const dispatchToast = useToastContext();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [fetchQuarantinedTasks, { data }] = useLazyQuery<
    VersionQuarantinedTasksQuery,
    VersionQuarantinedTasksQueryVariables
  >(VERSION_QUARANTINED_TASKS);

  const skippedTestTasks = (data?.version.tasks.data ?? []).filter(
    (task) => task.quarantinedTestsSkippedCount > 0,
  );

  if (!testSelectionEnabled || skippedTestsCount === 0) {
    return null;
  }

  return (
    <>
      <MetadataItem as="div">
        <MetadataContent data-testid="version-skipped-tests-metadata">
          <SummaryRow>
            <MetadataLabel>Tests skipped by TSS:</MetadataLabel>
            <Count data-testid="version-skipped-tests-metadata-count">
              {skippedTestsCount}
            </Count>
            <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
              Tests skipped by TSS across this version&apos;s tasks when they
              ran. This snapshot may differ from what TSS would skip now.
            </InfoSprinkle>
          </SummaryRow>
          <Button
            data-testid="version-skipped-tests-details-button"
            onClick={async () => {
              sendEvent({
                name: "Clicked version skipped tests details button",
              });
              try {
                await fetchQuarantinedTasks({
                  variables: { versionId },
                });
                setDetailsOpen(true);
              } catch {
                dispatchToast.error(
                  "There was an error loading the skipped test details.",
                );
              }
            }}
            size={ButtonSize.XSmall}
          >
            Details
          </Button>
        </MetadataContent>
      </MetadataItem>
      {detailsOpen && (
        <VersionSkippedTestsModal
          open={detailsOpen}
          setOpen={setDetailsOpen}
          skippedTestTasks={skippedTestTasks}
          totalCount={skippedTestsCount}
          versionId={versionId}
        />
      )}
    </>
  );
};

const MetadataContent = styled.span`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  column-gap: ${size.xxs};
  row-gap: ${size.xxs};
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
