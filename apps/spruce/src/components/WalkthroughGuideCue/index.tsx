import { useState, useRef } from "react";
import { GuideCue, GuideCueProps } from "@leafygreen-ui/guide-cue";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { reportError } from "utils/errorReporting";

export type WalkthroughStep = {
  title: string;
  description: string | React.ReactElement;
  dataTargetId: string;
};

type WalkthroughGuideCueProps = Pick<
  GuideCueProps,
  "enabled" | "open" | "setOpen"
> & {
  dataAttributeName: string;
  onClose: () => void;
  walkthroughSteps: WalkthroughStep[];
};

const getTargetElement = ({
  dataAttributeName,
  targetId,
}: {
  dataAttributeName: string;
  targetId: string;
}) =>
  document.querySelector(`[${dataAttributeName}="${targetId}"]`) as HTMLElement;

export const WalkthroughGuideCue: React.FC<WalkthroughGuideCueProps> = ({
  dataAttributeName,
  enabled,
  onClose,
  open,
  setOpen,
  walkthroughSteps,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStepRef = useRef<HTMLElement | null>(null);

  const endWalkthrough = () => {
    onClose();
    setOpen(false);
  };

  const goToNextStep = (nextStepIdx: number) => {
    const nextStep = walkthroughSteps[nextStepIdx];
    const nextTargetElement = getTargetElement({
      dataAttributeName,
      targetId: nextStep.dataTargetId,
    });
    if (!nextTargetElement) {
      // If we can't locate the next target element, abort the walkthrough. In theory this should
      // never happen.
      reportError(
        new Error(
          `Cannot find element for the next step in walkthrough: ${nextStep.dataTargetId}`,
        ),
      ).severe();
      return;
    }
    setCurrentStepIdx(nextStepIdx);
    setOpen(true);
  };

  const onPrimaryButtonClick = () => {
    const nextStepIdx = currentStepIdx + 1;
    if (nextStepIdx === walkthroughSteps.length) {
      endWalkthrough();
    } else {
      goToNextStep(nextStepIdx);
    }
  };

  const currentStep = walkthroughSteps[currentStepIdx];
  currentStepRef.current = getTargetElement({
    dataAttributeName,
    targetId: currentStep.dataTargetId,
  });

  return (
    <GuideCue
      buttonText={
        currentStepIdx + 1 === walkthroughSteps.length ? "Get started" : "Next"
      }
      currentStep={currentStepIdx + 1}
      data-cy="walkthrough-guide-cue"
      enabled={enabled}
      numberOfSteps={walkthroughSteps.length}
      onPrimaryButtonClick={onPrimaryButtonClick}
      open={open}
      popoverZIndex={zIndex.tooltip}
      refEl={currentStepRef}
      setOpen={setOpen}
      title={currentStep.title}
    >
      {currentStep.description}
    </GuideCue>
  );
};
