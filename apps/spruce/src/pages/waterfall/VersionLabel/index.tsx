import { Badge, BadgeVariant, Body } from "@via-ds/components";
import { cx } from "@evg-ui/lib/utils/css";
import { useWaterfallAnalytics } from "analytics";
import {
  BasedOnVersion,
  CommitDescription,
  RepoLabel,
  TriggeredBy,
} from "components/CommitLabel";
import { RevisionLink } from "components/RevisionLink";
import { Requester } from "constants/requesters";
import { getVersionRoute } from "constants/routes";
import { useDateFormat } from "hooks";
import { getDisplayRevision } from "utils/string";
import { VERSION_LIMIT } from "../constants";
import { TaskStatsTooltip } from "../TaskStatsTooltip";
import { Version } from "../types";
import styles from "./index.module.css";

const MODAL_MAX_MESSAGE_LENGTH = 150;

export enum VersionLabelView {
  Modal = "modal",
  Waterfall = "waterfall",
}

type Props = {
  className?: string;
  highlighted: boolean;
  isFirstVersion?: boolean;
  shouldDisableText?: boolean;
  version: Version;
  view: VersionLabelView;
};

export const VersionLabel: React.FC<Props> = ({
  className,
  highlighted,
  isFirstVersion = false,
  shouldDisableText = false,
  version,
  view,
}) => {
  const {
    activated,
    createTime,
    errors,
    gitTags,
    id,
    message,
    requester,
    upstreamProject,
    user,
  } = version;
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

  const containerProps = {
    className: cx(styles.versionContainer, className),
    "data-highlighted": highlighted,
    "data-testid": `version-label-${commitType}`,
    "data-view": view,
    style: {
      "--waterfall-version-count": VERSION_LIMIT,
    } as React.CSSProperties,
  };

  const dateAndBadges = (
    <span className={styles.flexRow}>
      <Body className={styles.date}>
        {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
      </Body>
      {commitType === "inactive" && (
        <Badge variant={BadgeVariant.Status}>Inactive</Badge>
      )}
      {errors.length > 0 && <Badge variant={BadgeVariant.Error}>Broken</Badge>}
    </span>
  );

  const revisionLink = (
    <RevisionLink
      onClick={() => {
        sendEvent({
          name: "Clicked commit label",
          "commit.type": commitType,
          link: "githash",
        });
      }}
      revision={getDisplayRevision(version)}
      to={getVersionRoute(id)}
    />
  );

  const handleTriggeredByClick = () => {
    sendEvent({
      name: "Clicked commit label",
      "commit.type": commitType,
      link: "upstream project",
    });
  };

  const gitTagsLabel = gitTags?.length ? (
    <Body>Git Tags: {gitTags.map((g) => g.tag).join(", ")}</Body>
  ) : null;

  if (view === VersionLabelView.Waterfall) {
    const isTrigger = requester === Requester.Trigger;

    return (
      <div {...containerProps}>
        <div className={styles.headerLine}>
          {dateAndBadges}
          <TaskStatsTooltip id={id} isFirstVersion={isFirstVersion} />
        </div>
        <div className={styles.hashRow}>
          {revisionLink}
          <BasedOnVersion
            baseVersion={upstreamProject?.baseVersion}
            showSeparator
          />
        </div>
        <TriggeredBy
          onClick={handleTriggeredByClick}
          upstreamProject={upstreamProject}
        />
        <CommitDescription
          author={user.displayName ?? user.userId}
          className={styles.description}
          inline
          lineClamp={isTrigger ? 2 : 3}
          maxLength={Infinity}
          message={message}
          onJiraLinkClick={handleJiraLinkClick}
          onToggle={(expanded) =>
            sendEvent({ name: "Toggled commit description", expanded })
          }
          title={message}
        />
        {gitTagsLabel}
      </div>
    );
  }

  return (
    <div {...containerProps} data-disabled={!activated && shouldDisableText}>
      <div className={styles.headerLine}>{dateAndBadges}</div>
      <div className={styles.hashRow}>
        {revisionLink}
        <RepoLabel version={version} />
        <TriggeredBy
          onClick={handleTriggeredByClick}
          showSeparator
          upstreamProject={upstreamProject}
        />
      </div>
      <CommitDescription
        author={user.displayName ?? user.userId}
        inline
        maxLength={MODAL_MAX_MESSAGE_LENGTH}
        message={message}
        onJiraLinkClick={handleJiraLinkClick}
        onToggle={(expanded) =>
          sendEvent({ name: "Toggled commit description", expanded })
        }
        title={message}
      />
      {gitTagsLabel}
    </div>
  );
};
