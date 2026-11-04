import { skipToken, useQuery } from "@apollo/client/react";
import { Align, InfoSprinkle, Side } from "@via-ds/components";
import { Body } from "@via-ds/components/typography";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { RevisionLink } from "components/RevisionLink";
import { getVersionRoute } from "constants/routes";
import {
  VersionBasedOnQuery,
  VersionBasedOnQueryVariables,
} from "gql/generated/types";
import { VERSION_BASED_ON } from "gql/queries";
import { useDateFormat, useSpruceConfig } from "hooks";
import { jiraLinkify } from "utils/string";
import styles from "./index.module.css";

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
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host ?? "";

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
      Based on{" "}
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
            {shortenGithash(revision)} &bull;{" "}
            {getDateCopy(new Date(createTime), { omitSeconds: true })}
          </strong>
          <div>
            <strong>{user.displayName}</strong> &bull;{" "}
            {jiraLinkify(`${message.slice(0, 150)}...`, jiraHost)}
          </div>
        </div>
      </InfoSprinkle>
    </Body>
  );
};
