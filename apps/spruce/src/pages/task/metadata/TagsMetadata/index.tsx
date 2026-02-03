import styled from "@emotion/styled";
import {
  Chip,
  Variant as ChipVariant,
  TruncationLocation,
} from "@leafygreen-ui/chip";
import { size } from "@evg-ui/lib/constants";
import MetadataCard, { MetadataCardTitle } from "components/MetadataCard";
import { Divider } from "components/styles/divider";

interface TagsMetadataProps {
  tags?: string[];
  failureMetadataTags?: string[];
}
const TagsMetadata: React.FC<TagsMetadataProps> = ({
  failureMetadataTags = [],
  tags = [],
}) => {
  const hasTags = tags.length > 0;
  const hasFailureMetadataTags = failureMetadataTags.length > 0;

  if (!hasTags && !hasFailureMetadataTags) {
    return null;
  }

  return (
    <MetadataCard>
      {hasTags && (
        <>
          <MetadataCardTitle weight="medium">Tags</MetadataCardTitle>
          <Divider />
          <TagsContainer>
            {tags.map((t) => (
              <Chip
                key={`tag-${t}`}
                chipCharacterLimit={30}
                chipTruncationLocation={TruncationLocation.End}
                label={t}
                variant={ChipVariant.Gray}
              />
            ))}
          </TagsContainer>
        </>
      )}

      {hasFailureMetadataTags && (
        <>
          <MetadataCardTitle weight="medium">
            Failure Metadata Tags
          </MetadataCardTitle>
          <Divider />
          <TagsContainer>
            {failureMetadataTags.map((t) => (
              <Chip
                key={`failure-tag-${t}`}
                chipCharacterLimit={30}
                chipTruncationLocation={TruncationLocation.End}
                label={t}
                variant={ChipVariant.Gray}
              />
            ))}
          </TagsContainer>
        </>
      )}
    </MetadataCard>
  );
};

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${size.xs};
  margin-bottom: ${size.xs};
`;

export default TagsMetadata;
