import { FieldRow } from "components/SpruceForm/FieldTemplates";
import { SpruceFormProps } from "components/SpruceForm/types";
import { JiraTicketType } from "types/jira";
import {
  NotificationMethods,
  SubscriptionMethodOption,
} from "types/subscription";

/**
 * getNotificationSchema returns the schema and uiSchema for the notification section of subscriptions.
 * @param subscriptionMethods - an object containing information about available subscription methods. The available
 * subscription methods differ between task/version and project subscriptions.
 * @returns - an object containing the schema and uiSchema for the notification section of subscriptions.
 */
export const getNotificationSchema = (
  subscriptionMethods: SubscriptionMethodOption[],
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  schema: {
    dependencies: {
      notificationSelect: {
        oneOf: [
          {
            properties: {
              jiraCommentInput: {
                format: "validJiraTicket",
                minLength: 1,
                title: "JIRA Issue",
                type: "string" as const,
              },
              notificationSelect: {
                enum: [NotificationMethods.JIRA_COMMENT],
              },
            },
            required: ["jiraCommentInput"],
          },
          {
            properties: {
              notificationSelect: {
                enum: [NotificationMethods.SLACK],
              },
              slackInput: {
                format: "validSlack",
                minLength: 1,
                title: "Slack message",
                type: "string" as const,
              },
            },
            required: ["slackInput"],
          },
          {
            properties: {
              emailInput: {
                format: "validEmail",
                minLength: 1,
                title: "Email",
                type: "string" as const,
              },
              notificationSelect: {
                enum: [NotificationMethods.EMAIL],
              },
            },
            required: ["emailInput"],
          },
          {
            properties: {
              notificationSelect: {
                enum: [NotificationMethods.WEBHOOK],
              },
              webhookInput: {
                properties: {
                  httpHeaders: {
                    items: {
                      properties: {
                        keyInput: {
                          title: "Key",
                          type: "string" as const,
                        },
                        valueInput: {
                          title: "Value",
                          type: "string" as const,
                        },
                      },
                      required: ["keyInput", "valueInput"],
                      type: "object" as const,
                    },
                    title: "HTTP Headers",
                    type: "array" as const,
                  },
                  minDelayInput: {
                    maximum: 10000,
                    minimum: 0,
                    title: "Minimum delay (ms)",
                    type: "number" as const,
                  },
                  retryInput: {
                    maximum: 10,
                    minimum: 0,
                    title: "Retry count",
                    type: "number" as const,
                  },
                  secretInput: {
                    title: "Webhook Secret",
                    type: "string" as const,
                  },
                  timeoutInput: {
                    maximum: 30000,
                    minimum: 0,
                    title: "Max timeout (ms)",
                    type: "number" as const,
                  },
                  urlInput: {
                    format: "validURL",
                    minLength: 1,
                    title: "Webhook URL",
                    type: "string" as const,
                  },
                },
                required: ["urlInput"],
                title: "",
                type: "object" as const,
              },
            },
          },
          {
            properties: {
              jiraIssueInput: {
                properties: {
                  issueInput: {
                    minLength: 1,
                    title: "Issue Type",
                    type: "string" as const,
                  },
                  projectInput: {
                    minLength: 1,
                    title: "JIRA Project",
                    type: "string" as const,
                  },
                },
                required: ["projectInput", "issueInput"],
                title: "",
                type: "object" as const,
              },
              notificationSelect: {
                enum: [NotificationMethods.JIRA_ISSUE],
              },
            },
          },
        ],
      },
    },
    properties: {
      notificationSelect: {
        default: "",
        oneOf: [
          ...subscriptionMethods.map(({ label, value }) => ({
            enum: [value],
            title: label,
            type: "string" as const,
          })),
        ],
        title: "Notification Method",
        type: "string" as const,
      },
    },
    required: ["notificationSelect"],
    title: "Choose How to be Notified",
    type: "object" as const,
  },
  uiSchema: {
    emailInput: {
      "ui:data-cy": "email-input",
      "ui:placeholder": "someone@example.com",
    },
    jiraCommentInput: {
      "ui:data-cy": "jira-comment-input",
      "ui:placeholder": "ABC-123",
    },
    jiraIssueInput: {
      issueInput: {
        "ui:data-cy": "issue-input",
        "ui:placeholder": JiraTicketType.BuildFailure,
      },
      projectInput: {
        "ui:data-cy": "project-input",
        "ui:placeholder": "ABC",
      },
    },
    notificationSelect: {
      "ui:allowDeselect": false,
      "ui:data-cy": "notification-method-select",
    },
    slackInput: {
      "ui:data-cy": "slack-input",
      "ui:description":
        "Notifications can be sent to a Slack channel, @user, or member ID represented as an alphanumeric string.",
      "ui:placeholder": "#channel, @user, or MEMBERID",
    },
    webhookInput: {
      httpHeaders: {
        items: {
          "ui:ObjectFieldTemplate": FieldRow,
        },
        "ui:addButtonText": "Add HTTP Header",
        "ui:addToEnd": true,
        "ui:orderable": false,
      },
      minDelayInput: {
        "ui:data-cy": "min-delay-input",
        "ui:optional": true,
        "ui:placeholder": "Defaults to 500 if unset.",
      },
      retryInput: {
        "ui:data-cy": "retry-input",
        "ui:optional": true,
        "ui:placeholder": "Defaults to 0 if unset.",
      },
      secretInput: {
        "ui:data-cy": "secret-input",
        "ui:placeholder":
          "The secret will be shown upon saving the subscription.",
        "ui:readonly": true,
      },
      timeoutInput: {
        "ui:data-cy": "timeout-input",
        "ui:optional": true,
        "ui:placeholder": "Defaults to 10000 if unset.",
      },
      urlInput: {
        "ui:data-cy": "url-input",
        "ui:placeholder": "https://example.com",
      },
    },
  },
});
