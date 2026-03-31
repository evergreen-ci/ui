import { useState } from "react";
import {
  getLocalStorageBoolean,
  setLocalStorageBoolean,
} from "@evg-ui/lib/utils/localStorage";
import { usePreferencesAnalytics } from "analytics";
import { ToggleWithLabel } from "components/ToggleWithLabel";
import { DISABLE_QUERY_POLLING, DISABLE_TASK_REVIEW } from "constants/cookies";
import { useAprilFoolsEnabled } from "hooks/useAprilFoolsEnabled";

export const PreferenceToggles: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const [queryPollingEnabled, setQueryPollingEnabled] = useState(
    !getLocalStorageBoolean(DISABLE_QUERY_POLLING, false),
  );
  const [taskReviewEnabled, setTaskReviewEnabled] = useState(
    !getLocalStorageBoolean(DISABLE_TASK_REVIEW, false),
  );

  const handleOnChangePolling = (c: boolean) => {
    sendEvent({
      name: "Toggled polling",
      enabled: c,
    });
    setQueryPollingEnabled(c);
    setLocalStorageBoolean(DISABLE_QUERY_POLLING, !c);
  };

  const handleToggleTaskReview = (c: boolean) => {
    sendEvent({
      name: "Toggled task review",
      enabled: c,
    });
    setTaskReviewEnabled(c);
    setLocalStorageBoolean(DISABLE_TASK_REVIEW, !c);
  };

  const { enabled: aprilFoolsEnabled, setEnabled: setAprilFoolsEnabled } =
    useAprilFoolsEnabled();

  const handleToggleAprilFools = (c: boolean) => {
    setAprilFoolsEnabled(c); // updates state + localStorage
  };

  return (
    <>
      <ToggleWithLabel
        checked={queryPollingEnabled}
        description="Allow background polling for active tabs in the current browser. This allows Spruce to update tasks' statuses more frequently."
        id="polling"
        label="Background polling"
        onChange={handleOnChangePolling}
      />
      <ToggleWithLabel
        checked={taskReviewEnabled}
        description="Enable individual task review tracking for unsuccessful tasks. This feature can be accessed from the tasks table on a version page, or on the task page itself."
        id="toggle-task-review"
        label="Task review"
        onChange={handleToggleTaskReview}
      />
      <ToggleWithLabel
        checked={aprilFoolsEnabled}
        description="Turn off the April Fools' joke for this year if you don't want to see it. You'll need to refresh the page whoopsie (Don't worry, you won't hurt our feelings!)"
        id="toggle-april-fools"
        label="SUBSCRIBE to APRIL FOOLS' JOKE"
        onChange={handleToggleAprilFools}
      />
    </>
  );
};
