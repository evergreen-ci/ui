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

type RepotrackerBaseVersion =
  VersionTriggerInfoFragment["repotrackerBaseVersion"];

interface BasedOnVersionProps {
  onClick?: () => void;
  repotrackerBaseVersion: RepotrackerBaseVersion;
  showRepo?: boolean;
}

export const BasedOnVersion: React.FC<BasedOnVersionProps> = ({
  onClick,
  repotrackerBaseVersion: basedOnVersion,
  showRepo = false,
}) => {
  const getDateCopy = useDateFormat();

  if (!basedOnVersion) {
    return null;
  }

  const { createTime, id, message, projectMetadata, revision, user } =
    basedOnVersion;

  return (
    <Body className={styles.basedOn} data-testid="based-on-version">
      <span>Based on</span>
      {showRepo && projectMetadata && (
        <span>
          {projectMetadata.owner}/{projectMetadata.repo}
        </span>
      )}
      <RevisionLink
        onClick={onClick}
        revision={revision}
        to={getVersionRoute(id)}
      />
      <InfoSprinkle
        align={Align.Start}
        aria-label="Show commit details of the version this is based on"
        side={Side.Top}
      >
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
      </InfoSprinkle>
    </Body>
  );
};
