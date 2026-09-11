import { forwardRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Button, ButtonProps } from "@via-ds/components/button";
import { Content, Dialog, DialogRoot, Footer, Header, Text } from "@via-ds/components";
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
  SaveSubscriptionForUserMutation,
  SaveSubscriptionForUserMutationVariables,
  UserQuery,
} from "gql/generated/types";
import { SAVE_SUBSCRIPTION } from "gql/mutations";
import { USER } from "gql/queries";
import { useUserSettings } from "hooks/useUserSettings";
import { SubscriptionMethodOption } from "types/subscription";
import { Trigger } from "types/triggers";
import { getFormSchema } from "./form/getFormSchema";
import styles from "./index.module.css";
import { FormRegexSelector, FormState } from "./types";
import { getGqlPayload, hasInitialError } from "./utils";

interface NotificationModalProps {
  "data-testid": string;
  onCancel: () => void;
  resourceId: string;
  sendAnalyticsEvent: (
    subscription: SaveSubscriptionForUserMutationVariables["subscription"],
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

  // Define initial form state.
  const [formState, setFormState] = useState<FormState>({
    event: {
      eventSelect:
        Cookies.get(getNotificationTriggerCookie(type)) ??
        Object.keys(triggers)[0],
      extraFields: {},
      regexSelector: [],
    },
    notification: {
      notificationSelect: Cookies.get(SUBSCRIPTION_METHOD) ?? "jira-comment",
      jiraCommentInput: "",
      slackInput: slackUsername ? `@${slackUsername}` : "",
      emailInput: emailAddress ?? "",
    },
  });
  const [hasError, setHasError] = useState(hasInitialError(formState));

  const onClickSave = () => {
    const subscription = getGqlPayload(type, triggers, resourceId, formState);
    saveSubscription({
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      variables: { subscription },
    });
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    sendAnalyticsEvent(subscription);
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

  const { schema, uiSchema } = getFormSchema(
    getRegexEnumsToDisable(formState.event.regexSelector),
    triggers,
    subscriptionMethods,
  );

  return (
    <DialogRoot isOpen={visible} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <Dialog>
        <Header>
          <Text slot="title">Add Subscription</Text>
        </Header>
        <Content>
          <SpruceForm
            formData={formState}
            onChange={({ errors, formData }) => {
              // Update event cookie when it changes.
              updateEventCookie(formData.event.eventSelect);
              // Update notification cookie when it changes.
              updateNotificationCookie(
                formData.notification.notificationSelect,
              );
              setFormState(formData);
              setHasError(errors.length !== 0);
            }}
            schema={schema}
            uiSchema={uiSchema}
          />
        </Content>
        <Footer>
          <Button onPress={onCancel}>Cancel</Button>
          <Button isDisabled={hasError} onPress={onClickSave} variant="primary">
            Save
          </Button>
        </Footer>
      </Dialog>
    </DialogRoot>
  );
};

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
