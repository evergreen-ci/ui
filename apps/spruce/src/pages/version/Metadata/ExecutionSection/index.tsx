import { useVersionAnalytics } from "analytics";
import { CostSummary } from "components/CostSummary";
import { MetadataSection } from "components/MetadataCard";
import { VersionQuery } from "gql/generated/types";
import { ParametersModal } from "../../ParametersModal";
import { SkippedTestsMetadata } from "../SkippedTestsMetadata";

type Version = NonNullable<VersionQuery["version"]>;

interface ExecutionSectionProps {
  version: Version;
}

export const ExecutionSection: React.FC<ExecutionSectionProps> = ({
  version,
}) => {
  const {
    cost,
    id,
    parameters,
    projectMetadata,
    quarantinedTestsSkippedCount,
  } = version;
  const { sendEvent } = useVersionAnalytics(id);

  const hasParameters = parameters.length > 0;
  const totalCost = cost?.total;
  const hasCost = totalCost != null && totalCost > 0;
  const testSelectionEnabled = projectMetadata?.testSelection?.allowed ?? false;
  const hasSkippedTests =
    testSelectionEnabled && quarantinedTestsSkippedCount > 0;

  if (!hasCost && !hasParameters && !hasSkippedTests) {
    return null;
  }

  return (
    <MetadataSection title="Execution">
      {hasSkippedTests && (
        <SkippedTestsMetadata
          skippedTestsCount={quarantinedTestsSkippedCount}
          testSelectionEnabled={testSelectionEnabled}
          versionId={id}
        />
      )}
      {hasCost && (
        <CostSummary
          onClickDetailsButton={() =>
            sendEvent({ name: "Clicked version cost details button" })
          }
          totalCost={totalCost}
          type="version"
          version={version}
        />
      )}
      {hasParameters ? <ParametersModal parameters={parameters} /> : null}
    </MetadataSection>
  );
};
