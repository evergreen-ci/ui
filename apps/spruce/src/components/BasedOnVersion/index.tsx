import { skipToken, useQuery } from "@apollo/client/react";
import { Align, InfoSprinkle, Side } from "@via-ds/components";
import { Body } from "@via-ds/components/typography";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { CommitDescription } from "components/CommitDescription";
import { RevisionLink } from "components/RevisionLink";
import { getVersionRoute } from "constants/routes";
import {
  VersionBasedOnQuery,
  VersionBasedOnQueryVariables,
} from "gql/generated/types";
import { VERSION_BASED_ON } from "gql/queries";
import { useDateFormat } from "hooks";
import styles from "./index.module.css";

const MAX_MESSAGE_LENGTH = 150;

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
  const getDateCopy = useDateFormat();

  const { data } = useQuery<VersionBasedOnQuery, VersionBasedOnQueryVariables>(
    VERSION_BASED_ON,
    isTrigger ? { variables: { versionId } } : skipToken,
  );

  const basedOnVersion = data?.version?.baseVersion;

  if (!isTrigger || !basedOnVersion) {
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
        aria-label="Show based on commit details"
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
