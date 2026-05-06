import { test, expect } from "../../fixtures";

test.describe("Host page title and sidebar", () => {
  const pathWithTask = "/host/i-0fb9fe0592ea3815";
  const pathNoTask = "/host/macos-1014-68.macstadium.build.10gen";

  test("title shows the host name", async ({ authenticatedPage: page }) => {
    await page.goto(pathNoTask);
    await expect(page.getByTestId("page-title")).toContainText(
      "Host: macos-1014-68.macstadium.build.10gen",
    );
  });

  test.describe("Metadata card", () => {
    test("Current task should display none when running task does not exist", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(pathNoTask);
      await expect(page.getByTestId("current-running-task")).toContainText(
        "none",
      );
    });

    test("Distro and current running links should have href", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(pathWithTask);
      await expect(page.getByTestId("distro-link")).toHaveAttribute("href");
      await expect(page.getByTestId("running-task-link")).toHaveAttribute(
        "href",
      );
    });

    test("SSH command has the correct values", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(pathWithTask);
      await expect(page.getByTestId("ssh-command")).toContainText(
        "ssh admin@ec2-54-146-18-248.compute-1.amazonaws.com",
      );
    });
  });
});
