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
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  UserQuery,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { USER } from "gql/queries";
import { useUserSettings } from "hooks/useUserSettings";
import {
  CreatedNotificationAction,
  NotificationMethods,
  NotificationModalSource,
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
  sendEvent: (event: CreatedNotificationAction) => void;
  source: NotificationModalSource;
  subscriptionMethods: SubscriptionMethodOption[];
  triggers: Trigger;
  type: "task" | "version" | "project";
  visible: boolean;
}

/**
 * NotificationModal lets the user subscribe to a resource. The form only mounts while the modal is open and the user's
 * details have loaded, so each open starts fresh from the latest saved selections and user settings.
 * @param props - NotificationModalProps
 * @param props.visible - whether the modal is open
 * @returns the notification modal, or nothing while closed or loading
 */
export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  ...props
}) => {
  const { loading: userSettingsLoading, userSettings } = useUserSettings();
  const { data: userData, loading: userLoading } = useQuery<UserQuery>(USER);

  if (!visible || userSettingsLoading || userLoading) {
    return null;
  }
  return (
    <NotificationModalForm
      {...props}
      emailAddress={userData?.user?.emailAddress ?? ""}
      slackUsername={userSettings.slackUsername ?? ""}
    />
  );
};

interface NotificationModalFormProps extends Omit<
  NotificationModalProps,
  "visible"
> {
  emailAddress: string;
  slackUsername: string;
}

const NotificationModalForm: React.FC<NotificationModalFormProps> = ({
  "data-testid": dataTestId,
  emailAddress,
  onCancel,
  resourceId,
  sendEvent,
  slackUsername,
  source,
  subscriptionMethods,
  triggers,
  type,
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

  const [initialFormState] = useState<FormState>(() => ({
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
      emailInput: emailAddress,
    },
  }));
  const [formState, setFormState] = useState(initialFormState);
  const [hasError, setHasError] = useState(hasInitialError(initialFormState));
  const [shouldSaveSlackUsername, setShouldSaveSlackUsername] = useState(false);

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
    sendEvent({
      name: "Created notification",
      "notification.source": source,
      "slack_username.saved": savedSlackUsername,
      "subscription.changed_initial_selection":
        formState.event.eventSelect !== initialFormState.event.eventSelect ||
        formState.notification.notificationSelect !==
          initialFormState.notification.notificationSelect,
      "subscription.type": subscription.subscriber.type || "",
      "subscription.trigger": subscription.trigger || "",
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
      open
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
