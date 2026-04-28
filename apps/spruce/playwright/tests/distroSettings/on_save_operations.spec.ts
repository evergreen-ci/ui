import { test } from "../../fixtures";
import { validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("using an on-save operation", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/distro/localhost/settings/general");
  });

  test("notes how many hosts were updated in the resulting toast", async ({
    authenticatedPage: page,
  }) => {
    await page.getByLabel("Notes").fill("My note");
    await save(page, "DECOMMISSION");
    await validateToast(
      page,
      "success",
      "Updated distro and scheduled 0 hosts to update.",
      true,
    );
    await page.getByLabel("Notes").clear();
    await save(page, "RESTART_JASPER");
    await validateToast(
      page,
      "success",
      "Updated distro and scheduled 0 hosts to update.",
    );
  });
});
