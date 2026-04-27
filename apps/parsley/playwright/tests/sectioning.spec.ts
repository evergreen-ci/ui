import { test, expect } from "../fixtures";
import * as helpers from "../helpers";

const logLink =
  "/evergreen/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/task";

const getTargetSelector = (rowIndex: number) =>
  `[data-index='${rowIndex}'] >  [data-cy='section-header']`;

test.describe("Sectioning", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(`${logLink}?shareLine=0`);
    await page.getByTestId("section-header").first().waitFor();
  });

  test("Toggling the sections options displays and hides sections", async ({
    authenticatedPage: page,
  }) => {
    // Check that sections is toggled.
    await helpers.toggleDetailsPanel(page, true);
    await page.locator("button[data-cy='log-viewing-tab']").click();
    await expect(page.getByTestId("sections-toggle")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await helpers.toggleDetailsPanel(page, false);
    // Assert sections are visible.
    expect(await page.getByTestId("section-header").count()).toBeGreaterThan(0);
    // Untoggle sections and assert they are hidden.
    await helpers.clickToggle(page, "sections-toggle", false, "log-viewing");
    await expect(page.getByTestId("section-header")).toHaveCount(0);
  });

  test("Clicking 'Open all subsections' opens all subsections", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("open-all-sections-btn").click();
    const caretToggles = await page.getByTestId("caret-toggle").all();
    for (const toggle of caretToggles) {
      await expect(toggle).toHaveAttribute("aria-label", "Close section");
    }

    const headers = await page.getByTestId("section-header").all();
    for (const header of headers) {
      await expect(header).toHaveAttribute("aria-expanded", "true");
    }

    const sections = await page
      .locator("[title='Use shift+click to select multiple lines']")
      .all();
    for (let i = 0; i < sections.length; i++) {
      await expect(sections[i]).toHaveAttribute("data-cy", `line-index-${i}`);
    }
  });

  test("Clicking 'Close all subsections' opens all subsections", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("close-all-sections-btn").click();

    // Wait for the first caret toggle to update before checking all of them.
    await expect(page.getByTestId("caret-toggle").first()).toHaveAttribute(
      "aria-label",
      "Open section",
    );

    const caretToggles = await page.getByTestId("caret-toggle").all();
    for (const toggle of caretToggles) {
      await expect(toggle).toHaveAttribute("aria-label", "Open section");
    }

    const sectionsCount = page.locator(
      "[title='Use shift+click to select multiple lines']",
    );
    await expect(sectionsCount).toHaveCount(9);

    const openLineNumbers = [0, 1, 2, 8, 9, 9616, 9617, 9618, 9619];
    const sections = await page
      .locator("[title='Use shift+click to select multiple lines']")
      .all();
    for (let i = 0; i < sections.length; i++) {
      await expect(sections[i]).toHaveAttribute(
        "data-cy",
        `line-index-${openLineNumbers[i]}`,
      );
    }
  });

  test("Clicking on a closed caret opens the section and renders the subsection contents", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.locator(getTargetSelector(4))).toContainText(
      "Function: f_expansions_write",
    );
    await page
      .locator(`${getTargetSelector(3)} > [data-cy='caret-toggle']`)
      .click();
    await expect(page.locator(getTargetSelector(4))).toContainText(
      "Command: expansions.update (step 1 of 2)",
    );
  });

  test("Clicking on an open caret closes the section and hides the subsection contents", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.locator(getTargetSelector(9))).toContainText(
      "Command: expansions.write (step 2.1 of 2)",
    );
    await page
      .locator(`${getTargetSelector(8)} > [data-cy='caret-toggle']`)
      .click();
    await expect(page.locator("[data-index='9']")).toContainText(
      "[2024/03/12 11:18:36.035] Running task commands failed: running command: command failed: process encountered problem: exit code 1",
    );
  });

  test("Failing command section is open and scrolled to on page load when share line isn't specified", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(logLink);
    await expect(
      page.getByText(
        "[2024/03/12 11:18:36.034] Command 'subprocess.exec' ('check resmoke failure') in function 'run tests' (step 2.20 of 2) failed: process encountered problem: exit code 1.",
      ),
    ).toBeVisible();
  });

  test("Share line section is open and scrolled to on page load when it is specified", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${logLink}?shareLine=19`);
    await expect(
      page.getByText(
        "[2024/03/12 11:01:53.831] rm -rf /data/db/* mongo-diskstats* mongo-*.tgz ~/.aws ~/.boto venv",
      ),
    ).toBeVisible();
  });

  test("sticky headers are visible when enabled and works properly with scrolling", async ({
    authenticatedPage: page,
  }) => {
    await helpers.clickToggle(
      page,
      "sticky-headers-toggle",
      true,
      "log-viewing",
    );
    await page.getByTestId("open-all-sections-btn").click();
    await page.getByTestId("bookmark-9614").click();
    await expect(page.locator("[data-cy='line-index-9614']")).toBeVisible();
    await expect(page.getByTestId("sticky-headers")).toBeVisible();
    await expect(page.getByTestId("sticky-headers")).toContainText(
      "Function: run tests",
    );
    await expect(page.getByTestId("sticky-headers")).toContainText(
      "Command: subprocess.exec (step 2.20 of 2) — check resmoke failure",
    );
  });
});
