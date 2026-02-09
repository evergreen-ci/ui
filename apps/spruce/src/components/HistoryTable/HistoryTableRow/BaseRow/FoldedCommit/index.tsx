import { useMemo } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Accordion } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import CommitChartLabel from "components/CommitChartLabel";
import { EmptyCell, LabelCellContainer } from "components/HistoryTable/Cell";
import { FoldedCommitsRow } from "components/HistoryTable/types";
import { RowContainer } from "../styles";

const { blue } = palette;

interface FoldedCommitProps {
  index: number;
  numVisibleCols: number;
  selected: boolean;
  data: FoldedCommitsRow;
  onToggleFoldedCommit: (s: {
    expanded: boolean;
    index: number;
    numCommits: number;
  }) => void;
  onClickJiraTicket?: () => void;
  onClickGithash?: () => void;
}
const FoldedCommit: React.FC<FoldedCommitProps> = ({
  data,
  index,
  numVisibleCols,
  onClickGithash,
  onClickJiraTicket,
  onToggleFoldedCommit = () => {},
  selected,
}) => {
  const { expanded, rolledUpCommits } = data;
  const defaultOpen = expanded;
  const numCommits = rolledUpCommits.length;

  const columns = useMemo(
    () =>
      Array.from(Array(numVisibleCols)).map((_, idx) => (
        <EmptyCell key={`empty_cell_${idx}`} /> // eslint-disable-line react/no-array-index-key
      )),
    [numVisibleCols],
  );

  const commits = rolledUpCommits.map((commit) => (
    <StyledRowContainer key={commit.id} data-cy="folded-commit">
      <LabelCellContainer>
        <CommitChartLabel
          author={commit.user.displayName!}
          createTime={commit.createTime}
          githash={commit.revision}
          gitTags={commit.gitTags}
          message={commit.message}
          onClickGithash={onClickGithash}
          onClickJiraTicket={onClickJiraTicket}
          versionId={commit.id}
        />
      </LabelCellContainer>
      {columns}
    </StyledRowContainer>
  ));

  return (
    <Column selected={selected}>
      <StyledAccordion
        defaultOpen={defaultOpen}
        onToggle={({ isVisible }) => {
          onToggleFoldedCommit({ expanded: isVisible, index, numCommits });
        }}
        title={`Expand ${numCommits} inactive`}
        titleTag={AccordionTitle}
        toggledTitle={`Collapse ${numCommits} inactive`}
        useIndent={false}
      >
        {commits}
      </StyledAccordion>
    </Column>
  );
};

const Column = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ selected }) => selected && `background-color: ${blue.light3}`};
`;

const StyledAccordion = styled(Accordion)`
  margin: ${size.xs} 0;
`;

const AccordionTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledRowContainer = styled(RowContainer)`
  opacity: 60%;
`;

export default FoldedCommit;
