import { test, expect } from "../../fixtures";
import { selectOption, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("host section", () => {
  test.describe("using legacy ssh", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/distro/localhost/settings/host");
    });

    test("shows the correct fields when distro has static provider", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("authorized-keys-input")).toBeVisible();
      await expect(page.getByTestId("minimum-hosts-input")).toHaveCount(0);
      await expect(page.getByTestId("maximum-hosts-input")).toHaveCount(0);
      await expect(page.getByTestId("idle-time-input")).toHaveCount(0);
      await expect(page.getByTestId("future-fraction-input")).toHaveCount(0);
      await expect(page.getByTestId("rounding-rule-select")).toHaveCount(0);
      await expect(page.getByTestId("feedback-rule-select")).toHaveCount(0);
    });

    test("shows an error when selecting an incompatible host communication method", async ({
      authenticatedPage: page,
    }) => {
      await selectOption(
        page,
        { testId: "communication-method-select" },
        "RPC",
      );
      await expect(
        page.getByText(
          "Legacy and non-legacy bootstrapping and communication are incompatible.",
        ),
      ).toBeVisible();
    });

    test("updates host fields", async ({ authenticatedPage: page }) => {
      await selectOption(page, "Agent Architecture", "Linux ARM 64-bit");
      await page.getByLabel("Working Directory").clear();
      await page.getByLabel("Working Directory").fill("/usr/local/bin");
      await page.getByLabel("SSH User").clear();
      await page.getByLabel("SSH User").fill("sudo");
      await page.getByRole("button", { name: "Add SSH option" }).click();
      await page.getByLabel("SSH Option").fill("BatchMode=yes");
      await selectOption(
        page,
        "Host Overallocation Rule",
        "Terminate hosts when overallocated",
      );

      await save(page);
      await validateToast(page, "success", "Updated distro.");

      await selectOption(page, "Agent Architecture", "Linux 64-bit");
      await page.getByLabel("Working Directory").clear();
      await page.getByLabel("Working Directory").fill("/home/ubuntu/smoke");
      await page.getByLabel("SSH User").clear();
      await page.getByLabel("SSH User").fill("ubuntu");
      await page.getByTestId("delete-item-button").click();
      await selectOption(page, "Host Overallocation Rule", "Default");

      await save(page);
      await validateToast(page, "success", "Updated distro.");
    });

    test("updates mountpoints", async ({ authenticatedPage: page }) => {
      await expect(
        page.getByRole("button", { name: "Add mountpoint" }),
      ).toHaveAttribute("aria-disabled", "false");
      await page.getByRole("button", { name: "Add mountpoint" }).click();
      await page.getByLabel("Mountpoint").fill("/data");

      await save(page);
      await validateToast(page, "success", "Updated distro.");

      await page.getByTestId("delete-item-button").click();

      await save(page);
      await validateToast(page, "success", "Updated distro.");
    });
  });

  test.describe("using User Data bootstrap method", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/distro/ubuntu1604-parent/settings/host");
      await selectOption(
        page,
        { testId: "bootstrap-method-select" },
        "User Data",
      );
      await selectOption(
        page,
        { testId: "communication-method-select" },
        "RPC",
      );
    });

    test("shows Windows-only fields when the architecture is updated", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByLabel("Root Directory")).toHaveCount(0);
      await expect(page.getByLabel("Service User")).toHaveCount(0);

      await selectOption(page, "Agent Architecture", "Windows 64-bit");

      await expect(page.getByLabel("Root Directory")).toBeVisible();
      await expect(page.getByLabel("Service User")).toBeVisible();
    });

    test("hides resource limit fields when the architecture is not Linux", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByText("Resource Limits")).toBeVisible();
      await selectOption(page, "Agent Architecture", "Windows 64-bit");
      await expect(page.getByText("Resource Limits")).toHaveCount(0);
    });

    test("saves bootstrap settings", async ({ authenticatedPage: page }) => {
      await page.getByLabel("Jasper Binary Directory").fill("/jasper/binary");
      await page
        .getByLabel("Jasper Credentials Path")
        .fill("/jasper/credentials");
      await page.getByLabel("Client Directory").fill("/client/dir");
      await page.getByLabel("Shell Path").fill("/shell/path");
      await page
        .getByLabel("Home Volume Format Command")
        .fill("echo 'Hello World'");
      await page.getByLabel("Number of Files").fill("10");
      await page.getByLabel("Number of CGroup Tasks").fill("20");
      await page.getByLabel("Number of Processes").fill("30");
      await page.getByLabel("Locked Memory").fill("128");
      await page.getByLabel("Virtual Memory").fill("256");

      await page.getByRole("button", { name: "Add variable" }).click();
      await page.getByLabel("Key").fill("my-key");
      await page.getByLabel("Value").fill("my-value");

      await page.getByRole("button", { name: "Add script" }).click();
      await page.getByLabel(/^Path$/).fill("/path/to/precondition/script");
      await page.getByLabel(/^Script$/).fill("script contents here");

      await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
      await save(page);
      await validateToast(page, "success", "Updated distro.");
    });
  });
});
