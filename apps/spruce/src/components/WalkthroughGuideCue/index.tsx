import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Align,
  Button,
  GuideCue,
  GuideCueStep,
  Side,
  Text,
} from "@via-ds/components";
import { reportError } from "@evg-ui/lib/utils/errorReporting";
import styles from "./index.module.css";

export type WalkthroughStep = {
  title: string;
  description: string | React.ReactElement;
  targetId: string;
  shouldClick?: boolean;
  beaconAlign?: Align;
  tooltipAlign?: Align;
  tooltipSide?: Side;
};

export { Align, Side };

export type WalkthroughGuideCueProps = {
  dataAttributeName: string;
  defaultOpen: boolean;
  onClose: () => void;
  onCurrentTargetChange?: (targetId: string | null) => void;
  walkthroughSteps: WalkthroughStep[];
};

export interface WalkthroughGuideCueRef {
  restart: () => void;
}

export const WalkthroughGuideCue = forwardRef<
  WalkthroughGuideCueRef,
  WalkthroughGuideCueProps
>((props, ref) => {
  const {
    dataAttributeName,
    defaultOpen,
    onClose,
    onCurrentTargetChange,
    walkthroughSteps,
  } = props;
  const [active, setActive] = useState(defaultOpen);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const targetRefs = useRef(
    walkthroughSteps.map(() => ({ current: null as HTMLElement | null })),
  );
  const openedControlRef = useRef<HTMLElement | null>(null);
  const onCurrentTargetChangeRef = useRef(onCurrentTargetChange);
  const reportedTargetRef = useRef<string | null>(null);

  onCurrentTargetChangeRef.current = onCurrentTargetChange;

  const closeOpenedControl = useCallback(() => {
    openedControlRef.current?.click();
    openedControlRef.current = null;
  }, []);

  const endWalkthrough = () => {
    closeOpenedControl();
    onClose();
    setActive(false);
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
      ).warning();
      endWalkthrough();
      return;
    }
    targetRefs.current[nextStepIdx].current = nextTargetElement;
    closeOpenedControl();
    if (nextStep.shouldClick) {
      nextTargetElement.click();
      openedControlRef.current = nextTargetElement;
    }
    setCurrentStepIdx(nextStepIdx);
  };

  // Exposes a function via the ref to restart the walkthrough.
  useImperativeHandle(ref, () => ({
    restart: () => {
      setActive(true);
      goToNextStep(0);
    },
  }));

  const onPrimaryButtonClick = () => {
    const nextStepIdx = currentStepIdx + 1;
    if (nextStepIdx === walkthroughSteps.length) {
      endWalkthrough();
    } else {
      goToNextStep(nextStepIdx);
    }
  };

  const currentStep = walkthroughSteps[currentStepIdx];
  const currentTargetId = active ? currentStep.targetId : null;

  useEffect(() => {
    if (reportedTargetRef.current !== currentTargetId) {
      reportedTargetRef.current = currentTargetId;
      onCurrentTargetChangeRef.current?.(currentTargetId);
    }
  }, [currentTargetId]);

  useEffect(
    () => () => {
      closeOpenedControl();
      if (reportedTargetRef.current !== null) {
        reportedTargetRef.current = null;
        onCurrentTargetChangeRef.current?.(null);
      }
    },
    [closeOpenedControl],
  );

  useEffect(() => {
    walkthroughSteps.forEach((step, i) => {
      targetRefs.current[i].current = getTargetElement({
        dataAttributeName,
        targetId: step.targetId,
      });
    });
  }, [dataAttributeName, walkthroughSteps]);

  return (
    <>
      {active && (
        <GuideCue
          currentStep={currentStepIdx + 1}
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              endWalkthrough();
            }
          }}
        >
          {walkthroughSteps.map((step, i) => (
            <GuideCueStep
              key={step.targetId}
              beaconAlign={step.beaconAlign}
              referenceElement={targetRefs.current[i]}
              tooltipAlign={step.tooltipAlign}
              tooltipSide={step.tooltipSide}
            >
              <div slot="header">
                <Text data-testid="walkthrough-guide-cue" slot="title">
                  {step.title}
                </Text>
              </div>
              <Text slot="content">{step.description}</Text>
              <div slot="footer">
                <Text slot="steps">
                  {i + 1} of {walkthroughSteps.length}
                </Text>
                <Button onPress={onPrimaryButtonClick} slot="primary">
                  {i + 1 === walkthroughSteps.length ? "Get started" : "Next"}
                </Button>
              </div>
            </GuideCueStep>
          ))}
        </GuideCue>
      )}
      {active && (
        <div className={styles.backdrop} data-testid="walkthrough-backdrop" />
      )}
    </>
  );
});

WalkthroughGuideCue.displayName = "WalkthroughGuideCue";

const getTargetElement = ({
  dataAttributeName,
  targetId,
}: {
  dataAttributeName: string;
  targetId: string;
}) =>
  document.querySelector(`[${dataAttributeName}="${targetId}"]`) as HTMLElement;
