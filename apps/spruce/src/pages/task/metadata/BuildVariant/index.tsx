import { StyledRouterLink, WordBreak } from "@evg-ui/lib/components/styles";
import { useTaskAnalytics } from "analytics";
import { CopyableID } from "components/CopyableID";
import MetadataCard, {
  MetadataItem,
  MetadataLabel,
  MetadataTitleWithLink,
} from "components/MetadataCard";
import { getAPIRouteForBuilds } from "constants/externalResources";
import { getVariantHistoryRoute } from "constants/routes";

interface Props {
  buildId: string;
  buildVariant: string;
  buildVariantDisplayName?: string;
  projectIdentifier?: string;
  taskName: string;
}

export const BuildVariantCard: React.FC<Props> = ({
  buildId,
  buildVariant,
  buildVariantDisplayName,
  projectIdentifier,
  taskName,
}) => {
  const taskAnalytics = useTaskAnalytics();

  return (
    <MetadataCard
      title={
        <MetadataTitleWithLink
          href={getAPIRouteForBuilds(buildId)}
          title="Build Variant"
        />
      }
    >
      <CopyableID textToCopy={buildId} tooltipLabel="Copy build variant ID" />
      <MetadataItem>
        <MetadataLabel>Identifier:</MetadataLabel>{" "}
        <WordBreak>{buildVariant}</WordBreak>
      </MetadataItem>
      <MetadataItem>
        <MetadataLabel>Name:</MetadataLabel>{" "}
        <WordBreak>{buildVariantDisplayName}</WordBreak>
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
