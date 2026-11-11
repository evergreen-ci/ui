import { Body } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { BasedOnVersion, CommitDescription } from "components/CommitLabel";
import { MainlineCommitsForHistoryMainlineCommitsVersionsRolledUpVersions } from "components/HistoryTable/types";
import { RevisionLink } from "components/RevisionLink";
import { getTriggerRoute, getVersionRoute } from "constants/routes";
import { UpstreamProjectFragment } from "gql/generated/types";
import { useDateFormat } from "hooks";
import styles from "./index.module.css";

type RolledUpCommit =
  Unpacked<MainlineCommitsForHistoryMainlineCommitsVersionsRolledUpVersions>;

type Commit = RolledUpCommit & {
  upstreamProject?: UpstreamProjectFragment["upstreamProject"];
};

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
  const { createTime, gitTags, id, message, revision, upstreamProject, user } =
    version;
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
          revision={revision}
          to={getVersionRoute(id)}
        />
        {upstreamProject && (
          <Body className={styles.labelText}>
            Module:{" "}
            <StyledRouterLink
              onClick={onClickUpstreamProject}
              to={getTriggerRoute({
                triggerType: upstreamProject.triggerType,
                upstreamTask: upstreamProject.task,
                upstreamVersion: upstreamProject.version,
                upstreamRevision: upstreamProject.revision,
                upstreamOwner: upstreamProject.owner,
                upstreamRepo: upstreamProject.repo,
              })}
            >
              {upstreamProject.project}
            </StyledRouterLink>
          </Body>
        )}
      </div>
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
      <BasedOnVersion isTrigger={!!upstreamProject} versionId={id} />
      {gitTags && (
        <Body className={styles.labelText}>
          Git Tags: {gitTags.map((g) => g.tag).join(", ")}
        </Body>
      )}
    </div>
  );
};

export default CommitChartLabel;
