import { Body } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { BasedOnVersion } from "components/BasedOnVersion";
import { CommitDescription } from "components/CommitDescription";
import { RevisionLink } from "components/RevisionLink";
import { getTriggerRoute, getVersionRoute } from "constants/routes";
import { GitTag, UpstreamProjectFragment } from "gql/generated/types";
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
  upstreamProject?: UpstreamProjectFragment["upstreamProject"];
}

const CommitChartLabel: React.FC<Props> = ({
  author,
  createTime,
  gitTags,
  githash,
  message,
  onClickGithash = () => {},
  onClickJiraTicket = () => {},
  onClickUpstreamProject = () => {},
  upstreamProject,
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
      <div className={styles.flexRow}>
        <RevisionLink
          data-testid="githash-link"
          onClick={onClickGithash}
          revision={githash}
          to={getVersionRoute(versionId)}
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
        author={author}
        className={styles.labelText}
        inline
        lineClamp={upstreamProject ? 2 : 3}
        maxLength={Infinity}
        message={message}
        onJiraLinkClick={onClickJiraTicket}
        title={message}
      />
      <BasedOnVersion isTrigger={!!upstreamProject} versionId={versionId} />
      {gitTags && (
        <Body className={styles.labelText}>
          Git Tags: {gitTags.map((g) => g.tag).join(", ")}
        </Body>
      )}
    </div>
  );
};

export default CommitChartLabel;
