import styled from "@emotion/styled";
import { InlineCode, Description } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { bannerThemeToLabelMap } from "components/Banners";
import {
  getEventSchema,
  getNotificationSchema,
} from "components/Notifications/form";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { projectTriggers } from "constants/triggers";
import { BannerTheme } from "gql/generated/types";
import { useSpruceConfig } from "hooks";
import { projectSubscriptionMethods as subscriptionMethods } from "types/subscription";
import { ProjectType, form } from "../utils";
import { NotificationsFormState } from "./types";

const { radioBoxOptions } = form;
export const getFormSchema = (
  repoData: NotificationsFormState | null,
  projectType: ProjectType,
): ReturnType<GetFormSchema> => {
  const { schema: eventSchema, uiSchema: eventUiSchema } = getEventSchema(
    [],
    projectTriggers,
  );
  const { schema: notificationSchema, uiSchema: notificationUiSchema } =
    getNotificationSchema(subscriptionMethods);

  return {
    fields: {},
    schema: {
      definitions: {
        subscriptionArray: {
          title: "Subscriptions",
          type: "array" as const,
          default: [],
          items: {
            type: "object" as const,
            properties: {
              subscriptionData: {
                type: "object" as const,
                title: "",
                properties: {
                  event: eventSchema,
                  notification: notificationSchema,
                },
              },
            },
          },
        },
      },
      type: "object" as const,
      properties: {
        buildBreakSettings: {
          type: "object" as const,
          title: "",
          properties: {
            notifyOnBuildFailure: {
              type: ["boolean", "null"],
              title: "Build Break Notifications",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.buildBreakSettings?.notifyOnBuildFailure ?? undefined,
              ),
            },
          },
        },
        ...(projectType !== ProjectType.Repo && {
          banner: {
            type: "object" as const,
            title: "Project Banner",
            properties: {
              bannerData: {
                type: "object" as const,
                title: "",
                description:
                  "Add a banner to pages that represent data from this project. JIRA tickets will be linked automatically.",
                properties: {
                  theme: {
                    type: "string" as const,
                    title: "Theme",
                    default: BannerTheme.Announcement,
                    oneOf: Object.keys(bannerThemeToLabelMap).map((k) => ({
                      type: "string" as const,
                      title: k,
                      enum: [k],
                    })),
                  },
                  text: {
                    type: "string" as const,
                    title: "Banner Text",
                  },
                },
              },
            },
          },
        }),
        subscriptions: { $ref: "#/definitions/subscriptionArray" },
        ...(projectType === ProjectType.AttachedProject && {
          repoData: {
            type: "object" as const,
            title: "Repo Subscriptions",
            properties: {
              subscriptions: { $ref: "#/definitions/subscriptionArray" },
            },
          },
        }),
      },
    },
    uiSchema: {
      buildBreakSettings: {
        "ui:rootFieldId": "plugins",
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        notifyOnBuildFailure: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Send notification of build breaks to admins of a project if the commit author is not signed up to receive notifications.",
        },
      },
      ...(projectType !== ProjectType.Repo && {
        banner: {
          "ui:rootFieldId": "banner",
          "ui:ObjectFieldTemplate": CardFieldTemplate,
          bannerData: {
            text: {
              "ui:placeholder": "Enter banner text",
              "ui:data-cy": "banner-text",
            },
            theme: {
              "ui:data-cy": "banner-theme",
              "ui:allowDeselect": false,
              "ui:optionsLabelMap": bannerThemeToLabelMap,
            },
          },
        },
      }),
      subscriptions: {
        "ui:placeholder": "No subscriptions are defined.",
        "ui:descriptionNode": <HelpText />,
        "ui:addButtonText": "Add subscription",
        "ui:orderable": false,
        "ui:useExpandableCard": true,
        items: {
          "ui:displayTitle": "New Subscription",
          "ui:label": false,
          subscriptionData: {
            event: eventUiSchema,
            notification: notificationUiSchema,
          },
        },
      },
      repoData: {
        subscriptions: {
          "ui:placeholder": "Repo has no subscriptions defined.",
          "ui:addable": false,
          "ui:orderable": false,
          "ui:readonly": true,
          "ui:showLabel": false,
          "ui:useExpandableCard": true,
          items: {
            "ui:label": false,
            subscriptionData: {
              event: eventUiSchema,
              notification: notificationUiSchema,
            },
          },
        },
      },
    },
  };
};

const HelpText: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const slackName = spruceConfig?.slack?.name;

  return (
    <Description>
      Private Slack channels may require further Slack configuration.{" "}
      {slackName && (
        <>
          Invite evergreen to your private Slack channels by running{" "}
          <InlineCode>invite {slackName}</InlineCode> in the channel.
        </>
      )}
      <NoteText>
        Note: Project notifications are <b>merged with repo notifications</b>,
        meaning that users will receive duplicate notifications if the repo and
        project are both subscribed to the same event.
      </NoteText>
    </Description>
  );
};

const NoteText = styled.div`
  margin-top: ${size.xxs};
  font-style: italic;
`;
