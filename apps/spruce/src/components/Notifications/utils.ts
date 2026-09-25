import { StringMap } from "@evg-ui/lib/types/utils";
import { SaveSubscriptionForUserMutationVariables } from "gql/generated/types";
import {
  CreatedNotificationAction,
  NotificationMethods,
  NotificationModalSource,
  SubscriptionMethodOption,
} from "types/subscription";
import { ExtraField, Trigger, TriggerType } from "types/triggers";
import { FormExtraFields, FormRegexSelector, FormState } from "./types";

// This utils file contains functions used to process the form state.

const getTargetForMethod = (method: string) => {
  switch (method) {
    case NotificationMethods.JIRA_COMMENT:
      return "jiraCommentInput";
    case NotificationMethods.SLACK:
      return "slackInput";
    case NotificationMethods.EMAIL:
      return "emailInput";
    default:
      return "";
  }
};

// Converts the form regexSelector into the proper format for GQL payload.
// We need to check if the trigger has regex selectors because it's possible for data
// from other dependencies to persist.
const regexFormToGql = (
  hasRegexSelectors: boolean,
  regexForm: FormRegexSelector[],
) =>
  hasRegexSelectors && regexForm
    ? regexForm.map((r) => ({
        type: r.regexSelect,
        data: r.regexInput,
      }))
    : [];

// Converts the form extraFields into the proper format for GQL payload.
// We need to check what extraFields exist for a particular trigger because it's possible
// for data from other dependencies to persist.
const extraFieldsFormToGql = (
  extraFieldsToInclude: ExtraField[],
  extraFieldsForm: FormExtraFields,
): StringMap => {
  // If there are no extra fields for this trigger, just return.
  if (!extraFieldsToInclude) {
    return {};
  }
  const extraFields = {};
  extraFieldsToInclude.forEach((e) => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    extraFields[e.key] = extraFieldsForm[e.key].toString();
  });
  return extraFields;
};

export const getGqlPayload = (
  type: "task" | "version" | "project",
  triggers: Trigger,
  resourceId: string,
  formState: FormState,
) => {
  const event = triggers[formState.event.eventSelect];
  const {
    extraFields,
    payloadResourceIdKey,
    regexSelectors,
    resourceType,
    trigger,
  } = event;

  const triggerData = extraFieldsFormToGql(
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    extraFields,
    formState.event.extraFields,
  );

  const regexData = regexFormToGql(
    !!regexSelectors,
    formState.event.regexSelector,
  );

  const method = formState.notification.notificationSelect;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const subscriber = formState.notification[getTargetForMethod(method)];

  const selectors =
    type === "project"
      ? [
          { type: "project", data: resourceId },
          { type: "requester", data: triggerData.requester },
        ]
      : [
          { type: "object", data: resourceType.toLowerCase() },
          { type: payloadResourceIdKey ?? "id", data: resourceId },
        ];

  return {
    owner_type: "person",
    regex_selectors: regexData,
    resource_type: resourceType,
    selectors,
    subscriber: {
      type: method,
      target: subscriber,
    },
    trigger,
    trigger_data: triggerData,
  };
};

export const hasInitialError = (formState: FormState) => {
  const trigger = formState.event.eventSelect;
  const method = formState.notification.notificationSelect;
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const target = formState.notification[getTargetForMethod(method)];
  if (!trigger || !method || !target) {
    return true;
  }
  return false;
};

/**
 * getDefaultEvent returns the event to preselect when the user has no saved preference. Most users
 * subscribe to a resource's outcome, so prefer the first outcome trigger.
 * @param triggers - the triggers available in the modal
 * @returns the key of the default trigger
 */
export const getDefaultEvent = (triggers: Trigger) =>
  Object.keys(triggers).find(
    (key) => triggers[key].trigger === TriggerType.OUTCOME,
  ) ?? Object.keys(triggers)[0];

/**
 * getDefaultNotificationMethod returns the method to preselect when the user has no saved preference.
 * The vast majority of users are notified through Slack.
 * @param subscriptionMethods - the methods available in the modal
 * @returns the value of the default method
 */
export const getDefaultNotificationMethod = (
  subscriptionMethods: SubscriptionMethodOption[],
) =>
  subscriptionMethods.find(({ value }) => value === NotificationMethods.SLACK)
    ?.value ??
  subscriptionMethods[0]?.value ??
  "";

/**
 * getCreatedNotificationEvent builds the analytics event sent when a user creates a subscription.
 * @param source - where the user created the subscription from
 * @param subscription - the subscription that was saved
 * @param details - details about how the subscription was created
 * @param details.changedInitialSelection - whether the user changed the preselected event or method
 * @returns the analytics event
 */
export const getCreatedNotificationEvent = (
  source: NotificationModalSource,
  subscription: SaveSubscriptionForUserMutationVariables["subscription"],
  { changedInitialSelection }: { changedInitialSelection: boolean },
): CreatedNotificationAction => ({
  name: "Created notification",
  "notification.source": source,
  "subscription.changed_initial_selection": changedInitialSelection,
  "subscription.type": subscription.subscriber.type || "",
  "subscription.trigger": subscription.trigger || "",
});
