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
    properties: {
      buildBaronSettings: {
        dependencies: {
          useBuildBaron: {
            oneOf: [
              {
                dependencies: {
                  ticketCreateProject: ["ticketSearchProjects"],
                  ticketSearchProjects: ["ticketCreateProject"],
                },
                properties: {
                  ticketCreateIssueType: {
                    properties: {
                      issueType: {
                        oneOf: Object.values(JiraTicketType).map(
                          (r: string) => ({
                            enum: [r],
                            title: r,
                            type: "string" as const,
                          }),
                        ),
                        title: "",
                        type: "string" as const,
                      },
                    },
                    title: "Ticket Create Issue Type",
                    type: "object" as const,
                  },
                  ticketCreateProject: {
                    properties: {
                      createProject: {
                        format: "noStartingOrTrailingWhitespace",
                        title: "",
                        type: "string" as const,
                      },
                    },
                    title: "Ticket Create Project",
                    type: "object" as const,
                  },
                  ticketSearchProjects: {
                    items: {
                      properties: {
                        searchProject: {
                          default: "",
                          minLength: 1,
                          title: "Search Project",
                          type: "string" as const,
                        },
                      },
                      type: "object" as const,
                    },
                    title: "Ticket Search Projects",
                    type: "array" as const,
                  },
                  useBuildBaron: {
                    enum: [true],
                  },
                },
              },
              {
                properties: {
                  fileTicketWebhook: {
                    properties: {
                      endpoint: {
                        default: "",
                        minLength: 1,
                        title: "Webhook Endpoint",
                        type: "string" as const,
                      },
                      secret: {
                        default: "",
                        minLength: 1,
                        title: "Webhook Secret",
                        type: "string" as const,
                      },
                    },
                    title: "Custom Ticket Creation",
                    type: "object" as const,
                  },
                  useBuildBaron: {
                    enum: [false],
                  },
                },
              },
            ],
          },
        },
        properties: {
          useBuildBaron: {
            oneOf: radioBoxOptions([
              "JIRA Ticket Search and Create",
              "Custom Ticket Creation",
            ]),
            type: "boolean" as const,
          },
        },
        title: "Ticket Creation",
        type: "object" as const,
      },
      externalLinks: {
        items: {
          properties: {
            displayName: {
              default: "",
              format: "noStartingOrTrailingWhitespace",
              maxLength: 40,
              minLength: 1,
              title: "Display name",
              type: "string" as const,
            },
            requesters: {
              default: [],
              items: {
                anyOf: requesters.map((r) => ({
                  enum: [r.value],
                  title: r.label,
                  type: "string" as const,
                })),
                type: "string" as const,
              },
              title: "Requesters",
              type: "array" as const,
              uniqueItems: true,
            },
            urlTemplate: {
              default: "",
              format: "validURLTemplate",
              minLength: 1,
              title: "URL template",
              type: "string" as const,
            },
          },
          type: "object" as const,
        },
        maxItems: 5,
        title: "Metadata Links",
        type: "array" as const,
      },
      performanceSettings: {
        properties: {
          perfEnabled: {
            oneOf: radioBoxOptions(
              ["Enabled", "Disabled"],
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              repoData?.performanceSettings?.perfEnabled,
            ),
            title: "",
            type: ["boolean", "null"],
          },
        },
        title: "Performance Plugins",
        type: "object" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    buildBaronSettings: {
      fileTicketWebhook: {
        endpoint: placeholderIf(
          repoData?.buildBaronSettings?.fileTicketWebhook?.endpoint,
        ),
        secret: placeholderIf(
          repoData?.buildBaronSettings?.fileTicketWebhook?.secret,
        ),
        "ui:description":
          "Specify the endpoint and secret for a custom webhook to be called when the File Ticket button is clicked on a failing task.",
      },
      ticketCreateIssueType: {
        issueType: {
          "ui:allowDeselect": false,
        },
        "ui:description":
          "Specify a JIRA issue type for tickets created by the File Ticket button.",
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
      ticketSearchProjects: {
        items: {
          "ui:label": false,
        },
        "ui:addButtonText": "Add search project",
        "ui:description":
          "Specify an existing JIRA project to search for tickets related to a failing task.",
        "ui:orderable": false,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "buildBaron",
      useBuildBaron: {
        "ui:data-cy": "enabled-radio-box",
        "ui:showLabel": false,
        "ui:widget": widgets.RadioBoxWidget,
      },
    },
    externalLinks: {
      items: {
        displayName: {
          "ui:data-cy": "display-name-input",
        },
        requesters: {
          "ui:data-cy": "requesters-input",
          "ui:widget": widgets.MultiSelectWidget,
        },
        "ui:data-cy": "metadata-link",
        "ui:displayTitle": "New Metadata Link",
        urlTemplate: {
          "ui:data-cy": "url-template-input",
          "ui:description":
            "Include {version_id} in the URL template and it will be replaced by an actual version ID.",
          "ui:placeholder": "https://example.com/{version_id}",
        },
      },
      "ui:addButtonText": "Add metadata link",
      "ui:description":
        "Add URLs to the metadata panel for versions with the specified requester.",
      "ui:orderable": false,
      "ui:placeholder": "No metadata links are defined.",
      "ui:rootFieldId": "externalLinks",
      "ui:useExpandableCard": true,
    },
    performanceSettings: {
      perfEnabled: {
        "ui:description": isRepo
          ? "This setting is disabled at the repo level."
          : "Enable the performance plugin (this requires the project to have matching ID and identifier).",
        "ui:disabled": isRepo,
        "ui:widget": widgets.RadioBoxWidget,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "plugins",
    },
  },
});
