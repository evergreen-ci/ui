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
});
