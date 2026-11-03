import { Body } from "@leafygreen-ui/typography";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import ExpandedText from "components/ExpandedText";
import { RevisionLink } from "components/RevisionLink";
import { getTriggerRoute, getVersionRoute } from "constants/routes";
import { GitTag, UpstreamProjectFragment } from "gql/generated/types";
import { useDateFormat, useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";
import styles from "./index.module.css";

const MAX_CHAR = 40;
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
  const shortenMessage = message.length > MAX_CHAR;
  const shortenedMessage = message.substring(0, MAX_CHAR - 3).concat("...");
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

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
            Triggered from:{" "}
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
      <Body className={styles.labelText}>{author} -</Body>
      <Body className={styles.labelText}>
        {jiraLinkify(
          shortenMessage ? shortenedMessage : message,
          jiraHost,
          onClickJiraTicket,
        )}
      </Body>
      {shortenMessage && (
        <ExpandedText
          data-testid="long-commit-message-tooltip"
          message={message}
        />
      )}
      {gitTags && (
        <Body className={styles.labelText}>
          Git Tags: {gitTags.map((g) => g.tag).join(", ")}
        </Body>
      )}
    </div>
  );
};

export default CommitChartLabel;
