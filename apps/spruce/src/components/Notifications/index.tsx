import { forwardRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button, ButtonProps } from "@leafygreen-ui/button";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import Cookies from "js-cookie";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { cx } from "@evg-ui/lib/utils/css";
import { SpruceForm } from "components/SpruceForm";
import {
  SUBSCRIPTION_METHOD,
  getNotificationTriggerCookie,
} from "constants/cookies";
import { regexBuildVariant, regexDisplayName } from "constants/triggers";
import {
  SaveSubscriptionForUserMutationVariables,
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  UserQuery,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { USER } from "gql/queries";
import { useUserSettings } from "hooks/useUserSettings";
import {
  NotificationMethods,
  SubscriptionMethodOption,
} from "types/subscription";
import { Trigger } from "types/triggers";
import { getFormSchema } from "./form/getFormSchema";
import styles from "./index.module.css";
import { FormRegexSelector, FormState } from "./types";
import { useSaveSubscription } from "./useSaveSubscription";
import {
  getDefaultEvent,
  getDefaultNotificationMethod,
  getGqlPayload,
  hasInitialError,
} from "./utils";

export interface NotificationModalProps {
  "data-testid": string;
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  resourceId: string;
  sendAnalyticsEvent: (
    subscription: SaveSubscriptionForUserMutationVariables["subscription"],
    details: { changedInitialSelection: boolean; savedSlackUsername: boolean },
  ) => void;
  subscriptionMethods: SubscriptionMethodOption[];
  triggers: Trigger;
  type: "task" | "version" | "project";
  visible: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  "data-testid": dataTestId,
  onCancel,
  resourceId,
  sendAnalyticsEvent,
  subscriptionMethods,
  triggers,
  type,
  visible,
}) => {
  const dispatchToast = useToastContext();
  const [saveSubscription] = useSaveSubscription({
    onCompleted: () => {
      dispatchToast.success("Your subscription has been added");
    },
    onError: (message) => {
      dispatchToast.error(message);
    },
  });

  const [updateUserSettings] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    // The mutation only returns a boolean, so the cached settings must be refetched to prefill the next modal.
    refetchQueries: ["UserSettings"],
    onError: (err) => {
      dispatchToast.error(`Error saving your Slack username: '${err.message}'`);
    },
  });

  // Fetch user Slack and email information.
  const { userSettings } = useUserSettings();
  const { slackUsername } = userSettings || {};
  const { data: userData } = useQuery<UserQuery>(USER);
  const { user } = userData || {};
  const { emailAddress } = user || {};

  const getInitialFormState = (): FormState => ({
    event: {
      eventSelect:
        Cookies.get(getNotificationTriggerCookie(type)) ??
        getDefaultEvent(triggers),
      extraFields: {},
      regexSelector: [],
    },
    notification: {
      notificationSelect:
        Cookies.get(SUBSCRIPTION_METHOD) ??
        getDefaultNotificationMethod(subscriptionMethods),
      jiraCommentInput: "",
      slackInput: slackUsername ? `@${slackUsername}` : "",
      emailInput: emailAddress ?? "",
    },
  });

  const [initialFormState, setInitialFormState] = useState(getInitialFormState);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [hasError, setHasError] = useState(hasInitialError(formState));
  const [shouldSaveSlackUsername, setShouldSaveSlackUsername] = useState(false);

  // Rebuild the form each time the modal opens so it reflects the latest cookies
  // and user settings, which may not have loaded when the modal first mounted.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      const nextFormState = getInitialFormState();
      setInitialFormState(nextFormState);
      setFormState(nextFormState);
      setHasError(hasInitialError(nextFormState));
      setShouldSaveSlackUsername(false);
    }
  }

  const typedSlackUsername =
    formState.notification.notificationSelect === NotificationMethods.SLACK
      ? getSlackUsername(formState.notification.slackInput)
      : "";
  const canSaveSlackUsername = !slackUsername && !!typedSlackUsername;

  const onClickSave = () => {
    const subscription = getGqlPayload(type, triggers, resourceId, formState);
    Cookies.set(
      getNotificationTriggerCookie(type),
      formState.event.eventSelect,
      { expires: 365 },
    );
    Cookies.set(
      SUBSCRIPTION_METHOD,
      formState.notification.notificationSelect,
      { expires: 365 },
    );
    saveSubscription({
      variables: { subscription },
    });
    const savedSlackUsername = canSaveSlackUsername && shouldSaveSlackUsername;
    if (savedSlackUsername) {
      updateUserSettings({
        variables: { userSettings: { slackUsername: typedSlackUsername } },
      });
    }
    sendAnalyticsEvent(subscription, {
      changedInitialSelection:
        formState.event.eventSelect !== initialFormState.event.eventSelect ||
        formState.notification.notificationSelect !==
          initialFormState.notification.notificationSelect,
      savedSlackUsername,
    });
    onCancel();
  };

  const { schema, uiSchema } = getFormSchema(
    getRegexEnumsToDisable(formState.event.regexSelector),
    triggers,
    subscriptionMethods,
  );

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: onCancel,
      }}
      confirmButtonProps={{
        children: "Save",
        disabled: hasError,
        onClick: onClickSave,
      }}
      data-testid={dataTestId}
      open={visible}
      title="Add Subscription"
    >
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setFormState(formData);
          setHasError(errors.length !== 0);
        }}
        schema={schema}
        uiSchema={uiSchema}
      />
      {canSaveSlackUsername && (
        <Checkbox
          checked={shouldSaveSlackUsername}
          className={styles.saveSlackUsernameCheckbox}
          data-testid="save-slack-username-checkbox"
          label="Save Slack username to my settings"
          onChange={(e) => setShouldSaveSlackUsername(e.target.checked)}
        />
      )}
    </ConfirmationModal>
  );
};

// Only an @username target is the user's own Slack account; channels and member IDs are not.
const getSlackUsername = (slackInput: string) =>
  /^@[\w.-]+$/.test(slackInput) ? slackInput.slice(1) : "";

const getRegexEnumsToDisable = (regexForm: FormRegexSelector[]) => {
  const usingID = !!regexForm.find((r) => r.regexSelect === regexBuildVariant);
  const usingName = !!regexForm.find((r) => r.regexSelect === regexDisplayName);
  const regexEnumsToDisable = [
    ...(usingID ? [regexBuildVariant] : []),
    ...(usingName ? [regexDisplayName] : []),
  ];
  return regexEnumsToDisable;
};

export const LeftButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...rest }, ref) => (
    <Button ref={ref} className={cx(styles.leftButton, className)} {...rest} />
  ),
);
LeftButton.displayName = "LeftButton";
