import { Align, InfoSprinkle, Side } from "@via-ds/components";
import { Body } from "@via-ds/components/typography";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { RevisionLink } from "components/RevisionLink";
import { getVersionRoute } from "constants/routes";
import { VersionTriggerInfoFragment } from "gql/generated/types";
import { useDateFormat } from "hooks";
import styles from "./BasedOnVersion.module.css";
import { CommitDescription } from "./CommitDescription";

const MAX_MESSAGE_LENGTH = 150;

type RepotrackerBaseVersion = NonNullable<
  VersionTriggerInfoFragment["repotrackerBaseVersion"]
>;

const BasedOnDetails: React.FC<{ basedOnVersion: RepotrackerBaseVersion }> = ({
  basedOnVersion,
}) => {
  const getDateCopy = useDateFormat();
  const { createTime, message, revision, user } = basedOnVersion;

  return (
    <div data-testid="based-on-version-tooltip">
      <strong>
        {shortenGithash(revision)} &middot;{" "}
        {getDateCopy(new Date(createTime), { omitSeconds: true })}
      </strong>
      <CommitDescription
        author={user.displayName ?? user.id}
        inline
        maxLength={MAX_MESSAGE_LENGTH}
        message={message}
      />
    </div>
  );
};

interface BasedOnVersionProps {
  isTrigger: boolean;
  onClick?: () => void;
  repotrackerBaseVersion: VersionTriggerInfoFragment["repotrackerBaseVersion"];
  showRepo?: boolean;
}

export const BasedOnVersion: React.FC<BasedOnVersionProps> = ({
  isTrigger,
  onClick,
  repotrackerBaseVersion: basedOnVersion,
  showRepo = false,
}) => {
  if (!isTrigger || !basedOnVersion) {
    return null;
  }

  return (
    <Body className={styles.basedOn} data-testid="based-on-version">
      <span>Based on</span>
      {showRepo && basedOnVersion.projectMetadata && (
        <span>
          {basedOnVersion.projectMetadata.owner}/
          {basedOnVersion.projectMetadata.repo}
        </span>
      )}
      <RevisionLink
        onClick={onClick}
        revision={basedOnVersion.revision}
        to={getVersionRoute(basedOnVersion.id)}
      />
      <InfoSprinkle
        align={Align.Start}
        aria-label="Show commit details of the version this is based on"
        side={Side.Top}
      >
        <BasedOnDetails basedOnVersion={basedOnVersion} />
      </InfoSprinkle>
    </Body>
  );
};
