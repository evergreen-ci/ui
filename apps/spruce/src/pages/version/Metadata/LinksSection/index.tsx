import { StyledLink } from "@evg-ui/lib/components/styles";
import { MetadataItem, MetadataSection } from "components/MetadataCard";
import { VersionQuery } from "gql/generated/types";

type Version = NonNullable<VersionQuery["version"]>;

interface LinksSectionProps {
  version: Version;
}

export const LinksSection: React.FC<LinksSectionProps> = ({ version }) => {
  const { externalLinksForMetadata } = version;

  return (
    <MetadataSection title="External Links">
      {externalLinksForMetadata?.map(({ displayName, url }) => (
        <MetadataItem key={displayName}>
          <StyledLink data-cy="external-link" href={url}>
            {displayName}
          </StyledLink>
        </MetadataItem>
      ))}
    </MetadataSection>
  );
};
