import { SubscriberWrapper } from "gql/generated/types";
import { NotificationMethods } from "types/subscription";

export const notificationFields = {
  patchFinish: "Patch finish",
  patchFirstFailure: "Patch first task failure",
  spawnHostOutcome: "Spawn host outcome",
  spawnHostExpiration: "Spawn host expiration",
  buildBreak: "Build break",
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
