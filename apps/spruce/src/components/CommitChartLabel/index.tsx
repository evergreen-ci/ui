import { Body } from "@leafygreen-ui/typography";
import { Unpacked } from "@evg-ui/lib/types/utils";
import {
  BasedOnVersion,
  CommitDescription,
  CommitSource,
} from "components/CommitLabel";
import { MainlineCommitsForHistoryMainlineCommitsVersionsRolledUpVersions } from "components/HistoryTable/types";
import { Requester } from "constants/requesters";
import { getVersionRoute } from "constants/routes";
import { useDateFormat } from "hooks";
import styles from "./index.module.css";

interface Props {
  version: Unpacked<MainlineCommitsForHistoryMainlineCommitsVersionsRolledUpVersions>;
  onClickGithash?: () => void;
  onClickJiraTicket?: () => void;
  onClickUpstreamProject?: () => void;
}

const CommitChartLabel: React.FC<Props> = ({
  onClickGithash = () => {},
  onClickJiraTicket = () => {},
  onClickUpstreamProject = () => {},
  version,
}) => {
  const getDateCopy = useDateFormat();
  const { createTime, gitTags, id, message, requester, user } = version;
  const createDate = new Date(createTime);
  const isTrigger = requester === Requester.Trigger;

  return (
    <div className={styles.labelContainer} data-testid="commit-label">
      <div className={styles.flexRow}>
        <span className={styles.date} title={getDateCopy(createDate)}>
          {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
        </span>
      </div>
      <CommitSource
        data-testid="githash-link"
        hashHref={getVersionRoute(id)}
        onHashClick={onClickGithash}
        onModuleClick={onClickUpstreamProject}
        version={version}
      />
      <CommitDescription
        author={user.displayName ?? user.userId}
        className={styles.labelText}
        inline
        lineClamp={isTrigger ? 2 : 3}
        maxLength={Infinity}
        message={message}
        onJiraLinkClick={onClickJiraTicket}
        title={message}
      />
      <BasedOnVersion isTrigger={isTrigger} versionId={id} />
      {gitTags && (
        <Body className={styles.labelText}>
          Git Tags: {gitTags.map((g) => g.tag).join(", ")}
        </Body>
      )}
    </div>
  );
};

export default CommitChartLabel;
