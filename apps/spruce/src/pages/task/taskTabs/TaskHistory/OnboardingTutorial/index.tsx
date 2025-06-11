import Cookies from "js-cookie";
import {
  WalkthroughGuideCue,
  WalkthroughGuideCueRef,
} from "components/WalkthroughGuideCue";
import { SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL } from "constants/cookies";
import { walkthroughSteps, taskHistoryGuideId } from "../constants";

type OnboardingTutorialProps = {
  guideCueRef: React.RefObject<WalkthroughGuideCueRef>;
};

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  guideCueRef,
}) => (
  <WalkthroughGuideCue
    ref={guideCueRef}
    dataAttributeName={taskHistoryGuideId}
    defaultOpen={Cookies.get(SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL) !== "true"}
    onClose={() =>
      Cookies.set(SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL, "true", {
        expires: 365,
      })
    }
    walkthroughSteps={walkthroughSteps}
  />
);

export default OnboardingTutorial;
