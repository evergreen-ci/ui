import styled from "@emotion/styled";
import { Body, InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useWaterfallAnalytics } from "analytics";
import { StyledRouterLink } from "components/styles";
import { getVersionRoute, getTriggerRoute } from "constants/routes";
import { WaterfallQuery } from "gql/generated/types";
import { useSpruceConfig, useDateFormat } from "hooks";
import { shortenGithash } from "utils/string";
import { jiraLinkify } from "utils/string/jiraLinkify";

type VersionFields = NonNullable<
  Unpacked<WaterfallQuery["waterfall"]["versions"]>["version"]
>;

export const VersionLabel: React.FC<VersionFields> = ({
  author,
  createTime,
  gitTags,
  id,
  message,
  revision,
  upstreamProject,
}) => {
  const getDateCopy = useDateFormat();
  const createDate = new Date(createTime);

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

  const { sendEvent } = useWaterfallAnalytics();

  return (
    <VersionContainer>
      <Body>
        <InlineCode
          as={Link}
          onClick={() => {
            sendEvent({
              name: "Clicked commit label",
              "commit.type": "active",
              link: "githash",
            });
          }}
          to={getVersionRoute(id)}
        >
          {shortenGithash(revision)}
        </InlineCode>{" "}
        {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
      </Body>
      {upstreamProject && (
        <Body>
          Triggered by:{" "}
          <StyledRouterLink
            onClick={() => {
              sendEvent({
                name: "Clicked commit label",
                "commit.type": "active",
                link: "upstream project",
              });
            }}
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
      {/* @ts-expect-error */}
      <CommitMessage title={message}>
        <strong>{author}</strong> &bull;{" "}
        {jiraLinkify(message, jiraHost, () => {
          sendEvent({
            name: "Clicked commit label",
            "commit.type": "active",
            link: "jira",
          });
        })}
      </CommitMessage>
      {gitTags && <Body>Git Tags: {gitTags.map((g) => g.tag).join(", ")}</Body>}
    </VersionContainer>
  );
};

const VersionContainer = styled.div`
  flex-basis: 20%;

  > * {
    font-size: 12px;
    line-height: 1.3;
  }

  p {
    word-break: break-all;
  }
`;

const CommitMessage = styled(Body)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;
