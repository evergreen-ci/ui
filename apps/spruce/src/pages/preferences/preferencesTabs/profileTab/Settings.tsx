import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Variant as ButtonVariant } from "@leafygreen-ui/button";
import { diff } from "deep-object-diff";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePreferencesAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import { TimeFormat, listOfDateFormatStrings, timeZones } from "constants/time";
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
      dateFormat: userSettings?.dateFormat ?? "",
      githubUser: { lastKnownAs: userSettings?.githubUser?.lastKnownAs || "" },
      region: userSettings?.region ?? "",
      timeFormat: userSettings?.timeFormat || TimeFormat.TwelveHour,
      timezone: userSettings?.timezone ?? "",
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
            dateFormat: {
              oneOf: [
                ...dateFormats.map(({ str, value }) => ({
                  enum: [value],
                  title: str,
                  type: "string" as const,
                })),
              ],
              title: "Date Format",
              type: "string" as const,
            },
            githubUser: {
              properties: {
                lastKnownAs: {
                  title: "GitHub Username",
                  type: "string",
                },
              },
              title: "",
            },
            region: {
              enum: awsRegions,
              title: "AWS Region",
              type: "string",
            },
            timeFormat: {
              oneOf: [
                {
                  description: "Display time with AM/PM, e.g. 12:34 PM",
                  enum: [TimeFormat.TwelveHour],
                  title: "12-hour clock",
                  type: "string" as const,
                },
                {
                  description: "Use 24-hour notation, e.g. 13:34",
                  enum: [TimeFormat.TwentyFourHour],
                  title: "24-hour clock",
                  type: "string" as const,
                },
              ],
              title: "Time Format",
              type: "string",
            },
            timezone: {
              oneOf: [
                ...timeZones.map(({ str, value }) => ({
                  enum: [value],
                  title: str,
                  type: "string" as const,
                })),
              ],
              title: "Timezone",
              type: "string" as const,
            },
          },
        }}
        // Ignore select errors because not making a selection is valid for this form.
        transformErrors={(errors) =>
          errors.filter((e) => e.name !== "oneOf" && e.name !== "enum")
        }
        uiSchema={{
          dateFormat: {
            "ui:hideError": true,
            "ui:placeholder": "Select a date format",
          },
          githubUser: {
            lastKnownAs: {
              "ui:placeholder": "Enter your GitHub username",
            },
          },
          region: {
            "ui:placeholder": "Select an AWS region",
          },
          timeFormat: {
            "ui:options": {
              bold: true,
            },
            "ui:widget": "radio",
          },
          timezone: {
            "ui:placeholder": "Select a timezone",
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
  str: `${format} - ${getDateCopy("08/31/2022", {
    dateFormat: format,
    dateOnly: true,
  })}`,
  value: format,
}));

const ContentWrapper = styled.div`
  max-width: 60%;
`;
