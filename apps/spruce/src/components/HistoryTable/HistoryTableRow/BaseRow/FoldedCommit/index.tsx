import { useMemo, useState } from "react";
import Accordion from "@evg-ui/lib/components/Accordion";
import { cx } from "@evg-ui/lib/utils/css";
import CommitChartLabel from "components/CommitChartLabel";
import { EmptyCell, LabelCellContainer } from "components/HistoryTable/Cell";
import { FoldedCommitsRow } from "components/HistoryTable/types";
import { RowContainer } from "../styles";
import styles from "./index.module.css";

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
  const [open, setOpen] = useState(expanded);
  const numCommits = rolledUpCommits.length;

  const columns = useMemo(
    () =>
      Array.from(Array(numVisibleCols)).map((_, idx) => (
        <EmptyCell key={`empty_cell_${idx}`} /> // eslint-disable-line react/no-array-index-key
      )),
    [numVisibleCols],
  );

  const commits = rolledUpCommits.map((commit) => (
    <RowContainer
      key={commit.id}
      className={styles.foldedRow}
      data-testid="folded-commit"
    >
      <LabelCellContainer>
        <CommitChartLabel
          onClickGithash={onClickGithash}
          onClickJiraTicket={onClickJiraTicket}
          version={commit}
        />
      </LabelCellContainer>
      {columns}
    </RowContainer>
  ));

  return (
    <div className={cx(styles.column, selected && styles.columnSelected)}>
      <Accordion
        className={styles.accordion}
        onToggle={({ isVisible }) => {
          setOpen(isVisible);
          onToggleFoldedCommit({ expanded: isVisible, index, numCommits });
        }}
        open={open}
        title={`Expand ${numCommits} inactive`}
        titleTag={AccordionTitle}
        toggledTitle={`Collapse ${numCommits} inactive`}
        useIndent={false}
      >
        {open && commits}
      </Accordion>
    </div>
  );
};

const AccordionTitle: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <div className={styles.accordionTitle}>{children}</div>;

export default FoldedCommit;
