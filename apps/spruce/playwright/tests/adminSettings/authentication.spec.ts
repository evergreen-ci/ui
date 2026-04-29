import { test, expect } from "../../fixtures";
import { clickCheckbox, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("authentication", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings");
  });

  test("can save after making changes to authentication settings", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toBeDisabled();

    // Global Config section.
    const allowServiceUsersCheckbox = page.getByRole("checkbox", {
      name: "Allow Service Users",
    });
    await clickCheckbox(allowServiceUsersCheckbox);

    await page.getByLabel("Background Reauthentication (Mins)").clear();
    await page.getByLabel("Background Reauthentication (Mins)").fill("120");

    // Okta section.
    const okta = page.getByTestId("okta");
    await okta.getByLabel("Client ID").clear();
    await okta.getByLabel("Client ID").fill("test-okta-client-id");
    await okta.getByLabel("Client Secret").clear();
    await okta.getByLabel("Client Secret").fill("test-okta-client-secret");
    await okta.getByLabel("Issuer").clear();
    await okta.getByLabel("Issuer").fill("https://test.okta.com");
    await okta.getByLabel("User Group").clear();
    await okta.getByLabel("User Group").fill("test-users");
    await okta.getByLabel("Expire After (Mins)").clear();
    await okta.getByLabel("Expire After (Mins)").fill("480");
    await okta.getByLabel("Scopes").fill("openid");
    await okta.getByLabel("Scopes").press("Enter");
    await okta.getByLabel("Scopes").fill("profile");
    await okta.getByLabel("Scopes").press("Enter");
    await okta.getByLabel("Scopes").fill("email");
    await okta.getByLabel("Scopes").press("Enter");

    // GitHub section.
    const github = page.getByTestId("github");
    await github.getByLabel("App ID").clear();
    await github.getByLabel("App ID").fill("54321");
    await github.getByLabel("Client ID").clear();
    await github.getByLabel("Client ID").fill("test-github-client-id");
    await github.getByLabel("Client Secret").clear();
    await github.getByLabel("Client Secret").fill("test-github-client-secret");
    await github.getByLabel("Default Owner").clear();
    await github.getByLabel("Default Owner").fill("test-owner");
    await github.getByLabel("Default Repository").clear();
    await github.getByLabel("Default Repository").fill("test-repo");
    await github.getByLabel("Organization").clear();
    await github.getByLabel("Organization").fill("test-org");
    await github.getByLabel("Users").fill("testuser1");
    await github.getByLabel("Users").press("Enter");
    await github.getByLabel("Users").fill("testuser2");
    await github.getByLabel("Users").press("Enter");

    // Naive section.
    const naive = page.getByTestId("naive");
    await naive.getByRole("button", { name: "Add" }).click();
    await naive.getByLabel("Display Name").first().fill("Test User 1");
    await naive.getByLabel("Email").first().fill("test1@example.com");
    await naive.getByLabel("Password").first().fill("password123");
    await naive.getByLabel("Username").first().fill("testuser1");

    // Multi read-write section.
    await page.getByTestId("multi-read-write").click();
    const multiReadWriteOptions = page.getByTestId("multi-read-write-options");
    const oktaCheckbox = multiReadWriteOptions.getByRole("checkbox", {
      name: "Okta",
    });
    await clickCheckbox(oktaCheckbox);
    await page.getByTestId("multi-read-write").click();

    // Multi read-only section.
    await page.getByTestId("multi-read-only").click();
    const multiReadOnlyOptions = page.getByTestId("multi-read-only-options");
    const naiveCheckbox = multiReadOnlyOptions.getByRole("checkbox", {
      name: "Naive",
    });
    await clickCheckbox(naiveCheckbox);
    await page.getByTestId("multi-read-only").click();

    // Kanopy section.
    const kanopy = page.getByTestId("kanopy");
    await kanopy.getByLabel("Header Name").clear();
    await kanopy.getByLabel("Header Name").fill("X-Test-Auth-Token");
    await kanopy.getByLabel("Issuer").clear();
    await kanopy.getByLabel("Issuer").fill("https://test-kanopy.example.com");
    await kanopy.getByLabel("Keyset URL").clear();
    await kanopy
      .getByLabel("Keyset URL")
      .fill("https://test-kanopy.example.com/.well-known/jwks.json");

    // OAuth section.
    const oauth = page.getByTestId("oauth");
    await oauth.getByLabel("Client ID").clear();
    await oauth.getByLabel("Client ID").fill("oauth-client-id");
    await oauth.getByLabel("Issuer").clear();
    await oauth.getByLabel("Issuer").fill("https://test-oauth.example.com");
    await oauth.getByLabel("Connector ID").clear();
    await oauth.getByLabel("Connector ID").fill("oauth-connector-id");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    // Verify Global Config.
    await expect(allowServiceUsersCheckbox).toBeChecked();
    await expect(
      page.getByLabel("Background Reauthentication (Mins)"),
    ).toHaveValue("120");

    // Verify Okta settings.
    await expect(okta.getByLabel("Client ID")).toHaveValue(
      "test-okta-client-id",
    );
    await expect(okta.getByLabel("Client Secret")).toHaveValue(
      "test-okta-client-secret",
    );
    await expect(okta.getByLabel("Issuer")).toHaveValue(
      "https://test.okta.com",
    );
    await expect(okta.getByLabel("User Group")).toHaveValue("test-users");
    await expect(okta.getByLabel("Expire After (Mins)")).toHaveValue("480");
    await expect(okta.getByTestId("filter-chip")).toHaveCount(3);
    await expect(
      okta.getByTestId("filter-chip").filter({ hasText: "openid" }),
    ).toBeVisible();
    await expect(
      okta.getByTestId("filter-chip").filter({ hasText: "profile" }),
    ).toBeVisible();
    await expect(
      okta.getByTestId("filter-chip").filter({ hasText: "email" }),
    ).toBeVisible();

    // Verify GitHub settings.
    await expect(github.getByLabel("App ID")).toHaveValue("54321");
    await expect(github.getByLabel("Client ID")).toHaveValue(
      "test-github-client-id",
    );
    await expect(github.getByLabel("Client Secret")).toHaveValue(
      "test-github-client-secret",
    );
    await expect(github.getByLabel("Default Owner")).toHaveValue("test-owner");
    await expect(github.getByLabel("Default Repository")).toHaveValue(
      "test-repo",
    );
    await expect(github.getByLabel("Organization")).toHaveValue("test-org");
    await expect(github.getByTestId("filter-chip")).toHaveCount(2);
    await expect(
      github.getByTestId("filter-chip").filter({ hasText: "testuser1" }),
    ).toBeVisible();
    await expect(
      github.getByTestId("filter-chip").filter({ hasText: "testuser2" }),
    ).toBeVisible();

    // Verify Naive user was added.
    await expect(naive.getByLabel("Display Name").first()).toHaveValue(
      "Test User 1",
    );
    await expect(naive.getByLabel("Email").first()).toHaveValue(
      "test1@example.com",
    );
    await expect(naive.getByLabel("Password").first()).toHaveValue(
      "password123",
    );
    await expect(naive.getByLabel("Username").first()).toHaveValue("testuser1");

    // Verify Multi settings.
    await page.getByTestId("multi-read-write").click();
    await expect(oktaCheckbox).toBeChecked();
    await page.getByTestId("multi-read-write").click();

    await page.getByTestId("multi-read-only").click();
    await expect(naiveCheckbox).toBeChecked();
    await page.getByTestId("multi-read-only").click();

    // Verify Kanopy settings.
    await expect(kanopy.getByLabel("Header Name")).toHaveValue(
      "X-Test-Auth-Token",
    );
    await expect(kanopy.getByLabel("Issuer")).toHaveValue(
      "https://test-kanopy.example.com",
    );
    await expect(kanopy.getByLabel("Keyset URL")).toHaveValue(
      "https://test-kanopy.example.com/.well-known/jwks.json",
    );

    // Verify OAuth settings.
    await expect(oauth.getByLabel("Client ID")).toHaveValue("oauth-client-id");
    await expect(oauth.getByLabel("Issuer")).toHaveValue(
      "https://test-oauth.example.com",
    );
    await expect(oauth.getByLabel("Connector ID")).toHaveValue(
      "oauth-connector-id",
    );
  });
});
