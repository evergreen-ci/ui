import { GuideCue, GuideCueProps } from "@leafygreen-ui/guide-cue";
import { useSectionsFeatureDiscoveryContext } from ".";

export const JumpToFailingLineToggleGuideCue: React.FC<{
  refEl: GuideCueProps["refEl"];
}> = ({ refEl }) => {
  const { closeSecondGuideCue, secondGuideCueOpen, setSecondGuideCueOpen } =
    useSectionsFeatureDiscoveryContext();
  return (
    <GuideCue
      beaconAlign="right"
      data-cy="sections-cue-2"
      numberOfSteps={1}
      onPrimaryButtonClick={closeSecondGuideCue}
      open={secondGuideCueOpen}
      refEl={refEl}
      setOpen={setSecondGuideCueOpen}
      title="Jump to Failing Line"
    >
      Combined with sectioning, jump to failing line allows to streamline your
      failure triage process.
    </GuideCue>
  );
};
