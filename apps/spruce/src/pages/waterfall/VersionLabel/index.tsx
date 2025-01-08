import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { Theme } from "@leafygreen-ui/lib";
import { color } from "@leafygreen-ui/tokens";
import { Body, InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { wordBreakCss, StyledRouterLink } from "@evg-ui/lib/components/styles";
import { size as sizeToken } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics";
import { getVersionRoute, getTriggerRoute } from "constants/routes";
import { WaterfallVersionFragment } from "gql/generated/types";
import { useSpruceConfig, useDateFormat } from "hooks";
import { shortenGithash, jiraLinkify } from "utils/string";
import { columnBasis } from "../styles";
import { TaskStatsTooltip } from "../TaskStatsTooltip";

export enum VersionLabelView {
  Modal = "modal",
  Waterfall = "waterfall",
}

type Props = WaterfallVersionFragment & {
  className?: string;
  highlighted: boolean;
  shouldDisableText?: boolean;
  view: VersionLabelView;
};

export const VersionLabel: React.FC<Props> = ({
  activated,
  author,
  className,
  createTime,
  errors,
  gitTags,
  highlighted,
  id,
  message,
  revision,
  shouldDisableText = false,
  taskStatusStats,
  upstreamProject,
  view,
}) => {
  const getDateCopy = useDateFormat();
  const createDate = new Date(createTime);

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

  const { sendEvent } = useWaterfallAnalytics();

  const commitType = activated ? "active" : "inactive";

  return (
    <VersionContainer
      activated={activated}
      className={className}
      data-cy={`version-label-${commitType}`}
      data-highlighted={highlighted}
      highlighted={highlighted}
      shouldDisableText={shouldDisableText}
      view={view}
    >
      <HeaderLine>
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
          {commitType === "inactive" && (
            <StyledBadge variant={Variant.LightGray}>Inactive</StyledBadge>
          )}
          {errors.length > 0 && (
            <StyledBadge variant={Variant.Red}>Broken</StyledBadge>
          )}
        </Body>
        {view === VersionLabelView.Waterfall && !!taskStatusStats && (
          <TaskStatsTooltip taskStatusStats={taskStatusStats} />
        )}
      </HeaderLine>
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
        title={view === VersionLabelView.Waterfall ? message : null}
        view={view}
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

const VersionContainer = styled.div<
  Pick<WaterfallVersionFragment, "activated"> &
    Pick<Props, "shouldDisableText" | "view"> & { highlighted: boolean }
>`
  ${columnBasis}
  ${({ activated, shouldDisableText, view }) =>
    view === VersionLabelView.Waterfall
      ? `
          div, p {
            font-size: 12px;
            line-height: 1.3;
          }
    `
      : !activated &&
        shouldDisableText &&
        `> * {
      color: ${color[Theme.Light].text.disabled.default};}`}

  p {
    ${wordBreakCss}
  }
  ${({ highlighted }) =>
    highlighted &&
    `background-color: ${color[Theme.Light].background.primary.focus};`}
`;

const CommitMessage = styled(Body)<Pick<Props, "view">>`
  ${({ view }) =>
    view === VersionLabelView.Waterfall &&
    `
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    `}
`;

const StyledBadge = styled(Badge)`
  margin-left: ${sizeToken.xs};
`;

const HeaderLine = styled.div`
  align-items: center;
  display: flex;
  > p {
    flex-grow: 1;
  }
`;
