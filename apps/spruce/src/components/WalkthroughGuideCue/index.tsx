import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  GuideCue,
  GuideCueStep,
  GuideCueTooltip,
} from "@via-ds/components/guide-cue";
import { Align, Side } from "@via-ds/components/types";
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
>(({ dataAttributeName, defaultOpen, onClose, walkthroughSteps }, ref) => {
  const [open, setOpen] = useState(defaultOpen);
  const [active, setActive] = useState(defaultOpen);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const stepRefs = useRef<Array<React.RefObject<HTMLElement | null>>>([]);
  if (stepRefs.current.length !== walkthroughSteps.length) {
    stepRefs.current = walkthroughSteps.map(
      () => ({ current: null }) as React.RefObject<HTMLElement | null>,
    );
  }

  // Update refs when the DOM is ready
  useEffect(() => {
    walkthroughSteps.forEach((step, idx) => {
      const el = getTargetElement({
        dataAttributeName,
        targetId: step.targetId,
      });
      if (el) {
        stepRefs.current[idx] = { current: el };
      }
    });
  }, [dataAttributeName, walkthroughSteps]);

  // Exposes a function via the ref to restart the walkthrough.
  useImperativeHandle(ref, () => ({
    restart: () => {
      setActive(true);
      setCurrentStepIdx(0);
      setOpen(true);
    },
  }));

  return (
    <>
      <GuideCue
        currentStep={currentStepIdx + 1}
        data-testid="walkthrough-guide-cue"
        isOpen={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            onClose();
            setActive(false);
          }
          setOpen(nextOpen);
        }}
      >
        {walkthroughSteps.map((step, idx) => (
          <GuideCueStep
            key={step.targetId}
            beaconAlign={step.beaconAlign ?? Align.Center}
            referenceElement={stepRefs.current[idx]}
            tooltipAlign={step.tooltipAlign ?? Align.Center}
            tooltipSide={step.tooltipSide ?? Side.Top}
          >
            <GuideCueTooltip
              bodyId={`walkthrough-body-${idx}`}
              titleId={`walkthrough-title-${idx}`}
            >
              {step.description}
            </GuideCueTooltip>
          </GuideCueStep>
        ))}
      </GuideCue>
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
