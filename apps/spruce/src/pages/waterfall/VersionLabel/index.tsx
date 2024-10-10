import styled from "@emotion/styled";
import { Body, InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { Unpacked } from "@evg-ui/lib/types/utils";
import { useWaterfallAnalytics } from "analytics";
import { StyledRouterLink, wordBreakCss } from "components/styles";
import { getVersionRoute, getTriggerRoute } from "constants/routes";
import { WaterfallQuery } from "gql/generated/types";
import { useSpruceConfig, useDateFormat } from "hooks";
import { shortenGithash, jiraLinkify } from "utils/string";
import { columnBasis } from "../styles";
import { InactiveBadge } from "./InactiveBadge";

type VersionFields = NonNullable<
  Unpacked<WaterfallQuery["waterfall"]["versions"]>["version"]
>;

type Props = VersionFields & {
  className?: string;
  trimMessage?: boolean;
  size?: "small" | "default";
};

export const VersionLabel: React.FC<Props> = ({
  activated,
  author,
  className,
  createTime,
  gitTags,
  id,
  message,
  revision,
  size = "default",
  trimMessage = true,
  upstreamProject,
}) => {
  const getDateCopy = useDateFormat();
  const createDate = new Date(createTime);

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

  const { sendEvent } = useWaterfallAnalytics();

  const commitType = activated ? "active" : "inactive";

  return (
    <VersionContainer className={className} size={size}>
      <Body>
        <InlineCode
          as={Link}
          onClick={() => {
            sendEvent({
              name: "Clicked commit label",
              "commit.type": commitType,
              link: "githash",
            });
          }}
          to={getVersionRoute(id)}
        >
          {shortenGithash(revision)}
        </InlineCode>{" "}
        {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
        {commitType === "inactive" && <InactiveBadge />}
      </Body>
      {upstreamProject && (
        <Body>
          Triggered by:{" "}
          <StyledRouterLink
            onClick={() => {
              sendEvent({
                name: "Clicked commit label",
                "commit.type": commitType,
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
      <CommitMessage
        title={trimMessage ? message : null}
        trimMessage={trimMessage}
      >
        <strong>{author}</strong> &bull;{" "}
        {jiraLinkify(message, jiraHost, () => {
          sendEvent({
            name: "Clicked commit label",
            "commit.type": commitType,
            link: "jira",
          });
        })}
      </CommitMessage>
      {gitTags && <Body>Git Tags: {gitTags.map((g) => g.tag).join(", ")}</Body>}
    </VersionContainer>
  );
};

const VersionContainer = styled.div<{ size?: "small" | "default" }>`
  ${columnBasis}

  ${(props) => {
    if (props.size === "small") {
      return `
          > * {
            font-size: 12px;
            line-height: 1.3;
          }
        `;
    }
  }}

  p {
    ${wordBreakCss}
  }
`;

const CommitMessage = styled(Body)<{ trimMessage: boolean }>`
  ${(props) =>
    props.trimMessage &&
    `
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    `}
`;
