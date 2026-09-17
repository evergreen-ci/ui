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
  walkthroughSteps: WalkthroughStep[];
};

export interface WalkthroughGuideCueRef {
  restart: () => void;
}

export const WalkthroughGuideCue = forwardRef<
  WalkthroughGuideCueRef,
  WalkthroughGuideCueProps
>((props, ref) => {
  const { dataAttributeName, defaultOpen, onClose, walkthroughSteps } = props;
  const [active, setActive] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const targetRefs = useRef(
    walkthroughSteps.map(() => ({ current: null as HTMLElement | null })),
  );
  const openedControlRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => () => closeOpenedControl(), [closeOpenedControl]);

  useEffect(() => {
    if (!defaultOpen) {
      return;
    }

    const openWhenTargetExists = () => {
      const initialTarget = getTargetElement({
        dataAttributeName,
        targetId: walkthroughSteps[0].targetId,
      });
      if (!initialTarget) {
        return false;
      }

      targetRefs.current[0].current = initialTarget;
      setActive(true);
      return true;
    };

    if (openWhenTargetExists()) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (openWhenTargetExists()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [dataAttributeName, defaultOpen, walkthroughSteps]);

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
              beaconAlign={step.beaconAlign ?? Align.Center}
              referenceElement={targetRefs.current[i]}
              tooltipAlign={step.tooltipAlign ?? Align.Center}
              tooltipSide={step.tooltipSide ?? Side.Bottom}
            >
              <Text data-testid="walkthrough-guide-cue" slot="title">
                {step.title}
              </Text>
              <Text slot="content">{step.description}</Text>
              <Text slot="steps">
                {i + 1} of {walkthroughSteps.length}
              </Text>
              <Button onPress={onPrimaryButtonClick} slot="primary">
                {i + 1 === walkthroughSteps.length ? "Get started" : "Next"}
              </Button>
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
