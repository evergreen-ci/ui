import Cookies from "js-cookie";
import { useTaskHistoryAnalytics } from "analytics";
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
}) => {
  const { sendEvent } = useTaskHistoryAnalytics();

  return (
    <WalkthroughGuideCue
      ref={guideCueRef}
      dataAttributeName={taskHistoryGuideId}
      defaultOpen={
        Cookies.get(SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL) !== "true"
      }
      onClose={() => {
        sendEvent({ name: "Clicked to dismiss walkthrough before completion" });
        Cookies.set(SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL, "true", {
          expires: 365,
        });
      }}
      walkthroughSteps={walkthroughSteps}
    />
  );
};

export default OnboardingTutorial;
