import { getFormSchema } from "./getFormSchema";
import { PluginsFormState } from "./types";

describe("getFormSchema", () => {
  it("renders the webhook secret as a write-only password", () => {
    const { uiSchema } = getFormSchema(false);
    const secretField = uiSchema?.buildBaronSettings.fileTicketWebhook.secret;

    expect(secretField).toMatchObject({
      "ui:description":
        "Stored secrets are never shown. Enter a value to set or replace the secret.",
      "ui:inputType": "password",
    });
  });

  it("does not expose an inherited secret in the placeholder", () => {
    const repoData = {
      buildBaronSettings: {
        fileTicketWebhook: { secret: "sensitive-value" },
      },
    } as PluginsFormState;
    const { uiSchema } = getFormSchema(false, undefined, repoData);
    const secretField = uiSchema?.buildBaronSettings.fileTicketWebhook.secret;

    expect(secretField?.["ui:placeholder"]).toBe(
      "Secret configured (default from repo)",
    );
    expect(JSON.stringify(secretField)).not.toContain("sensitive-value");
  });
});
