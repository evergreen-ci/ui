import { Page } from "@playwright/test";
import { test, expect } from "../../fixtures";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
  projectUseRepoEnabled,
} from "./constants";
import { save } from "./utils";

test.describe("Plugins", () => {
  const patchPage = "version/5ecedafb562343215a7ff297";

  const addMetadataLink = async (
    page: Page,
    metadataLink: { displayName: string; url: string },
  ) => {
    await page
      .getByRole("button", { name: "Add metadata link" })
      .scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Add metadata link" }).click();

    const mostRecentMetadataLink = page
      .getByTestId("metadata-link-item")
      .first();
    await mostRecentMetadataLink.getByTestId("requesters-input").click();

    const options = mostRecentMetadataLink.getByTestId("tree-select-options");
    await expect(options).toBeVisible();
    await options.getByText("Patches").click();

    await mostRecentMetadataLink.getByTestId("requesters-input").click();
    await mostRecentMetadataLink
      .getByTestId("display-name-input")

      .fill(metadataLink.displayName);
    await mostRecentMetadataLink
      .getByTestId("url-template-input")
      .fill(metadataLink.url);
  };

  test("Should be able to set external links to render on patch metadata panel", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      getProjectSettingsRoute(
        projectUseRepoEnabled,
        ProjectSettingsTabRoutes.Plugins,
      ),
    );
    await addMetadataLink(page, {
      displayName: "An external link 1",
      url: "https://example-1.com/{version_id}",
    });
    await addMetadataLink(page, {
      displayName: "An external link 2",
      url: "https://example-2.com/{version_id}",
    });
    await expect(page.getByTestId("metadata-link-item")).toHaveCount(2);
    await save(page);

    await page.goto(patchPage);
    await expect(page.getByTestId("external-link")).toHaveCount(2);
    await expect(page.getByTestId("external-link").last()).toContainText(
      "An external link 1",
    );
    await expect(page.getByTestId("external-link").last()).toHaveAttribute(
      "href",
      "https://example-1.com/5ecedafb562343215a7ff297",
    );
    await expect(page.getByTestId("external-link").first()).toContainText(
      "An external link 2",
    );
    await expect(page.getByTestId("external-link").first()).toHaveAttribute(
      "href",
      "https://example-2.com/5ecedafb562343215a7ff297",
    );

    await page.goto(
      getProjectSettingsRoute(
        projectUseRepoEnabled,
        ProjectSettingsTabRoutes.Plugins,
      ),
    );
    await page.getByTestId("delete-item-button").first().click();
    await page.getByTestId("delete-item-button").first().click();
    await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
    await save(page);

    await page.goto(patchPage);
    await expect(page.getByTestId("external-link")).toHaveCount(0);
  });
});
