import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import Toggle, { Size as ToggleSize } from "@leafygreen-ui/toggle";
import { Label } from "@leafygreen-ui/typography";
import Cookies from "js-cookie";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import { DISABLE_QUERY_POLLING } from "constants/cookies";
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

  const handleOnChangeNewUI = (c: boolean) => {
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

  return loading ? (
    <ParagraphSkeleton />
  ) : (
    <>
      <PreferenceItem>
        <Toggle
          aria-label="Toggle new Evergreen UI"
          checked={spruceV1 ?? false}
          disabled={updateLoading}
          id="prefer-spruce"
          onChange={handleOnChangeNewUI}
          size={ToggleSize.Small}
        />
        <Label htmlFor="prefer-spruce">
          Direct all inbound links to the new Evergreen UI, whenever possible
          (e.g. from the CLI, GitHub, etc.).
        </Label>
      </PreferenceItem>
      <PreferenceItem>
        <Toggle
          aria-label="Toggle background polling"
          checked={Cookies.get(DISABLE_QUERY_POLLING) !== "true"}
          id="polling"
          onChange={handleOnChangePolling}
          size={ToggleSize.Small}
        />
        <Label htmlFor="polling">
          Allow background polling for active tabs in the current browser.
        </Label>
      </PreferenceItem>
    </>
  );
};

const PreferenceItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${size.xs};

  :not(:last-of-type) {
    margin-bottom: ${size.s};
  }
`;
