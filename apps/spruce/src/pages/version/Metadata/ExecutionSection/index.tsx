import { useVersionAnalytics } from "analytics";
import { CostSummary } from "components/CostSummary";
import { MetadataSection } from "components/MetadataCard";
import { VersionQuery } from "gql/generated/types";
import { ParametersModal } from "../../ParametersModal";

type Version = NonNullable<VersionQuery["version"]>;

interface ExecutionSectionProps {
  version: Version;
}

export const ExecutionSection: React.FC<ExecutionSectionProps> = ({
  version,
}) => {
  const { id, parameters } = version;
  const { sendEvent } = useVersionAnalytics(id);

  const hasParameters = parameters.length > 0;

  return (
    <MetadataSection title="Execution">
      <CostSummary
        onClickDetailsButton={() =>
          sendEvent({ name: "Clicked version cost details button" })
        }
        type="version"
        version={version}
      />
      {hasParameters ? <ParametersModal parameters={parameters} /> : null}
    </MetadataSection>
  );
};
