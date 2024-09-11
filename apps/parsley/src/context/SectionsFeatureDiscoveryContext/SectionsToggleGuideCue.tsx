import { GuideCue, GuideCueProps } from "@leafygreen-ui/guide-cue";
import { useSectionsFeatureDiscoveryContext } from "context/SectionsFeatureDiscoveryContext";

export const SectionsToggleGuideCue: React.FC<{
  refEl: GuideCueProps["refEl"];
}> = ({ refEl }) => {
  const { closeFirstGuideCue, firstGuideCueOpen, setFirstGuideCueOpen } =
    useSectionsFeatureDiscoveryContext();
  return (
    <GuideCue
      currentStep={1}
      data-cy="sections-cue-1"
      numberOfSteps={1}
      onPrimaryButtonClick={closeFirstGuideCue}
      open={firstGuideCueOpen}
      refEl={refEl}
      setOpen={setFirstGuideCueOpen}
      title="Opt-In to Sectioned Task Logs"
      tooltipAlign="bottom"
      tooltipJustify="end"
    >
      This beta feature is now available for task logs. Please send over any
      feedback to the #ask-devprod-evergreen channel.
    </GuideCue>
  );
};
