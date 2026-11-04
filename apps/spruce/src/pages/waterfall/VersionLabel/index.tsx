import { Badge, BadgeVariant, Body } from "@via-ds/components";
import { cx } from "@evg-ui/lib/utils/css";
import { useWaterfallAnalytics } from "analytics";
import { CommitDescription } from "components/CommitDescription";
import { CommitSource } from "components/CommitSource";
import { Requester } from "constants/requesters";
import { getVersionRoute } from "constants/routes";
import { useDateFormat } from "hooks";
import { VERSION_LIMIT } from "../constants";
import { TaskStatsTooltip } from "../TaskStatsTooltip";
import { Version } from "../types";
import styles from "./index.module.css";

const MODAL_MAX_MESSAGE_LENGTH = 150;

export enum VersionLabelView {
  Modal = "modal",
  Waterfall = "waterfall",
}

type Props = Version & {
  className?: string;
  highlighted: boolean;
  isFirstVersion?: boolean;
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
  isFirstVersion = false,
  message,
  projectMetadata,
  requester,
  revision,
  shouldDisableText = false,
  user,
  view,
}) => {
  const getDateCopy = useDateFormat();
  const createDate = new Date(createTime);

  const { sendEvent } = useWaterfallAnalytics();
  const handleJiraLinkClick = () => {
    sendEvent({
      name: "Clicked commit label",
      "commit.type": commitType,
      link: "jira",
    });
  };

  const commitType = activated ? "active" : "inactive";
  const isWaterfall = view === VersionLabelView.Waterfall;
  const isTrigger = requester === Requester.Trigger;

  return (
    <div
      className={cx(styles.versionContainer, className)}
      data-disabled={!isWaterfall && !activated && shouldDisableText}
      data-highlighted={highlighted}
      data-testid={`version-label-${commitType}`}
      data-view={view}
      style={
        {
          "--waterfall-version-count": VERSION_LIMIT,
        } as React.CSSProperties
      }
    >
      <div className={styles.headerLine}>
        <span className={styles.flexRow}>
          <Body className={styles.date}>
            {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
          </Body>
          {commitType === "inactive" && (
            <Badge variant={BadgeVariant.Status}>Inactive</Badge>
          )}
          {errors.length > 0 && (
            <Badge variant={BadgeVariant.Error}>Broken</Badge>
          )}
        </span>
        {isWaterfall && (
          <TaskStatsTooltip id={id} isFirstVersion={isFirstVersion} />
        )}
      </div>
      <CommitSource
        hashHref={getVersionRoute(id)}
        isTrigger={isTrigger}
        onHashClick={() => {
          sendEvent({
            name: "Clicked commit label",
            "commit.type": commitType,
            link: "githash",
          });
        }}
        onModuleClick={() => {
          sendEvent({
            name: "Clicked commit label",
            "commit.type": commitType,
            link: "upstream project",
          });
        }}
        repo={isWaterfall ? undefined : projectMetadata}
        revision={revision}
        versionId={id}
      />
      <CommitDescription
        author={user.displayName ?? user.userId}
        className={styles.commitMessage}
        inline
        maxLength={isWaterfall ? Infinity : MODAL_MAX_MESSAGE_LENGTH}
        message={message}
        onJiraLinkClick={handleJiraLinkClick}
        onToggle={(expanded) =>
          sendEvent({ name: "Toggled commit description", expanded })
        }
        title={message}
      />
      {gitTags?.length ? (
        <Body>Git Tags: {gitTags.map((g) => g.tag).join(", ")}</Body>
      ) : null}
    </div>
  );
};
