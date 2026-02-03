import styled from "@emotion/styled";
import { StyledRouterLink, WordBreak } from "@evg-ui/lib/components";
import { size } from "@evg-ui/lib/constants";
import { useTaskAnalytics } from "analytics";
import MetadataCard, {
  MetadataItem,
  MetadataLabel,
} from "components/MetadataCard";
import { getVariantHistoryRoute } from "constants/routes";
import { CopyButton } from "./CopyButton";

interface Props {
  projectIdentifier?: string;
  buildVariantDisplayName?: string;
  buildVariant: string;
  taskName: string;
}

export const BuildVariantCard: React.FC<Props> = ({
  buildVariant,
  buildVariantDisplayName,
  projectIdentifier,
  taskName,
}) => {
  const taskAnalytics = useTaskAnalytics();

  return (
    <MetadataCard title="Build Variant">
      <MetadataItem>
        <MetadataLabel>Name:</MetadataLabel>{" "}
        <WordBreak>{buildVariantDisplayName}</WordBreak>
      </MetadataItem>
      <MetadataItem>
        <IDWrapper>
          <LabelWrapper>
            <StyledMetadataLabel>ID:</StyledMetadataLabel>
            <WordBreak>{buildVariant}</WordBreak>
          </LabelWrapper>
          <CopyButton
            textToCopy={buildVariant}
            tooltipLabel="Copy build variant ID"
          />
        </IDWrapper>
      </MetadataItem>
      {projectIdentifier && (
        <MetadataItem>
          <StyledRouterLink
            onClick={() =>
              taskAnalytics.sendEvent({
                name: "Clicked metadata link",
                "link.type": "build variant history link",
              })
            }
            to={getVariantHistoryRoute(projectIdentifier, buildVariant, {
              visibleColumns: [taskName],
            })}
          >
            View Build Variant history
          </StyledRouterLink>
        </MetadataItem>
      )}
    </MetadataCard>
  );
};

const StyledMetadataLabel = styled(MetadataLabel)`
  flex-shrink: 0;
`;

const IDWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;

const LabelWrapper = styled.span`
  display: flex;
  align-items: start;
  gap: ${size.xxs};
`;
