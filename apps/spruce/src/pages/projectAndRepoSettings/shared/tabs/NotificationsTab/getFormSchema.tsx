import styled from "@emotion/styled";
import { Description, InlineCode } from "@leafygreen-ui/typography";
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
import { form, ProjectType } from "../utils";
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
          default: [],
          items: {
            properties: {
              subscriptionData: {
                properties: {
                  event: eventSchema,
                  notification: notificationSchema,
                },
                title: "",
                type: "object" as const,
              },
            },
            type: "object" as const,
          },
          title: "Subscriptions",
          type: "array" as const,
        },
      },
      properties: {
        buildBreakSettings: {
          properties: {
            notifyOnBuildFailure: {
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.buildBreakSettings?.notifyOnBuildFailure ?? undefined,
              ),
              title: "Build Break Notifications",
              type: ["boolean", "null"],
            },
          },
          title: "",
          type: "object" as const,
        },
        ...(projectType !== ProjectType.Repo && {
          banner: {
            properties: {
              bannerData: {
                description:
                  "Add a banner to pages that represent data from this project. JIRA tickets will be linked automatically.",
                properties: {
                  text: {
                    title: "Banner Text",
                    type: "string" as const,
                  },
                  theme: {
                    default: BannerTheme.Announcement,
                    oneOf: Object.keys(bannerThemeToLabelMap).map((k) => ({
                      enum: [k],
                      title: k,
                      type: "string" as const,
                    })),
                    title: "Theme",
                    type: "string" as const,
                  },
                },
                title: "",
                type: "object" as const,
              },
            },
            title: "Project Banner",
            type: "object" as const,
          },
        }),
        subscriptions: { $ref: "#/definitions/subscriptionArray" },
        ...(projectType === ProjectType.AttachedProject && {
          repoData: {
            properties: {
              subscriptions: { $ref: "#/definitions/subscriptionArray" },
            },
            title: "Repo Subscriptions",
            type: "object" as const,
          },
        }),
      },
      type: "object" as const,
    },
    uiSchema: {
      buildBreakSettings: {
        notifyOnBuildFailure: {
          "ui:description":
            "Send notification of build breaks to admins of a project if the commit author is not signed up to receive notifications.",
          "ui:widget": widgets.RadioBoxWidget,
        },
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:rootFieldId": "plugins",
      },
      ...(projectType !== ProjectType.Repo && {
        banner: {
          bannerData: {
            text: {
              "ui:data-cy": "banner-text",
              "ui:placeholder": "Enter banner text",
            },
            theme: {
              "ui:allowDeselect": false,
              "ui:data-cy": "banner-theme",
              "ui:optionsLabelMap": bannerThemeToLabelMap,
            },
          },
          "ui:ObjectFieldTemplate": CardFieldTemplate,
          "ui:rootFieldId": "banner",
        },
      }),
      repoData: {
        subscriptions: {
          items: {
            subscriptionData: {
              event: eventUiSchema,
              notification: notificationUiSchema,
            },
            "ui:label": false,
          },
          "ui:addable": false,
          "ui:orderable": false,
          "ui:placeholder": "Repo has no subscriptions defined.",
          "ui:readonly": true,
          "ui:showLabel": false,
          "ui:useExpandableCard": true,
        },
      },
      subscriptions: {
        items: {
          subscriptionData: {
            event: eventUiSchema,
            notification: notificationUiSchema,
          },
          "ui:displayTitle": "New Subscription",
          "ui:label": false,
        },
        "ui:addButtonText": "Add subscription",
        "ui:descriptionNode": (
          <HelpText
            isAttachedToRepo={projectType === ProjectType.AttachedProject}
          />
        ),
        "ui:orderable": false,
        "ui:placeholder": "No subscriptions are defined.",
        "ui:useExpandableCard": true,
      },
    },
  };
};

interface HelpTextProps {
  isAttachedToRepo: boolean;
}

const HelpText: React.FC<HelpTextProps> = ({ isAttachedToRepo }) => {
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
      {isAttachedToRepo && (
        <NoteText>
          Project notifications are{" "}
          <i>
            <b>merged with repo notifications</b>
          </i>
          , meaning that users will receive duplicate notifications if the repo
          and project are subscribed to the same event.
        </NoteText>
      )}
    </Description>
  );
};

const NoteText = styled.div`
  margin-top: ${size.xxs};
`;
