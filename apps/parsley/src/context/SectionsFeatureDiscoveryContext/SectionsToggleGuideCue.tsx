import { useEffect, useState } from "react";
import { GuideCue, GuideCueProps } from "@leafygreen-ui/guide-cue";
import { useSectionsFeatureDiscoveryContext } from "context/SectionsFeatureDiscoveryContext";

export const SectionsToggleGuideCue: React.FC<{
  refEl: GuideCueProps["refEl"];
}> = ({ refEl }) => {
  const { closeFirstGuideCue, firstGuideCueOpen, setFirstGuideCueOpen } =
    useSectionsFeatureDiscoveryContext();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (firstGuideCueOpen) {
      const timeoutId = setTimeout(() => {
        setOpen(true);
      }, 200);
      return () => clearTimeout(timeoutId);
    }
    setOpen(false);
  }, [firstGuideCueOpen]);
  return (
    <GuideCue
      currentStep={1}
      data-cy="sections-cue-1"
      numberOfSteps={1}
      onPrimaryButtonClick={closeFirstGuideCue}
      open={open}
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
