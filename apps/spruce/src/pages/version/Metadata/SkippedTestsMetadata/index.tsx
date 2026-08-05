import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { Skeleton, Size as SkeletonSize } from "@leafygreen-ui/skeleton-loader";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import pluralize from "pluralize";
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
  versionId: string;
};

export const SkippedTestsMetadata: React.FC<Props> = ({ versionId }) => {
  const { sendEvent } = useVersionAnalytics(versionId);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, loading } = useQuery<
    VersionQuarantinedTasksQuery,
    VersionQuarantinedTasksQueryVariables
  >(VERSION_QUARANTINED_TASKS, { variables: { versionId } });

  const skippedTestTasks = useMemo(
    () =>
      (data?.version.tasks.data ?? []).filter(
        (task) => task.quarantinedTestsSkippedCount > 0,
      ),
    [data],
  );
  const totalCount = skippedTestTasks.reduce(
    (sum, task) => sum + task.quarantinedTestsSkippedCount,
    0,
  );

  if (loading) {
    return (
      <MetadataItem as="div">
        <SummaryRow data-cy="version-skipped-tests-metadata-loading">
          <MetadataLabel>Tests skipped by TSS:</MetadataLabel>
          <Skeleton size={SkeletonSize.Small} />
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
        <MetadataContent data-cy="version-skipped-tests-metadata">
          <SummaryRow>
            <MetadataLabel>Tests skipped by TSS:</MetadataLabel>
            <Count data-cy="version-skipped-tests-metadata-count">
              {totalCount} {pluralize("test", totalCount)}
            </Count>
            <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
              Tests skipped by TSS across this version&apos;s tasks when they
              ran. This snapshot may differ from what TSS would skip now.
            </InfoSprinkle>
          </SummaryRow>
          <Button
            data-cy="version-skipped-tests-details-button"
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
