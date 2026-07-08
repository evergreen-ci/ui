import MetadataCard, {
  MetadataTitleWithAPILink,
} from "components/MetadataCard";
import { getAPIRouteForVersions } from "constants/externalResources";
import { VersionQuery } from "gql/generated/types";
import { ExecutionSection } from "./ExecutionSection";
import { GeneralSection } from "./GeneralSection";
import { LinksSection } from "./LinksSection";
import { TimelineSection } from "./TimelineSection";

interface MetadataProps {
  version: NonNullable<VersionQuery["version"]>;
}

export const Metadata: React.FC<MetadataProps> = ({ version }) => {
  const { id, isPatch } = version;

  return (
    <MetadataCard
      title={
        <MetadataTitleWithAPILink
          href={getAPIRouteForVersions(id)}
          title={isPatch ? "Patch Metadata" : "Version Metadata"}
        />
      }
    >
      <GeneralSection version={version} />
      <TimelineSection version={version} />
      <ExecutionSection version={version} />
      <LinksSection version={version} />
    </MetadataCard>
  );
};
