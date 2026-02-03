import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body, BodyProps, InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { StyledRouterLink } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { shortenGithash } from "@evg-ui/lib/utils";
import ExpandedText from "components/ExpandedText";
import { getVersionRoute, getTriggerRoute } from "constants/routes";
import { UpstreamProjectFragment, GitTag } from "gql/generated/types";
import { useSpruceConfig, useDateFormat } from "hooks";
import { jiraLinkify } from "utils/string";

const { gray } = palette;
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
    <LabelContainer data-cy="commit-label">
      <LabelText>
        <InlineCode
          as={Link}
          data-cy="githash-link"
          onClick={onClickGithash}
          to={getVersionRoute(versionId)}
        >
          {shortenGithash(githash)}
        </InlineCode>{" "}
        <b title={getDateCopy(createDate)}>
          {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
        </b>{" "}
      </LabelText>
      {upstreamProject && (
        <LabelText>
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
        </LabelText>
      )}
      <LabelText>{author} -</LabelText>
      <LabelText>
        {jiraLinkify(
          shortenMessage ? shortenedMessage : message,
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          jiraHost,
          onClickJiraTicket,
        )}
      </LabelText>
      {shortenMessage && (
        <ExpandedText data-cy="long-commit-message-tooltip" message={message} />
      )}
      {gitTags && (
        <LabelText>Git Tags: {gitTags.map((g) => g.tag).join(", ")}</LabelText>
      )}
    </LabelContainer>
  );
};

const LabelContainer = styled.div`
  min-width: 100%;
  display: flex;
  margin-top: ${size.xs};
  margin-bottom: ${size.s};
  flex-direction: column;
  align-items: flex-start;
  word-break: normal;
  overflow-wrap: anywhere;
`;

const LabelText = styled(Body)<BodyProps>`
  color: ${gray.dark2};
  width: 100%;
  font-size: 12px;
`;

export default CommitChartLabel;
