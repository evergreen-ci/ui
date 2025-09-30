import { useMutation } from "@apollo/client";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import Cookies from "js-cookie";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import { ToggleWithLabel } from "components/ToggleWithLabel";
import { DISABLE_QUERY_POLLING, DISABLE_TASK_REVIEW } from "constants/cookies";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { useUserSettings } from "hooks";

export const PreferenceToggles: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const { loading, userSettings } = useUserSettings();
  const { spruceV1 } = userSettings?.useSpruceOptions ?? {};

  const [updateUserSettings, { loading: updateLoading }] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    onCompleted: () => {
      dispatchToast.success("Your changes have been saved.");
    },
    onError: (err) => {
      dispatchToast.error(`Error while saving settings: ${err.message}`);
    },
  });

  const handleOnChangeNewUI = (e: React.ChangeEvent<HTMLInputElement>) => {
    const c = e.target.checked;
    sendEvent({
      name: "Toggled spruce",
      value: c ? "Enabled" : "Disabled",
    });
    updateUserSettings({
      variables: {
        userSettings: {
          useSpruceOptions: {
            spruceV1: c,
          },
        },
      },
      refetchQueries: ["UserSettings"],
    });
  };

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

  const handleToggleTaskReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextState = !e.target.checked;
    sendEvent({
      name: "Toggled task review",
      value: nextState ? "Enabled" : "Disabled",
    });
    Cookies.set(DISABLE_TASK_REVIEW, nextState.toString());
  };

  return loading ? (
    <ParagraphSkeleton />
  ) : (
    <>
      <ToggleWithLabel
        checked={spruceV1 ?? false}
        description="Direct all inbound links to the new Evergreen UI whenever possible
          (e.g. from the CLI, GitHub, etc.)."
        disabled={updateLoading}
        id="prefer-spruce"
        label="Use Spruce"
        onChange={handleOnChangeNewUI}
      />
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
