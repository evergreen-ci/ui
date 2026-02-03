import { StyledLink } from "@evg-ui/lib/components";
import { MetadataItem } from "components/MetadataCard";
import { Manifest } from "gql/generated/types";
import { omitTypename } from "utils/object";

interface Props {
  manifest: Manifest;
}

const ManifestBlob: React.FC<Props> = ({ manifest }) => {
  const cleanedManifest = omitTypename(manifest);
  const blob = new Blob([JSON.stringify(cleanedManifest, null, 3)], {
    type: "text/json",
  });
  return (
    <MetadataItem>
      <StyledLink
        data-cy="manifest-link"
        href={URL.createObjectURL(blob)}
        target="__blank"
      >
        Version Manifest
      </StyledLink>
    </MetadataItem>
  );
};

export default ManifestBlob;
