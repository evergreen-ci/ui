import { StyledRouterLink, WordBreak } from "@evg-ui/lib/components/styles";
import { useTaskAnalytics } from "analytics";
import { CopyableID } from "components/CopyableID";
import MetadataCard, {
  MetadataItem,
  MetadataLabel,
} from "components/MetadataCard";
import { getVariantHistoryRoute } from "constants/routes";

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
      <CopyableID
        textToCopy={buildVariant}
        tooltipLabel="Copy build variant ID"
      />
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
