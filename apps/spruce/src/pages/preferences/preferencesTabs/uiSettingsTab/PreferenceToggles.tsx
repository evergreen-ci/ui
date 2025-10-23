import Cookies from "js-cookie";
import { usePreferencesAnalytics } from "analytics";
import { ToggleWithLabel } from "components/ToggleWithLabel";
import { DISABLE_QUERY_POLLING, DISABLE_TASK_REVIEW } from "constants/cookies";

export const PreferenceToggles: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();

  const handleOnChangePolling = (c: boolean) => {
    sendEvent({
      name: "Toggled polling",
      value: c ? "Enabled" : "Disabled",
    });
    Cookies.set(DISABLE_QUERY_POLLING, (!c).toString());
    window.location.reload();
  };

  const handleToggleTaskReview = (c: boolean) => {
    sendEvent({
      name: "Toggled task review",
      value: c ? "Enabled" : "Disabled",
    });
    Cookies.set(DISABLE_TASK_REVIEW, (!c).toString(), { expires: 365 });
    window.location.reload();
  };

  return (
    <>
      <ToggleWithLabel
        checked={Cookies.get(DISABLE_QUERY_POLLING) !== "true"}
        description="Allow background polling for active tabs in the current browser. This allows Spruce to update tasks' statuses more frequently."
        id="polling"
        label="Background polling"
        onChange={handleOnChangePolling}
      />
      <ToggleWithLabel
        checked={Cookies.get(DISABLE_TASK_REVIEW) !== "true"}
        description="Enable individual task review tracking for unsuccessful tasks. This feature can be accessed from the tasks table on a version page, or on the task page itself."
        id="toggle-task-review"
        label="Task review"
        onChange={handleToggleTaskReview}
      />
    </>
  );
};
