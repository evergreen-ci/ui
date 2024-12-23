import { useMemo } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Skeleton } from "antd";
import { size } from "@evg-ui/lib/constants/tokens";
import { Commits } from "types/commits";
import { CommitChart } from "./CommitChart";
import {
  getCommitKey,
  getCommitWidth,
  isCommitSelected,
  RenderCommitsLabel,
  RenderCommitsBuildVariants,
} from "./RenderCommit";
import { FlexRowContainer, CommitWrapper } from "./styles";
import { constructBuildVariantDict } from "./utils";

const { white } = palette;

interface CommitsWrapperProps {
  versions?: Commits;
  isLoading: boolean;
  hasTaskFilter: boolean;
  hasFilters: boolean;
  revision?: string;
}

export const CommitsWrapper: React.FC<CommitsWrapperProps> = ({
  hasFilters,
  hasTaskFilter,
  isLoading,
  revision,
  versions,
}) => {
  const buildVariantDict = useMemo(() => {
    if (versions) {
      return constructBuildVariantDict(versions);
    }
  }, [versions]);

  if (isLoading) {
    return <StyledSkeleton active paragraph={{ rows: 6 }} title={false} />;
  }
  if (!versions) {
    return <CommitChart />;
  }
  if (versions) {
    return (
      <ChartContainer>
        <CommitChart hasTaskFilter={hasTaskFilter} versions={versions} />
        <StickyContainer>
          <FlexRowContainer>
            {versions.map((commit) => (
              <CommitWrapper
                key={getCommitKey(commit)}
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                data-selected={isCommitSelected(commit, revision)}
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                selected={isCommitSelected(commit, revision)}
                width={getCommitWidth(commit)}
              >
                <RenderCommitsLabel commit={commit} hasFilters={hasFilters} />
              </CommitWrapper>
            ))}
          </FlexRowContainer>
        </StickyContainer>
        <FlexRowContainer>
          {versions.map((commit) => (
            <CommitWrapper
              key={getCommitKey(commit)}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              selected={isCommitSelected(commit, revision)}
              width={getCommitWidth(commit)}
            >
              <RenderCommitsBuildVariants
                // @ts-expect-error: FIXME. This comment was added by an automated script.
                buildVariantDict={buildVariantDict}
                commit={commit}
              />
            </CommitWrapper>
          ))}
        </FlexRowContainer>
      </ChartContainer>
    );
  }
  return <NoResults data-cy="no-commits-found">No commits found</NoResults>;
};

const ChartContainer = styled.div`
  padding-left: ${size.m};
`;

const StickyContainer = styled.div`
  position: sticky;
  top: -${size.m}; // This is to offset the padding of PageWrapper
  z-index: 1;
  background-color: ${white};
  margin-top: ${size.xxs};
`;

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
