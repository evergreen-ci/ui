import { GuideCue, GuideCueProps } from "@leafygreen-ui/guide-cue";
import { releaseSectioning } from "utils/featureFlag";
import { useSectionsFeatureDiscoveryContext } from ".";

export const JumpToFailingLineToggleGuideCue: React.FC<{
  refEl: GuideCueProps["refEl"];
}> = ({ refEl }) => {
  const { closeSecondGuideCue, isOpenSecondGuideCue, setIsOpenSecondGuideCue } =
    useSectionsFeatureDiscoveryContext();
  return releaseSectioning ? (
    <GuideCue
      beaconAlign="right"
      data-cy="sections-cue-2"
      numberOfSteps={1}
      onPrimaryButtonClick={closeSecondGuideCue}
      open={isOpenSecondGuideCue}
      refEl={refEl}
      setOpen={setIsOpenSecondGuideCue}
      title="Jump to Failing Line"
    >
      Combined with sectioning, jump to failing line allows to streamline your
      failure triage process.
    </GuideCue>
  ) : null;
};
