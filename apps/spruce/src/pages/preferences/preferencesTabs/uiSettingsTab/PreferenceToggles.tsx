import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import Cookies from "js-cookie";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
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

  const handleOnChangePolling = () => {
    const nextState = Cookies.get(DISABLE_QUERY_POLLING) !== "true";
    sendEvent({
      name: "Toggled polling",
      value: nextState ? "Enabled" : "Disabled",
    });
    Cookies.set(DISABLE_QUERY_POLLING, nextState.toString());
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
      <PreferenceItem>
        <Checkbox
          checked={spruceV1 ?? false}
          description="Direct all inbound links to the new Evergreen UI whenever possible
          (e.g. from the CLI, GitHub, etc.)."
          disabled={updateLoading}
          label="Use Spruce"
          onChange={handleOnChangeNewUI}
        />
      </PreferenceItem>
      <PreferenceItem>
        <Checkbox
          checked={Cookies.get(DISABLE_QUERY_POLLING) !== "true"}
          description="Allow background polling for active tabs in the current browser. This allows Spruce to update tasks' statuses more frequently."
          label="Background polling"
          onChange={handleOnChangePolling}
        />
      </PreferenceItem>
      <PreferenceItem>
        <Checkbox
          defaultChecked={Cookies.get(DISABLE_TASK_REVIEW) !== "true"}
          description="Enable individual task review tracking for unsuccessful tasks. This feature can be accessed from the tasks table on a version page, or on the task page itself."
          label="Task review"
          onChange={handleToggleTaskReview}
        />
      </PreferenceItem>
    </>
  );
};

const PreferenceItem = styled.div`
  :not(:last-of-type) {
    margin-bottom: ${size.s};
  }
`;
