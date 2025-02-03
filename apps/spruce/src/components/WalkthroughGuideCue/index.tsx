import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import styled from "@emotion/styled";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import { zIndex } from "@evg-ui/lib/constants/tokens";
import { reportError } from "utils/errorReporting";

export type WalkthroughStep = {
  title: string;
  description: string | React.ReactElement;
  targetId: string;
  shouldClick?: boolean;
};

export type WalkthroughGuideCueProps = {
  dataAttributeName: string;
  defaultOpen: boolean;
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

export interface WalkthroughGuideCueRef {
  restart: () => void;
}

export const WalkthroughGuideCue = forwardRef<
  WalkthroughGuideCueRef,
  WalkthroughGuideCueProps
>(({ dataAttributeName, defaultOpen, onClose, walkthroughSteps }, ref) => {
  const [open, setOpen] = useState(defaultOpen);
  const [active, setActive] = useState(defaultOpen);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStepRef = useRef<HTMLElement | null>(null);

  // Exposes a function via the ref to restart the walkthrough.
  useImperativeHandle(ref, () => ({
    restart: () => {
      setActive(true);
      goToNextStep(0);
    },
  }));

  const endWalkthrough = () => {
    onClose();
    setActive(false);
    setOpen(false);
  };

  const goToNextStep = (nextStepIdx: number) => {
    const nextStep = walkthroughSteps[nextStepIdx];
    const nextTargetElement = getTargetElement({
      dataAttributeName,
      targetId: nextStep.targetId,
    });
    if (!nextTargetElement) {
      // If we can't locate the next target element, abort the walkthrough. In theory this should
      // never happen.
      reportError(
        new Error(
          `Cannot find element for the next step in walkthrough: ${nextStep.targetId}`,
        ),
      ).severe();
      return;
    }
    if (nextStep.shouldClick) {
      nextTargetElement.click();
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
    targetId: currentStep.targetId,
  });

  return (
    <>
      <GuideCue
        buttonText={
          currentStepIdx + 1 === walkthroughSteps.length
            ? "Get started"
            : "Next"
        }
        currentStep={currentStepIdx + 1}
        data-cy="walkthrough-guide-cue"
        numberOfSteps={walkthroughSteps.length}
        onDismiss={() => {
          onClose();
          setActive(false);
        }}
        onPrimaryButtonClick={onPrimaryButtonClick}
        open={open}
        popoverZIndex={zIndex.tooltip}
        refEl={currentStepRef}
        setOpen={setOpen}
        title={currentStep.title}
      >
        {currentStep.description}
      </GuideCue>
      {active && <Backdrop data-cy="walkthrough-backdrop" />}
    </>
  );
});

const Backdrop = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  z-index: 10;
  background: rgba(0, 0, 0, 0.15);
`;
