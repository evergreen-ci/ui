import { Body } from "@leafygreen-ui/typography";
import { Unpacked } from "@evg-ui/lib/types/utils";
import {
  BasedOnVersion,
  CommitDescription,
  TriggeredBy,
} from "components/CommitLabel";
import { MainlineCommitsForHistoryMainlineCommitsVersionsRolledUpVersions } from "components/HistoryTable/types";
import { RevisionLink } from "components/RevisionLink";
import { getVersionRoute } from "constants/routes";
import { useDateFormat } from "hooks";
import { getDisplayRevision } from "utils/string";
import styles from "./index.module.css";

type Commit =
  Unpacked<MainlineCommitsForHistoryMainlineCommitsVersionsRolledUpVersions>;

interface Props {
  onClickGithash?: () => void;
  onClickJiraTicket?: () => void;
  onClickUpstreamProject?: () => void;
  version: Commit;
}

const CommitChartLabel: React.FC<Props> = ({
  onClickGithash = () => {},
  onClickJiraTicket = () => {},
  onClickUpstreamProject = () => {},
  version,
}) => {
  const getDateCopy = useDateFormat();
  const { createTime, gitTags, id, message, upstreamProject, user } = version;
  const createDate = new Date(createTime);

  return (
    <div className={styles.labelContainer} data-testid="commit-label">
      <div className={styles.flexRow}>
        <span className={styles.date} title={getDateCopy(createDate)}>
          {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
        </span>
      </div>
      <div className={styles.flexRow}>
        <RevisionLink
          data-testid="githash-link"
          onClick={onClickGithash}
          revision={getDisplayRevision(version)}
          to={getVersionRoute(id)}
        />
        <BasedOnVersion
          baseVersion={upstreamProject?.baseVersion}
          showSeparator
        />
      </div>
      <TriggeredBy
        onClick={onClickUpstreamProject}
        upstreamProject={upstreamProject}
      />
      <CommitDescription
        author={user.displayName ?? user.userId}
        className={styles.labelText}
        inline
        lineClamp={upstreamProject ? 2 : 3}
        maxLength={Infinity}
        message={message}
        onJiraLinkClick={onClickJiraTicket}
        title={message}
      />
      {gitTags && (
        <Body className={styles.labelText}>
          Git Tags: {gitTags.map((g) => g.tag).join(", ")}
        </Body>
      )}
    </div>
  );
};

export default CommitChartLabel;
