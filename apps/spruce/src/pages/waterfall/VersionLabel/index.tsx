import { Badge, BadgeVariant, Body, Link, Text } from "@via-ds/components";
import { cx } from "@evg-ui/lib/utils/css";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { useWaterfallAnalytics } from "analytics";
import { UpstreamProjectLink } from "components/UpstreamProjectLink";
import { Requester } from "constants/requesters";
import { getVersionRoute } from "constants/routes";
import { useDateFormat, useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";
import { TaskStatsTooltip } from "../TaskStatsTooltip";
import { Version } from "../types";
import styles from "./index.module.css";

export enum VersionLabelView {
  Modal = "modal",
  Waterfall = "waterfall",
}

type Props = Version & {
  className?: string;
  highlighted: boolean;
  isFirstVersion: boolean;
  shouldDisableText?: boolean;
  view: VersionLabelView;
};

export const VersionLabel: React.FC<Props> = ({
  activated,
  className,
  createTime,
  errors,
  gitTags,
  highlighted,
  id,
  isFirstVersion,
  message,
  requester,
  revision,
  shouldDisableText = false,
  user,
  view,
}) => {
  const getDateCopy = useDateFormat();
  const createDate = new Date(createTime);

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

  const { sendEvent } = useWaterfallAnalytics();

  const commitType = activated ? "active" : "inactive";

  return (
    <div
      className={cx(styles.versionContainer, className)}
      data-disabled={
        view !== VersionLabelView.Waterfall && !activated && shouldDisableText
      }
      data-highlighted={highlighted}
      data-testid={`version-label-${commitType}`}
      data-view={view}
    >
      <div className={styles.headerLine}>
        <Body>
          <Link
            href={getVersionRoute(id)}
            onClick={() => {
              sendEvent({
                name: "Clicked commit label",
                "commit.type": commitType,
                link: "githash",
              });
            }}
          >
            <Text textStyle="inlineCode">{shortenGithash(revision)}</Text>
          </Link>{" "}
          {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
          {commitType === "inactive" && (
            <Badge className={styles.badge} variant={BadgeVariant.Status}>
              Inactive
            </Badge>
          )}
          {errors.length > 0 && (
            <Badge className={styles.badge} variant={BadgeVariant.Error}>
              Broken
            </Badge>
          )}
        </Body>
        {view === VersionLabelView.Waterfall && (
          <TaskStatsTooltip id={id} isFirstVersion={isFirstVersion} />
        )}
      </div>
      <UpstreamProjectLink
        isTrigger={requester === Requester.Trigger}
        onClick={() => {
          sendEvent({
            name: "Clicked commit label",
            "commit.type": commitType,
            link: "upstream project",
          });
        }}
        versionId={id}
      />
      <Body
        className={styles.commitMessage}
        data-view={view}
        title={view === VersionLabelView.Waterfall ? message : undefined}
      >
        <strong>{user.displayName}</strong> &bull;{" "}
        {jiraLinkify(message, jiraHost, () => {
          sendEvent({
            name: "Clicked commit label",
            "commit.type": commitType,
            link: "jira",
          });
        })}
      </Body>
      {gitTags?.length ? (
        <Body>Git Tags: {gitTags.map((g) => g.tag).join(", ")}</Body>
      ) : null}
    </div>
  );
};
