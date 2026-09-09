import { getFormSchema } from "./getFormSchema";
import { PluginsFormState } from "./types";

describe("getFormSchema", () => {
  it("renders the webhook secret as a normal text input", () => {
    const { uiSchema } = getFormSchema(false);
    const secretField = uiSchema?.buildBaronSettings.fileTicketWebhook.secret;

    expect(secretField).toBeUndefined();
  });

  it("shows an inherited secret in the placeholder", () => {
    const repoData = {
      buildBaronSettings: {
        fileTicketWebhook: { secret: "inherited-secret" },
      },
    } as PluginsFormState;
    const { uiSchema } = getFormSchema(false, undefined, repoData);
    const secretField = uiSchema?.buildBaronSettings.fileTicketWebhook.secret;

    expect(secretField?.["ui:placeholder"]).toBe(
      "inherited-secret (Default from repo)",
    );
  });

  it("explains an editable inherited secret that is hidden", () => {
    const repoData = {
      buildBaronSettings: {
        fileTicketWebhook: { secret: "{REDACTED}" },
      },
    } as PluginsFormState;
    const { uiSchema } = getFormSchema(
      false,
      undefined,
      repoData,
      undefined,
      true,
    );
    const secretField = uiSchema?.buildBaronSettings.fileTicketWebhook.secret;

    expect(secretField?.["ui:description"]).toBe(
      "The inherited secret is hidden. Leave it unchanged to keep it, or enter a new secret to override it.",
    );
  });

  it.each([
    {
      canEdit: false,
      isRepo: false,
      projectSecret: "",
      repoSecret: "{REDACTED}",
    },
    {
      canEdit: true,
      isRepo: true,
      projectSecret: "",
      repoSecret: "{REDACTED}",
    },
    {
      canEdit: true,
      isRepo: false,
      projectSecret: "",
      repoSecret: "inherited-secret",
    },
    {
      canEdit: true,
      isRepo: false,
      projectSecret: "project-secret",
      repoSecret: "{REDACTED}",
    },
  ])(
    "does not explain the hidden secret for unrelated settings",
    ({ canEdit, isRepo, projectSecret, repoSecret }) => {
      const repoData = {
        buildBaronSettings: {
          fileTicketWebhook: { secret: repoSecret },
        },
      } as PluginsFormState;
      const projectData = {
        buildBaronSettings: {
          fileTicketWebhook: { secret: projectSecret },
        },
      } as PluginsFormState;
      const { uiSchema } = getFormSchema(
        isRepo,
        undefined,
        repoData,
        projectData,
        canEdit,
      );
      const secretField = uiSchema?.buildBaronSettings.fileTicketWebhook.secret;

      expect(secretField?.["ui:description"]).toBeUndefined();
    },
  );
});
