import { InlineDefinition } from "@leafygreen-ui/inline-definition";
import { Body } from "@via-ds/components/typography";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { RevisionLink } from "components/RevisionLink";
import { getVersionRoute } from "constants/routes";
import { VersionTriggerInfoFragment } from "gql/generated/types";
import { useDateFormat } from "hooks";
import styles from "./BasedOnVersion.module.css";
import { CommitDescription } from "./CommitDescription";

type UpstreamProjectBaseVersion = NonNullable<
  VersionTriggerInfoFragment["upstreamProject"]
>["baseVersion"];

interface BasedOnVersionProps {
  onClick?: () => void;
  baseVersion: UpstreamProjectBaseVersion;
  showRepo?: boolean;
}

export const BasedOnVersion: React.FC<BasedOnVersionProps> = ({
  baseVersion: basedOnVersion,
  onClick,
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
      <InlineDefinition
        data-testid="based-on-version-tooltip"
        definition={
          <>
            <strong className={styles.definitionHeader}>
              {shortenGithash(revision)} &middot;{" "}
              {getDateCopy(new Date(createTime), { omitSeconds: true })}
            </strong>
            <CommitDescription
              author={user.displayName ?? user.id}
              className={styles.definitionDescription}
              inline
              message={message}
            />
          </>
        }
      >
        <RevisionLink
          onClick={onClick}
          revision={revision}
          to={getVersionRoute(id)}
        />
      </InlineDefinition>
    </Body>
  );
};
