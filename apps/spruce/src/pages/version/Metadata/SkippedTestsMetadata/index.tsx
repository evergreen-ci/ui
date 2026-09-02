import { useState } from "react";
import styled from "@emotion/styled";
import { Button, Size as ButtonSize } from "@leafygreen-ui/button";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { size } from "@evg-ui/lib/constants/tokens";
import { useVersionAnalytics } from "analytics";
import { MetadataItem, MetadataLabel } from "components/MetadataCard";
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
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!testSelectionEnabled || skippedTestsCount === 0) {
    return null;
  }

  return (
    <>
      <MetadataItem elementType="div">
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
