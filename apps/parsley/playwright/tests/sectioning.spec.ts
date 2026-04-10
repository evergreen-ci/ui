import { test, expect } from "../fixtures";
import * as helpers from "../helpers";

const logLink =
  "/evergreen/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/task";

const getTargetSelector = (rowIndex: number) =>
  `[data-index='${rowIndex}'] >  [data-cy='section-header']`;

test.describe("Sectioning", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`${logLink}?shareLine=0`);
    await helpers.clickToggle(
      authenticatedPage,
      "sections-toggle",
      true,
      "log-viewing",
    );
    await authenticatedPage.getByTestId("section-header").first().waitFor();
  });

  test("Toggling the sections options displays and hides sections", async ({
    authenticatedPage,
  }) => {
    // Check that sections is toggled.
    await helpers.toggleDetailsPanel(authenticatedPage, true);
    await authenticatedPage
      .locator("button[data-cy='log-viewing-tab']")
      .click();
    await expect(
      authenticatedPage.getByTestId("sections-toggle"),
    ).toHaveAttribute("aria-checked", "true");
    await helpers.toggleDetailsPanel(authenticatedPage, false);
    // Assert sections are visible.
    expect(
      await authenticatedPage.getByTestId("section-header").count(),
    ).toBeGreaterThan(0);
    // Untoggle sections and assert they are hidden.
    await helpers.clickToggle(
      authenticatedPage,
      "sections-toggle",
      false,
      "log-viewing",
    );
    await expect(authenticatedPage.getByTestId("section-header")).toHaveCount(
      0,
    );
  });

  test("Clicking 'Open all subsections' opens all subsections", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("open-all-sections-btn").click();
    const caretToggles = await authenticatedPage
      .getByTestId("caret-toggle")
      .all();
    for (const toggle of caretToggles) {
      await expect(toggle).toHaveAttribute("aria-label", "Close section");
    }

    const headers = await authenticatedPage.getByTestId("section-header").all();
    for (const header of headers) {
      await expect(header).toHaveAttribute("aria-expanded", "true");
    }

    const sections = await authenticatedPage
      .locator("[title='Use shift+click to select multiple lines']")
      .all();
    for (let i = 0; i < sections.length; i++) {
      await expect(sections[i]).toHaveAttribute("data-cy", `line-index-${i}`);
    }
  });

  test("Clicking 'Close all subsections' opens all subsections", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByTestId("close-all-sections-btn").click();

    // Wait for the first caret toggle to update before checking all of them.
    await expect(
      authenticatedPage.getByTestId("caret-toggle").first(),
    ).toHaveAttribute("aria-label", "Open section");

    const caretToggles = await authenticatedPage
      .getByTestId("caret-toggle")
      .all();
    for (const toggle of caretToggles) {
      await expect(toggle).toHaveAttribute("aria-label", "Open section");
    }

    const sectionsCount = authenticatedPage.locator(
      "[title='Use shift+click to select multiple lines']",
    );
    await expect(sectionsCount).toHaveCount(9);

    const openLineNumbers = [0, 1, 2, 8, 9, 9616, 9617, 9618, 9619];
    const sections = await authenticatedPage
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
    authenticatedPage,
  }) => {
    await expect(authenticatedPage.locator(getTargetSelector(4))).toContainText(
      "Function: f_expansions_write",
    );
    await authenticatedPage
      .locator(`${getTargetSelector(3)} > [data-cy='caret-toggle']`)
      .click();
    await expect(authenticatedPage.locator(getTargetSelector(4))).toContainText(
      "Command: expansions.update (step 1 of 2)",
    );
  });

  test("Clicking on an open caret closes the section and hides the subsection contents", async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage.locator(getTargetSelector(9))).toContainText(
      "Command: expansions.write (step 2.1 of 2)",
    );
    await authenticatedPage
      .locator(`${getTargetSelector(8)} > [data-cy='caret-toggle']`)
      .click();
    await expect(authenticatedPage.locator("[data-index='9']")).toContainText(
      "[2024/03/12 11:18:36.035] Running task commands failed: running command: command failed: process encountered problem: exit code 1",
    );
  });

  test("Failing command section is open and scrolled to on page load when share line isn't specified", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(logLink);
    await expect(
      authenticatedPage.getByText(
        "[2024/03/12 11:18:36.034] Command 'subprocess.exec' ('check resmoke failure') in function 'run tests' (step 2.20 of 2) failed: process encountered problem: exit code 1.",
      ),
    ).toBeVisible();
  });

  test("Share line section is open and scrolled to on page load when it is specified", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.goto(`${logLink}?shareLine=19`);
    await expect(
      authenticatedPage.getByText(
        "[2024/03/12 11:01:53.831] rm -rf /data/db/* mongo-diskstats* mongo-*.tgz ~/.aws ~/.boto venv",
      ),
    ).toBeVisible();
  });

  test("sticky headers are visible when enabled and works properly with scrolling", async ({
    authenticatedPage,
  }) => {
    await helpers.clickToggle(
      authenticatedPage,
      "sticky-headers-toggle",
      true,
      "log-viewing",
    );
    await authenticatedPage.getByTestId("open-all-sections-btn").click();
    await authenticatedPage.getByTestId("bookmark-9614").click();
    await expect(
      authenticatedPage.locator("[data-cy='line-index-9614']"),
    ).toBeVisible();
    await expect(authenticatedPage.getByTestId("sticky-headers")).toBeVisible();
    await expect(authenticatedPage.getByTestId("sticky-headers")).toContainText(
      "Function: run tests",
    );
    await expect(authenticatedPage.getByTestId("sticky-headers")).toContainText(
      "Command: subprocess.exec (step 2.20 of 2) — check resmoke failure",
    );
  });
});
