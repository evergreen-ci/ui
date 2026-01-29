import CommitChartLabel from "components/CommitChartLabel";
import { getDisplayName } from "utils/user";
import { types } from "../..";
import { LabelCellContainer } from "../../Cell";
import { useHistoryTable } from "../../HistoryTableContext";
import { rowType } from "../../types";
import DateSeparator from "./DateSeparator";
import FoldedCommit from "./FoldedCommit";
import { RowContainer } from "./styles";

type BaseRowEventHandlers = {
  onClickGithash: () => void;
  onClickFoldedGithash: () => void;
  onClickUpstreamProject: () => void;
  onClickJiraTicket: () => void;
  onClickFoldedJiraTicket: () => void;
  onToggleFoldedCommit: (s: { isVisible: boolean }) => void;
};
interface RowProps {
  columns: React.ReactNode[];
  data: types.CommitRowType;
  index: number;
  numVisibleCols: number;
  eventHandlers: BaseRowEventHandlers;
  selected: boolean;
}

const BaseRow: React.FC<RowProps> = ({
  columns,
  data,
  eventHandlers,
  index,
  numVisibleCols,
  selected,
}) => {
  const {
    onClickFoldedGithash,
    onClickFoldedJiraTicket,
    onClickGithash,
    onClickJiraTicket,
    onClickUpstreamProject,
    onToggleFoldedCommit,
  } = eventHandlers;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { columnLimit, toggleRowExpansion } = useHistoryTable();

  switch (data.type) {
    case rowType.DATE_SEPARATOR:
      return <DateSeparator date={data.date} />;
    case rowType.COMMIT: {
      const {
        createTime,
        gitTags,
        id: versionId,
        message,
        revision,
        upstreamProject,
        user,
      } = data.commit;

      return (
        <RowContainer data-selected={selected} selected={selected}>
          <LabelCellContainer>
            <CommitChartLabel
              author={getDisplayName(user)}
              createTime={createTime}
              githash={revision}
              gitTags={gitTags}
              message={message}
              onClickGithash={onClickGithash}
              onClickJiraTicket={onClickJiraTicket}
              onClickUpstreamProject={onClickUpstreamProject}
              upstreamProject={upstreamProject}
              versionId={versionId}
            />
          </LabelCellContainer>
          {columns}
        </RowContainer>
      );
    }
    case rowType.FOLDED_COMMITS:
      return (
        <FoldedCommit
          data={data}
          index={index}
          numVisibleCols={numVisibleCols || columnLimit}
          onClickGithash={onClickFoldedGithash}
          onClickJiraTicket={onClickFoldedJiraTicket}
          onToggleFoldedCommit={({ expanded, index: rowIndex }) => {
            onToggleFoldedCommit({ isVisible: expanded });
            toggleRowExpansion(rowIndex, expanded);
          }}
          selected={selected}
        />
      );
    default:
      return null;
  }
};

export default BaseRow;
