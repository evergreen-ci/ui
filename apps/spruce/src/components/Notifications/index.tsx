import { forwardRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button, ButtonProps } from "@leafygreen-ui/button";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Disclaimer } from "@leafygreen-ui/typography";
import Cookies from "js-cookie";
import { StyledRouterLink } from "@evg-ui/lib/components/styles";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { cx } from "@evg-ui/lib/utils/css";
import { SpruceForm } from "components/SpruceForm";
import {
  SUBSCRIPTION_METHOD,
  getNotificationTriggerCookie,
} from "constants/cookies";
import { getSlackUsernamePreferencesRoute } from "constants/routes";
import { regexBuildVariant, regexDisplayName } from "constants/triggers";
import {
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables,
  UserQuery,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
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
import {
  getDefaultEvent,
  getDefaultNotificationMethod,
  getGqlPayload,
  hasInitialError,
} from "./utils";

export interface NotificationModalProps {
  "data-testid": string;
  /** Start from the recommended defaults instead of the user's last-used selections saved in cookies. */
  ignoreSavedSelections?: boolean;
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  resourceId: string;
  sendAnalyticsEvent: (
    subscription: SaveSubscriptionForUserMutationVariables["subscription"],
    details: { changedInitialSelection: boolean },
  ) => void;
  subscriptionMethods: SubscriptionMethodOption[];
  triggers: Trigger;
  type: "task" | "version" | "project";
  visible: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  "data-testid": dataTestId,
  ignoreSavedSelections = false,
  onCancel,
  resourceId,
  sendAnalyticsEvent,
  subscriptionMethods,
  triggers,
  type,
  visible,
}) => {
  const dispatchToast = useToastContext();
  const [saveSubscription] = useMutation<
    SaveSubscriptionForUserMutation,
    SaveSubscriptionForUserMutationVariables
  >(SAVE_SUBSCRIPTION, {
    onCompleted: () => {
      dispatchToast.success("Your subscription has been added");
    },
    onError: (err) => {
      dispatchToast.error(`Error adding your subscription: '${err.message}'`);
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
        (!ignoreSavedSelections &&
          Cookies.get(getNotificationTriggerCookie(type))) ||
        getDefaultEvent(triggers),
      extraFields: {},
      regexSelector: [],
    },
    notification: {
      notificationSelect:
        (!ignoreSavedSelections && Cookies.get(SUBSCRIPTION_METHOD)) ||
        getDefaultNotificationMethod(subscriptionMethods),
      jiraCommentInput: "",
      slackInput: slackUsername ? `@${slackUsername}` : "",
      emailInput: emailAddress ?? "",
    },
  });

  const [initialFormState, setInitialFormState] = useState(getInitialFormState);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [hasError, setHasError] = useState(hasInitialError(formState));

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
    }
  }

  const onClickSave = () => {
    const subscription = getGqlPayload(type, triggers, resourceId, formState);
    saveSubscription({
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      variables: { subscription },
    });
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    sendAnalyticsEvent(subscription, {
      changedInitialSelection:
        formState.event.eventSelect !== initialFormState.event.eventSelect ||
        formState.notification.notificationSelect !==
          initialFormState.notification.notificationSelect,
    });
    onCancel();
  };

  const updateEventCookie = (newEvent: string) => {
    // If user selected a new event, update cookie
    if (formState.event.eventSelect !== newEvent) {
      Cookies.set(`${type}-notification-trigger`, `${newEvent}`, {
        expires: 365,
      });
    }
  };

  const updateNotificationCookie = (newMethod: string) => {
    // If user selected a new notification method, update cookie
    if (formState.notification.notificationSelect !== newMethod) {
      Cookies.set(SUBSCRIPTION_METHOD, newMethod, { expires: 365 });
    }
  };

  const typedSlackUsername =
    formState.notification.notificationSelect === NotificationMethods.SLACK
      ? getSlackUsername(formState.notification.slackInput)
      : "";
  const showSaveSlackUsernameHint = !slackUsername && !!typedSlackUsername;

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
          // Update event cookie when it changes.
          updateEventCookie(formData.event.eventSelect);
          // Update notification cookie when it changes.
          updateNotificationCookie(formData.notification.notificationSelect);
          setFormState(formData);
          setHasError(errors.length !== 0);
        }}
        schema={schema}
        uiSchema={uiSchema}
      />
      {showSaveSlackUsernameHint && (
        <Disclaimer
          className={styles.slackUsernameHint}
          data-testid="save-slack-username-hint"
        >
          <StyledRouterLink
            target="_blank"
            to={getSlackUsernamePreferencesRoute(typedSlackUsername)}
          >
            Save this username
          </StyledRouterLink>{" "}
          in your preferences to prefill it next time.
        </Disclaimer>
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
