import { Align, InfoSprinkle, Side } from "@via-ds/components";
import { Body } from "@via-ds/components/typography";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { RevisionLink } from "components/RevisionLink";
import { getVersionRoute } from "constants/routes";
import { useDateFormat } from "hooks";
import styles from "./BasedOnVersion.module.css";
import { CommitDescription } from "./CommitDescription";
import { useVersionTriggerInfo } from "./useVersionTriggerInfo";

const MAX_MESSAGE_LENGTH = 150;

type RepotrackerBaseVersion = NonNullable<
  ReturnType<typeof useVersionTriggerInfo>["repotrackerBaseVersion"]
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
  showRepo?: boolean;
  versionId: string;
}

export const BasedOnVersion: React.FC<BasedOnVersionProps> = ({
  isTrigger,
  onClick,
  showRepo = false,
  versionId,
}) => {
  const { loading, repotrackerBaseVersion: basedOnVersion } =
    useVersionTriggerInfo(isTrigger, versionId);
  const isLoading = isTrigger && loading;

  if (!isTrigger || (!isLoading && !basedOnVersion)) {
    return null;
  }

  return (
    <Body
      className={styles.basedOn}
      data-testid={isLoading ? undefined : "based-on-version"}
    >
      <span>Based on</span>
      {showRepo && basedOnVersion?.projectMetadata && (
        <span>
          {basedOnVersion.projectMetadata.owner}/
          {basedOnVersion.projectMetadata.repo}
        </span>
      )}
      <RevisionLink
        isLoading={isLoading}
        onClick={onClick}
        revision={basedOnVersion?.revision}
        to={basedOnVersion ? getVersionRoute(basedOnVersion.id) : undefined}
      />
      <InfoSprinkle
        align={Align.Start}
        aria-label="Show commit details of the version this is based on"
        isDisabled={isLoading}
        side={Side.Top}
      >
        {basedOnVersion && <BasedOnDetails basedOnVersion={basedOnVersion} />}
      </InfoSprinkle>
    </Body>
  );
};
