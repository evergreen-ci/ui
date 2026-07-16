import { SubscriberWrapper } from "gql/generated/types";
import { NotificationMethods } from "types/subscription";

export const notificationFields = {
  buildBreak: "Build break",
  patchFinish: "Patch finish",
  patchFirstFailure: "Patch first task failure",
  spawnHostExpiration: "Spawn host expiration",
  spawnHostOutcome: "Spawn host outcome",
};

export const getSubscriberText = (subscriberWrapper: SubscriberWrapper) => {
  const { subscriber, type } = subscriberWrapper;
  switch (type) {
    case NotificationMethods.JIRA_COMMENT:
      return subscriber.jiraCommentSubscriber;
    case NotificationMethods.SLACK:
      return subscriber.slackSubscriber;
    case NotificationMethods.EMAIL:
      return subscriber.emailSubscriber;
    case NotificationMethods.WEBHOOK:
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      return subscriber.webhookSubscriber.url;
    case NotificationMethods.JIRA_ISSUE:
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      return subscriber.jiraIssueSubscriber.project;
    default:
      return "";
  }
};
