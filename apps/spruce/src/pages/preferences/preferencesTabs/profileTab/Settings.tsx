import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Variant as ButtonVariant } from "@leafygreen-ui/button";
import { diff } from "deep-object-diff";
import { useToastContext } from "@evg-ui/lib/context";
import { usePreferencesAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import { listOfDateFormatStrings, timeZones, TimeFormat } from "constants/time";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  UserSettings,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { getDateCopy } from "utils/string";

type FormState = {
  timezone: string;
  region: string;
  githubUser: { lastKnownAs?: string };
  dateFormat: string;
  timeFormat: string;
};

type SettingsProps = {
  awsRegions: string[];
  userSettings: UserSettings;
};

export const Settings: React.FC<SettingsProps> = ({
  awsRegions,
  userSettings,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const [updateUserSettings] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    onCompleted: () => {
      dispatchToast.success("Your changes have been saved.");
    },
    onError: (err) => {
      dispatchToast.error(`Error while saving settings: ${err.message}`);
    },
    refetchQueries: ["UserSettings"],
  });

  const initialState = useMemo(
    () => ({
      timezone: userSettings?.timezone ?? "",
      region: userSettings?.region ?? "",
      githubUser: { lastKnownAs: userSettings?.githubUser?.lastKnownAs || "" },
      dateFormat: userSettings?.dateFormat ?? "",
      timeFormat: userSettings?.timeFormat || TimeFormat.TwelveHour,
    }),
    [userSettings],
  );
  const [formState, setFormState] = useState<FormState>(initialState);

  const hasChanges = useMemo(() => {
    const changes = diff(initialState, formState);
    return Object.entries(changes).length > 0;
  }, [initialState, formState]);

  const handleSubmit = () => {
    updateUserSettings({
      variables: {
        userSettings: formState,
      },
    });
    sendEvent({
      name: "Saved profile info",
    });
  };

  return (
    <ContentWrapper>
      <SpruceForm
        formData={formState}
        onChange={({ formData }) => {
          setFormState(formData);
        }}
        schema={{
          properties: {
            githubUser: {
              title: "",
              properties: {
                lastKnownAs: {
                  type: "string",
                  title: "GitHub Username",
                },
              },
            },
            timezone: {
              type: "string" as const,
              title: "Timezone",
              oneOf: [
                ...timeZones.map(({ str, value }) => ({
                  type: "string" as const,
                  title: str,
                  enum: [value],
                })),
              ],
            },
            region: {
              type: "string",
              title: "AWS Region",
              enum: awsRegions,
            },
            dateFormat: {
              type: "string" as const,
              title: "Date Format",
              oneOf: [
                ...dateFormats.map(({ str, value }) => ({
                  type: "string" as const,
                  title: str,
                  enum: [value],
                })),
              ],
            },
            timeFormat: {
              type: "string",
              title: "Time Format",
              oneOf: [
                {
                  type: "string" as const,
                  title: "12-hour clock",
                  description: "Display time with AM/PM, e.g. 12:34 PM",
                  enum: [TimeFormat.TwelveHour],
                },
                {
                  type: "string" as const,
                  title: "24-hour clock",
                  description: "Use 24-hour notation, e.g. 13:34",
                  enum: [TimeFormat.TwentyFourHour],
                },
              ],
            },
          },
        }}
        // Ignore select errors because not making a selection is valid for this form.
        transformErrors={(errors) =>
          errors.filter((e) => e.name !== "oneOf" && e.name !== "enum")
        }
        uiSchema={{
          timezone: {
            "ui:placeholder": "Select a timezone",
          },
          region: {
            "ui:placeholder": "Select an AWS region",
          },
          githubUser: {
            lastKnownAs: {
              "ui:placeholder": "Enter your GitHub username",
            },
          },
          dateFormat: {
            "ui:placeholder": "Select a date format",
            "ui:hideError": true,
          },
          timeFormat: {
            "ui:widget": "radio",
            "ui:options": {
              bold: true,
            },
          },
        }}
      />
      <Button
        data-cy="save-profile-changes-button"
        disabled={!hasChanges}
        onClick={handleSubmit}
        variant={ButtonVariant.Primary}
      >
        Save changes
      </Button>
    </ContentWrapper>
  );
};

const dateFormats = listOfDateFormatStrings.map((format) => ({
  value: format,
  str: `${format} - ${getDateCopy("08/31/2022", {
    dateFormat: format,
    dateOnly: true,
  })}`,
}));

const ContentWrapper = styled.div`
  max-width: 60%;
`;
