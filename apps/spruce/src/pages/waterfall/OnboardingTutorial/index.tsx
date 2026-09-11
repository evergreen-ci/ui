import Cookies from "js-cookie";
import {
  WalkthroughGuideCue,
  WalkthroughGuideCueRef,
} from "components/WalkthroughGuideCue";
import { SEEN_WATERFALL_ONBOARDING_TUTORIAL } from "constants/cookies";
import { walkthroughSteps, waterfallGuideId } from "../constants";

type OnboardingTutorialProps = {
  guideCueRef: React.RefObject<WalkthroughGuideCueRef>;
  onCurrentStepChange: (targetId: string | null) => void;
};

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  guideCueRef,
  onCurrentStepChange,
}) => (
  <WalkthroughGuideCue
    ref={guideCueRef}
    dataAttributeName={waterfallGuideId}
    defaultOpen={Cookies.get(SEEN_WATERFALL_ONBOARDING_TUTORIAL) !== "true"}
    onClose={() =>
      Cookies.set(SEEN_WATERFALL_ONBOARDING_TUTORIAL, "true", {
        expires: 365,
      })
    }
    onCurrentStepChange={onCurrentStepChange}
    walkthroughSteps={walkthroughSteps}
  />
);
