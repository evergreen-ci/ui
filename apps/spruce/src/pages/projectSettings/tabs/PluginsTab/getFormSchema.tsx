import { InlineCode } from "@leafygreen-ui/typography";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { JiraTicketType } from "types/jira";
import { form } from "../utils";
import { PluginsFormState } from "./types";

const { placeholderIf, radioBoxOptions } = form;

const requesters = [
  {
    label: "Commits",
    value: "gitter_request",
  },
  {
    label: "Patches",
    value: "patch_request",
  },
  {
    label: "GitHub Pull Requests",
    value: "github_pull_request",
  },
  {
    label: "Periodic Builds",
    value: "ad_hoc",
  },
];

export const getFormSchema = (
  isRepo: boolean,
  jiraEmail?: string,
  repoData?: PluginsFormState,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      performanceSettings: {
        type: "object" as const,
        title: "Performance Plugins",
        properties: {
          perfEnabled: {
            type: ["boolean", "null"],
            title: "",
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.performanceSettings?.perfEnabled,
            ),
          },
        },
      },
      buildBaronSettings: {
        type: "object" as const,
        title: "Ticket Creation",
        properties: {
          useBuildBaron: {
            type: "boolean" as const,
            oneOf: radioBoxOptions([
              "JIRA Ticket Search and Create",
              "Custom Ticket Creation",
            ]),
          },
        },
        dependencies: {
          useBuildBaron: {
            oneOf: [
              {
                dependencies: {
                  ticketSearchProjects: ["ticketCreateProject"],
                  ticketCreateProject: ["ticketSearchProjects"],
                },
                properties: {
                  useBuildBaron: {
                    enum: [true],
                  },
                  ticketSearchProjects: {
                    type: "array" as const,
                    title: "Ticket Search Projects",
                    items: {
                      type: "object" as const,
                      properties: {
                        searchProject: {
                          type: "string" as const,
                          title: "Search Project",
                          minLength: 1,
                          default: "",
                        },
                      },
                    },
                  },
                  ticketCreateProject: {
                    type: "object" as const,
                    title: "Ticket Create Project",
                    properties: {
                      createProject: {
                        type: "string" as const,
                        title: "",
                        format: "noStartingOrTrailingWhitespace",
                      },
                    },
                  },
                  ticketCreateIssueType: {
                    type: "object" as const,
                    title: "Ticket Create Issue Type",
                    properties: {
                      issueType: {
                        type: "string" as const,
                        title: "",
                        oneOf: Object.values(JiraTicketType).map(
                          (r: string) => ({
                            type: "string" as const,
                            title: r,
                            enum: [r],
                          }),
                        ),
                      },
                    },
                  },
                },
              },
              {
                properties: {
                  useBuildBaron: {
                    enum: [false],
                  },
                  fileTicketWebhook: {
                    type: "object" as const,
                    title: "Custom Ticket Creation",
                    properties: {
                      endpoint: {
                        type: "string" as const,
                        title: "Webhook Endpoint",
                        minLength: 1,
                        default: "",
                      },
                      secret: {
                        type: "string" as const,
                        title: "Webhook Secret",
                        minLength: 1,
                        default: "",
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      },
      externalLinks: {
        type: "array" as const,
        title: "Metadata Links",
        maxItems: 5,
        items: {
          type: "object" as const,
          properties: {
            requesters: {
              type: "array" as const,
              title: "Requesters",
              uniqueItems: true,
              items: {
                type: "string" as const,
                anyOf: requesters.map((r) => ({
                  type: "string" as const,
                  title: r.label,
                  enum: [r.value],
                })),
              },
              default: [],
            },
            displayName: {
              type: "string" as const,
              title: "Display name",
              default: "",
              minLength: 1,
              maxLength: 40,
              format: "noStartingOrTrailingWhitespace",
            },
            urlTemplate: {
              type: "string" as const,
              title: "URL template",
              default: "",
              minLength: 1,
              format: "validURLTemplate",
            },
          },
        },
      },
    },
  },
  uiSchema: {
    performanceSettings: {
      "ui:rootFieldId": "plugins",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      perfEnabled: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:disabled": isRepo,
        "ui:description": isRepo
          ? "This setting is disabled at the repo level."
          : "Enable the performance plugin (this requires the project to have matching ID and identifier).",
      },
    },
    buildBaronSettings: {
      "ui:rootFieldId": "buildBaron",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      useBuildBaron: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
        "ui:data-cy": "enabled-radio-box",
      },
      ticketSearchProjects: {
        "ui:description":
          "Specify an existing JIRA project to search for tickets related to a failing task.",
        "ui:addButtonText": "Add Search Project",
        "ui:orderable": false,
        items: {
          "ui:label": false,
        },
      },
      ticketCreateIssueType: {
        "ui:description":
          "Specify a JIRA issue type for tickets created by the File Ticket button.",
        issueType: {
          "ui:allowDeselect": false,
        },
      },
      ticketCreateProject: {
        "ui:description": (
          <>
            Specify an existing JIRA project to create tickets in when the File
            Ticket button is clicked on a failing task.
            {jiraEmail && (
              <>
                {" "}
                This project must include <InlineCode>
                  {jiraEmail}
                </InlineCode>{" "}
                as a user with create permissions.
              </>
            )}
          </>
        ),
      },
      fileTicketWebhook: {
        "ui:description":
          "Specify the endpoint and secret for a custom webhook to be called when the File Ticket button is clicked on a failing task.",
        endpoint: placeholderIf(
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          repoData?.buildBaronSettings?.fileTicketWebhook?.endpoint,
        ),
        secret: placeholderIf(
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          repoData?.buildBaronSettings?.fileTicketWebhook?.secret,
        ),
      },
    },
    externalLinks: {
      "ui:rootFieldId": "externalLinks",
      "ui:placeholder": "No metadata links are defined.",
      "ui:description":
        "Add URLs to the metadata panel for versions with the specified requester.",
      "ui:addButtonText": "Add metadata link",
      "ui:orderable": false,
      "ui:useExpandableCard": true,
      items: {
        "ui:displayTitle": "New Metadata Link",
        requesters: {
          "ui:widget": widgets.MultiSelectWidget,
          "ui:data-cy": "requesters-input",
        },
        displayName: {
          "ui:data-cy": "display-name-input",
        },
        urlTemplate: {
          "ui:placeholder": "https://example.com/{version_id}",
          "ui:data-cy": "url-template-input",
          "ui:description":
            "Include {version_id} in the URL template and it will be replaced by an actual version ID.",
        },
      },
    },
  },
});
