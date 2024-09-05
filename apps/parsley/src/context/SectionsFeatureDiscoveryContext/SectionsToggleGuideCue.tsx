import { GuideCue, GuideCueProps } from "@leafygreen-ui/guide-cue";
import { useSectionsFeatureDiscoveryContext } from "context/SectionsFeatureDiscoveryContext";
import { releaseSectioning } from "utils/featureFlag";

export const SectionsToggleGuideCue: React.FC<{
  refEl: GuideCueProps["refEl"];
}> = ({ refEl }) => {
  const { closeFirstGuideCue, isOpenFirstGuideCue, setIsOpenFirstGuideCue } =
    useSectionsFeatureDiscoveryContext();
  return releaseSectioning ? (
    <GuideCue
      currentStep={1}
      data-cy="sections-cue-1"
      numberOfSteps={1}
      onPrimaryButtonClick={closeFirstGuideCue}
      open={isOpenFirstGuideCue}
      refEl={refEl}
      setOpen={setIsOpenFirstGuideCue}
      title="Opt-In to Sectioned Task Logs"
      tooltipAlign="bottom"
      tooltipJustify="end"
    >
      This beta feature is now available for task logs. Please send over any
      feedback to the #ask-devprod-evergreen channel.
    </GuideCue>
  ) : null;
};
