import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { navBarHeight } from "components/Header/Navbar";
import { MetadataCard, MetadataTitle } from "components/MetadataCard";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { size } from "constants/tokens";
import {
  BuildVariantStatsQuery,
  BuildVariantStatsQueryVariables,
} from "gql/generated/types";
import { BUILD_VARIANTS_STATS } from "gql/queries";
import { usePolling } from "hooks";
import VariantTaskGroup from "./VariantTaskGroup";

interface BuildVariantCardProps {
  versionId: string;
}
const BuildVariantCard: React.FC<BuildVariantCardProps> = ({ versionId }) => {
  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
    BuildVariantStatsQuery,
    BuildVariantStatsQueryVariables
  >(BUILD_VARIANTS_STATS, {
    fetchPolicy: "cache-and-network",
    variables: { id: versionId },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });
  const { version } = data || {};

  return (
    <StickyMetadataCard error={error} loading={loading}>
      <MetadataTitle>Build Variants</MetadataTitle>
      <ScrollableBuildVariantStatsContainer data-cy="build-variants">
        {version?.buildVariantStats?.map(
          ({ displayName, statusCounts, variant }) => (
            <VariantTaskGroup
              key={`buildVariant_${displayName}_${variant}`}
              displayName={displayName}
              statusCounts={statusCounts}
              variant={variant}
              versionId={versionId}
            />
          ),
        )}
      </ScrollableBuildVariantStatsContainer>
    </StickyMetadataCard>
  );
};

const StickyMetadataCard = styled(MetadataCard)`
  display: flex;
  flex-direction: column;
  /* Subtract navbar height, top, and bottom margin from viewport height */
  max-height: calc(100vh - ${navBarHeight} - ${size.m} - ${size.m});
  position: sticky;
  top: 0;
`;

const ScrollableBuildVariantStatsContainer = styled.div`
  overflow-y: scroll;
`;

export default BuildVariantCard;
