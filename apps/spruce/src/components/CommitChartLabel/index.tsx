import { Body } from "@leafygreen-ui/typography";
import { cx } from "@evg-ui/lib/utils/css";
import { CommitDescription } from "components/CommitDescription";
import { CommitSource } from "components/CommitSource";
import { GitTag } from "gql/generated/types";
import { useDateFormat } from "hooks";
import styles from "./index.module.css";

interface Props {
  githash: string;
  gitTags?: GitTag[] | null;
  createTime: Date;
  author: string;
  message: string;
  versionId: string;
  onClickGithash?: () => void;
  onClickJiraTicket?: () => void;
  onClickUpstreamProject?: () => void;
  isTrigger?: boolean;
}

const CommitChartLabel: React.FC<Props> = ({
  author,
  createTime,
  gitTags,
  githash,
  isTrigger = false,
  message,
  onClickGithash = () => {},
  onClickJiraTicket = () => {},
  onClickUpstreamProject = () => {},
  versionId,
}) => {
  const getDateCopy = useDateFormat();
  const createDate = new Date(createTime);

  return (
    <div className={styles.labelContainer} data-testid="commit-label">
      <div className={styles.flexRow}>
        <span className={styles.date} title={getDateCopy(createDate)}>
          {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
        </span>
      </div>
      <CommitSource
        isTrigger={isTrigger}
        onHashClick={onClickGithash}
        onModuleClick={onClickUpstreamProject}
        version={{ id: versionId, revision: githash }}
      />
      <CommitDescription
        author={author}
        className={cx(styles.labelText, styles.commitMessage)}
        inline
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
