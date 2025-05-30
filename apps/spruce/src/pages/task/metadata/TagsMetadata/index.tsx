import styled from "@emotion/styled";
import {
  Chip,
  Variant as ChipVariant,
  TruncationLocation,
} from "@leafygreen-ui/chip";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import MetadataCard from "components/MetadataCard";
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

  const isFailureMetadataTagsOnly = !hasTags && hasFailureMetadataTags;
  const title = isFailureMetadataTagsOnly ? "Failure Metadata Tags" : "Tags";

  return (
    <MetadataCard>
      {hasTags && (
        <div>
          <Title weight="medium">Tags</Title>
          <Divider />
        </div>
      )}
      {hasTags && (
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
      )}

      {hasFailureMetadataTags && (
        <div>
          <Title weight="medium">Failure Metadata Tags</Title>
          <Divider />
        </div>
      )}
      {hasFailureMetadataTags && (
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
      )}
    </MetadataCard>
  );
};

const Title = styled(Body)<BodyProps>`
  font-size: 15px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${size.xs};
  margin-bottom: ${size.xs};
`;

export default TagsMetadata;
