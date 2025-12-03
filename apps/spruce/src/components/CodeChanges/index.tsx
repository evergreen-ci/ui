import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Skeleton, TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { getVersionDiffRoute } from "constants/routes";
import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
  FileDiffsFragment,
} from "gql/generated/types";
import { CODE_CHANGES } from "gql/queries";
import { Badge } from "./Badge";
import { Table } from "./Table";

interface CodeChangesProps {
  patchId: string;
}
export const CodeChanges: React.FC<CodeChangesProps> = ({ patchId }) => {
  const { data, error, loading } = useQuery<
    CodeChangesQuery,
    CodeChangesQueryVariables
  >(CODE_CHANGES, {
    variables: { id: patchId },
  });
  const { moduleCodeChanges } = data?.patch ?? {};

  if (loading) {
    return (
      <>
        <StyledSkeleton />
        <TableSkeleton numCols={3} />
      </>
    );
  }
  if (error) {
    return <div id="patch-error">{error.message}</div>;
  }

  if (!moduleCodeChanges?.length) {
    return (
      <Body className="cy-no-code-changes">
        No code changes were applied, or the code changes are too large to
        display.
      </Body>
    );
  }
  return (
    <div data-cy="code-changes">
      {moduleCodeChanges?.map((modCodeChange, index) => {
        const { branchName, fileDiffs, rawLink } = modCodeChange;

        const additions = fileDiffs.reduce(
          (total, diff) => total + diff.additions,
          0,
        );
        const deletions = fileDiffs.reduce(
          (total, diff) => total + diff.deletions,
          0,
        );

        const sortedFileDiffs = sortFileDiffs(fileDiffs);
        const codeChanges = (
          <Table
            fileDiffs={sortedFileDiffs}
            moduleIndex={index}
            patchId={patchId}
          />
        );

        return (
          <div key={branchName}>
            <TitleContainer>
              <Body weight="medium">Changes on {branchName}:</Body>
              <Button
                data-cy="html-diff-btn"
                href={getVersionDiffRoute(patchId, index)}
                size="small"
                title="Open diff as html file"
              >
                HTML
              </Button>
              <Button
                data-cy="raw-diff-btn"
                href={rawLink}
                size="small"
                title="Open diff as raw file"
              >
                Raw
              </Button>
              <Badge additions={additions} deletions={deletions} />
            </TitleContainer>
            {codeChanges}
          </div>
        );
      })}
    </div>
  );
};

const sortFileDiffs = (fileDiffs: FileDiffsFragment[]): FileDiffsFragment[] =>
  [...fileDiffs].sort((a, b) => a.fileName.localeCompare(b.fileName));

const StyledSkeleton = styled(Skeleton)`
  width: 400px;
`;

const TitleContainer = styled.div`
  align-items: baseline;
  display: flex;
  gap: ${size.xs};
  margin: ${size.m} 0 ${size.xs} 0;
`;
