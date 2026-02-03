import { toSentenceCase } from "@evg-ui/lib/utils";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { getSubscriberText } from "constants/subscription";
import { convertFromFamilyTrigger, projectTriggers } from "constants/triggers";
import {
  BannerTheme,
  ProjectInput,
  SubscriptionInput,
} from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { ProjectType } from "../utils";
import { getGqlPayload } from "./getGqlPayload";

type Tab = ProjectSettingsTabRoutes.Notifications;

const getTriggerText = (trigger: string, resourceType: string) => {
  const triggerText =
    resourceType && trigger
      ? `${toSentenceCase(resourceType)} ${convertFromFamilyTrigger(trigger)} `
      : "";
  return triggerText;
};

const getTriggerEnum = (trigger: string, resourceType: string) => {
  const triggerEnum = Object.keys(projectTriggers).find(
    (t) =>
      projectTriggers[t].trigger === convertFromFamilyTrigger(trigger) &&
      projectTriggers[t].resourceType === resourceType,
  );
  return triggerEnum;
};

const getExtraFields = (
  triggerEnum: string,
  triggerData: { [key: string]: string },
) => {
  // If there are no extra fields, just return.
  if (!triggerData) return {};

  const extraFields = {};
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  projectTriggers[triggerEnum]?.extraFields.forEach((e) => {
    // Extra fields that are numbers must be converted in order to fulfill the form schema.
    const isNumber = e.format === "number";
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    extraFields[e.key] = isNumber
      ? parseInt(triggerData[e.key], 10)
      : triggerData[e.key];
  });
  return extraFields;
};

const getHttpHeaders = (headers: { key: string; value: string }[]) =>
  headers
    ? headers.map((h) => ({
        keyInput: h.key,
        valueInput: h.value,
      }))
    : [];

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const gqlToForm = ((data, { projectType }) => {
  if (!data) return null;
  const { projectRef, subscriptions } = data;
  return {
    ...(projectType !== ProjectType.Repo &&
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      "banner" in projectRef && {
        banner: {
          bannerData: {
            text: projectRef.banner?.text,
            theme: projectRef.banner?.theme || BannerTheme.Announcement,
          },
        },
      }),
    buildBreakSettings: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      notifyOnBuildFailure: projectRef.notifyOnBuildFailure,
    },
    subscriptions: subscriptions
      ? subscriptions?.map(
          ({
            id,
            regexSelectors,
            resourceType,
            subscriber,
            trigger,
            triggerData,
          }) => {
            // Find and process information about trigger.
            const triggerEnum = getTriggerEnum(trigger, resourceType);
            const triggerText = getTriggerText(trigger, resourceType);

            // Find and process information about subscriber.
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            const { subscriber: subscribers, type: subscriberType } =
              subscriber;
            const {
              emailSubscriber,
              jiraCommentSubscriber,
              jiraIssueSubscriber,
              slackSubscriber,
              webhookSubscriber,
            } = subscribers;
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            const subscriberText = getSubscriberText(subscriber);

            return {
              displayTitle: `${triggerText} - ${subscriberText}`,
              subscriptionData: {
                id,
                event: {
                  eventSelect: triggerEnum,
                  // @ts-expect-error: FIXME. This comment was added by an automated script.
                  extraFields: getExtraFields(triggerEnum, triggerData),
                  regexSelector: regexSelectors.map((r) => ({
                    regexSelect: r.type,
                    regexInput: r.data,
                  })),
                },
                notification: {
                  notificationSelect: subscriberType,
                  jiraCommentInput: jiraCommentSubscriber ?? undefined,
                  slackInput: slackSubscriber ?? undefined,
                  emailInput: emailSubscriber ?? undefined,
                  jiraIssueInput: {
                    projectInput: jiraIssueSubscriber?.project ?? undefined,
                    issueInput: jiraIssueSubscriber?.issueType ?? undefined,
                  },
                  webhookInput: {
                    urlInput: webhookSubscriber?.url ?? undefined,
                    secretInput: webhookSubscriber?.secret,
                    httpHeaders: getHttpHeaders(webhookSubscriber?.headers),
                    retryInput: webhookSubscriber?.retries || undefined,
                    minDelayInput: webhookSubscriber?.minDelayMs || undefined,
                    timeoutInput: webhookSubscriber?.timeoutMs || undefined,
                  },
                },
              },
            };
          },
        )
      : [],
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((formState, isRepo, id) => {
  const { banner, buildBreakSettings, subscriptions } = formState;
  const projectRef: ProjectInput = {
    id,
    notifyOnBuildFailure: buildBreakSettings.notifyOnBuildFailure,
    ...(banner && { banner: banner.bannerData }),
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const transformedSubscriptions: SubscriptionInput[] = subscriptions.map(
    getGqlPayload(id),
  );
  return {
    ...(isRepo ? { repoId: id } : { projectId: id }),
    projectRef,
    subscriptions: transformedSubscriptions,
  };
}) satisfies FormToGqlFunction<Tab>;
