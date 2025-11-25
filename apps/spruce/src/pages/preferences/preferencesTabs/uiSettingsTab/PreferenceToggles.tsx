import { useState } from "react";
import Cookies from "js-cookie";
import { usePreferencesAnalytics } from "analytics";
import { ToggleWithLabel } from "components/ToggleWithLabel";
import { DISABLE_QUERY_POLLING, DISABLE_TASK_REVIEW } from "constants/cookies";

export const PreferenceToggles: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const [queryPollingEnabled, setQueryPollingEnabled] = useState(
    Cookies.get(DISABLE_QUERY_POLLING) !== "true",
  );
  const [taskReviewEnabled, setTaskReviewEnabled] = useState(
    Cookies.get(DISABLE_TASK_REVIEW) !== "true",
  );

  const handleOnChangePolling = (c: boolean) => {
    sendEvent({
      name: "Toggled polling",
      enabled: c,
    });
    setQueryPollingEnabled(c);
    Cookies.set(DISABLE_QUERY_POLLING, (!c).toString());
  };

  const handleToggleTaskReview = (c: boolean) => {
    sendEvent({
      name: "Toggled task review",
      enabled: c,
    });
    setTaskReviewEnabled(c);
    Cookies.set(DISABLE_TASK_REVIEW, (!c).toString());
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
    </>
  );
};
