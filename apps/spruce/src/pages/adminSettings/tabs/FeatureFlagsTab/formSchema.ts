import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";

const serviceItems = [
  "Dispatch tasks",
  "Large parser projects",
  "Create and provision hosts",
  "Create and provision pods",
  "Monitor hosts and tasks",
  "Start agents on hosts",
  "Schedule tasks",
  "Host Allocator",
  "Auto-restart system failures",
  "Allocate pods for container tasks",
  "Clean up unrecognized pods",
  "Cloud Provider Cleanup",
];

const notificationItems = [
  "Process notification events",
  "Alert for spawn host expiration",
  "Send JIRA notifications",
  "Send Slack notifications",
  "Send Email notifications",
  "Send Webhook notifications",
  "Send Github PR status notifications",
];

const featureItems = [
  "Track GitHub repositories",
  "Test GitHub pull requests",
  "CPU Degraded Mode",
  "Global GitHub Token",
  "Check Blocked Tasks",
  "Persist task and test logs",
  "Update CLI",
  "Unexpirable host sleep schedule",
];

const batchJobItems = [
  "Collect background statistics",
  "Cache historical statistics",
  "Background Data Cleanup",
];

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      services: {
        type: "object" as const,
        title: "Services",
        properties: Object.fromEntries(
          serviceItems.map((item) => [
            item.replace(/\s+/g, "").toLowerCase(),
            {
              type: "boolean" as const,
              title: item,
              oneOf: [
                { const: true, title: "Enabled" },
                { const: false, title: "Disabled" },
              ],
            },
          ]),
        ),
      },
      notifications: {
        type: "object" as const,
        title: "Notifications",
        properties: Object.fromEntries(
          notificationItems.map((item) => [
            item.replace(/\s+/g, "").toLowerCase(),
            {
              type: "boolean" as const,
              title: item,
              oneOf: [
                { const: true, title: "Enabled" },
                { const: false, title: "Disabled" },
              ],
            },
          ]),
        ),
      },
      features: {
        type: "object" as const,
        title: "Features",
        properties: Object.fromEntries(
          featureItems.map((item) => [
            item.replace(/\s+/g, "").toLowerCase(),
            {
              type: "boolean" as const,
              title: item,
              oneOf: [
                { const: true, title: "Enabled" },
                { const: false, title: "Disabled" },
              ],
            },
          ]),
        ),
      },
      batchJobs: {
        type: "object" as const,
        title: "Batch Jobs",
        properties: Object.fromEntries(
          batchJobItems.map((item) => [
            item.replace(/\s+/g, "").toLowerCase(),
            {
              type: "boolean" as const,
              title: item,
              oneOf: [
                { const: true, title: "Enabled" },
                { const: false, title: "Disabled" },
              ],
            },
          ]),
        ),
      },
      disabledGqlQueries: {
        type: "array" as const,
        title: "Disabled GQL Queries",
        items: {
          type: "string" as const,
        },
      },
    },
  },
  uiSchema: {
    services: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...Object.fromEntries(
        serviceItems.map((item) => [
          item.replace(/\s+/g, "").toLowerCase(),
          { "ui:widget": widgets.RadioBoxWidget },
        ]),
      ),
    },
    notifications: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...Object.fromEntries(
        notificationItems.map((item) => [
          item.replace(/\s+/g, "").toLowerCase(),
          { "ui:widget": widgets.RadioBoxWidget },
        ]),
      ),
    },
    features: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...Object.fromEntries(
        featureItems.map((item) => [
          item.replace(/\s+/g, "").toLowerCase(),
          { "ui:widget": widgets.RadioBoxWidget },
        ]),
      ),
    },
    batchJobs: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      ...Object.fromEntries(
        batchJobItems.map((item) => [
          item.replace(/\s+/g, "").toLowerCase(),
          { "ui:widget": widgets.RadioBoxWidget },
        ]),
      ),
    },
    disabledGqlQueries: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:addButtonText": "+ Add",
      "ui:orderable": false,
      "ui:placeholder": "Query name",
    },
  },
});
