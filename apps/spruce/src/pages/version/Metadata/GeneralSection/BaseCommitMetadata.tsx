import { InlineCode } from "@leafygreen-ui/typography";
import { shortenGithash } from "@evg-ui/lib/utils/string";
import { MetadataItem } from "components/MetadataCard";
import { RevisionLink } from "components/RevisionLink";
import { getVersionRoute } from "constants/routes";

interface BaseCommitMetadataProps {
  baseVersionId: string;
  isGithubMergePatch: boolean;
  onClick: () => void;
  revision: string;
}

const BaseCommitMetadata: React.FC<BaseCommitMetadataProps> = ({
  baseVersionId,
  isGithubMergePatch,
  onClick,
  revision,
}) => {
  const isBaseVersionPending = isGithubMergePatch && !baseVersionId;

  return (
    <MetadataItem label="Base version">
      {isBaseVersionPending ? (
        <InlineCode data-testid="patch-base-commit">
          {shortenGithash(revision)}
        </InlineCode>
      ) : (
        <RevisionLink
          data-testid="patch-base-commit"
          onClick={onClick}
          revision={revision}
          to={getVersionRoute(baseVersionId)}
        />
      )}
      {isBaseVersionPending && " (pending)"}
    </MetadataItem>
  );
};

export default BaseCommitMetadata;
