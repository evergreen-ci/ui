import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { Skeleton, Size as SkeletonSize } from "@leafygreen-ui/skeleton-loader";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { size } from "@evg-ui/lib/constants/tokens";
import { useVersionAnalytics } from "analytics";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
import {
  VersionQuarantinedTasksQuery,
  VersionQuarantinedTasksQueryVariables,
} from "gql/generated/types";
import { VERSION_QUARANTINED_TASKS } from "gql/queries";
import { VersionSkippedTestsModal } from "./VersionSkippedTestsModal";

type Props = {
  testSelectionEnabled: boolean;
  versionId: string;
};

export const SkippedTestsMetadata: React.FC<Props> = ({
  testSelectionEnabled,
  versionId,
}) => {
  const { sendEvent } = useVersionAnalytics(versionId);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, error, loading, refetch } = useQuery<
    VersionQuarantinedTasksQuery,
    VersionQuarantinedTasksQueryVariables
  >(VERSION_QUARANTINED_TASKS, {
    skip: !testSelectionEnabled,
    variables: { versionId },
  });

  const skippedTestTasks = (data?.version.tasks.data ?? []).filter(
    (task) => task.quarantinedTestsSkippedCount > 0,
  );
  const totalCount = skippedTestTasks.reduce(
    (sum, task) => sum + task.quarantinedTestsSkippedCount,
    0,
  );

  if (!testSelectionEnabled) {
    return null;
  }

  if (loading) {
    return (
      <MetadataItem as="div">
        <SummaryRow data-testid="version-skipped-tests-metadata-loading">
          <MetadataLabel>Tests skipped by TSS:</MetadataLabel>
          <Skeleton size={SkeletonSize.Small} />
        </SummaryRow>
      </MetadataItem>
    );
  }

  if (error) {
    return (
      <MetadataItem as="div">
        <SummaryRow data-testid="version-skipped-tests-metadata-error">
          <MetadataLabel>Tests skipped by TSS:</MetadataLabel>
          <span>Unavailable</span>
          <Button
            data-testid="version-skipped-tests-metadata-retry"
            onClick={() => {
              void refetch();
            }}
            size={ButtonSize.XSmall}
          >
            Retry
          </Button>
        </SummaryRow>
      </MetadataItem>
    );
  }

  if (totalCount === 0) {
    return null;
  }

  return (
    <>
      <MetadataItem as="div">
        <MetadataContent data-testid="version-skipped-tests-metadata">
          <SummaryRow>
            <MetadataLabel>Tests skipped by TSS:</MetadataLabel>
            <Count data-testid="version-skipped-tests-metadata-count">
              {totalCount}
            </Count>
            <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
              Tests skipped by TSS across this version&apos;s tasks when they
              ran. This snapshot may differ from what TSS would skip now.
            </InfoSprinkle>
          </SummaryRow>
          <Button
            data-testid="version-skipped-tests-details-button"
            onClick={() => {
              sendEvent({
                name: "Clicked version skipped tests details button",
              });
              setDetailsOpen(true);
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
          totalCount={totalCount}
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
