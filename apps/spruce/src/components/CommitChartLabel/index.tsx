import { Body, InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import ExpandedText from "components/ExpandedText";
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
  const jiraHost = spruceConfig?.jira?.host;
  const {
    owner: upstreamOwner,
    project: upstreamProjectIdentifier,
    repo: upstreamRepo,
    revision: upstreamRevision,
    task: upstreamTask,
    triggerType,
    version: upstreamVersion,
  } = upstreamProject || {};

  return (
    <div className={styles.labelContainer} data-testid="commit-label">
      <Body className={styles.labelText}>
        <InlineCode
          as={Link}
          data-testid="githash-link"
          onClick={onClickGithash}
          to={getVersionRoute(versionId)}
        >
          {shortenGithash(githash)}
        </InlineCode>{" "}
        <b title={getDateCopy(createDate)}>
          {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
        </b>{" "}
      </Body>
      {upstreamProject && (
        <Body className={styles.labelText}>
          Triggered from:{" "}
          <StyledRouterLink
            onClick={onClickUpstreamProject}
            to={getTriggerRoute({
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              triggerType,
              upstreamTask,
              upstreamVersion,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              upstreamRevision,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              upstreamOwner,
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              upstreamRepo,
            })}
          >
            {upstreamProjectIdentifier}
          </StyledRouterLink>
        </Body>
      )}
      <Body className={styles.labelText}>{author} -</Body>
      <Body className={styles.labelText}>
        {jiraLinkify(
          shortenMessage ? shortenedMessage : message,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
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
