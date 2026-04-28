import { test, expect } from "../../fixtures";

test.describe("Build information", () => {
  test.describe("general", () => {
    test("should show correct property values", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("general-table-row")).toHaveCount(4);
      await expect(page.getByTestId("general-table-row").nth(0)).toContainText(
        "Last deployed",
      );
      await expect(page.getByTestId("general-table-row").nth(1)).toContainText(
        "Amazon Machine Image (AMI)",
      );
      await expect(page.getByTestId("general-table-row").nth(2)).toContainText(
        "Latest task",
      );
      await expect(page.getByTestId("general-table-row").nth(3)).toContainText(
        "Latest task time",
      );
    });
  });

  test.describe("distros", () => {
    test("should show the corresponding distros", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu1804");
      await expect(page.getByTestId("distro-table-row")).toHaveCount(1);
      await expect(page.getByText("ubuntu1804-workstation")).toBeVisible();
    });
  });

  test.describe("os", () => {
    test("should show the corresponding OS info", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("os-table-row")).toHaveCount(10);
    });

    test("should show different OS info on different pages", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("os-table-row")).toHaveCount(10);

      // First OS info name on first page.
      const firstOSName = await page
        .getByTestId("os-table-row")
        .first()
        .locator("td")
        .first()
        .textContent();

      const osCard = page.getByTestId("os-card");
      await osCard.getByRole("button", { name: "Next page" }).click();

      // First OS info name on second page.
      const nextOSName = page
        .getByTestId("os-table-row")
        .first()
        .locator("td")
        .first();
      // OS info names should not be equal.
      await expect(nextOSName).not.toHaveText(firstOSName!);
    });

    test("should show no OS info when filtering for nonexistent item", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("os-table-row")).toHaveCount(10);
      await page.getByTestId("os-name-filter").click();
      await page.getByPlaceholder("Name regex").fill("fakeOS");
      await page.getByPlaceholder("Name regex").press("Enter");
      await expect(page.getByTestId("os-table-row")).toHaveCount(0);
    });
  });

  test.describe("packages", () => {
    test("should show the corresponding packages", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("packages-table-row")).toHaveCount(10);
    });

    test("should show different package on new page", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("packages-table-row")).toHaveCount(10);

      // First package name on first page.
      const firstPackageName = await page
        .getByTestId("packages-table-row")
        .first()
        .locator("td")
        .first()
        .textContent();

      const packagesCard = page.getByTestId("packages-card");
      await packagesCard.getByRole("button", { name: "Next page" }).click();

      // First package name on second page.
      const nextPackageName = page
        .getByTestId("packages-table-row")
        .first()
        .locator("td")
        .first();
      // Package names should not be equal.
      await expect(nextPackageName).not.toHaveText(firstPackageName!);
    });

    test("should show no packages when filtering for nonexistent item", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("packages-table-row")).toHaveCount(10);
      await page.getByTestId("package-name-filter").click();
      await page.getByPlaceholder("Name regex").fill("boguspackage");
      await page.getByPlaceholder("Name regex").press("Enter");
      await expect(page.getByTestId("packages-table-row")).toHaveCount(0);
    });
  });

  test.describe("toolchains", () => {
    test("should show the corresponding toolchains", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("toolchains-table-row")).toHaveCount(10);
    });

    test("should show different toolchains on different pages", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("toolchains-table-row")).toHaveCount(10);

      // First toolchain name on first page.
      const firstToolchainName = await page
        .getByTestId("toolchains-table-row")
        .first()
        .locator("td")
        .first()
        .textContent();

      const toolchainsCard = page.getByTestId("toolchains-card");
      await toolchainsCard.getByRole("button", { name: "Next page" }).click();

      // First toolchain name on second page.
      const nextToolchainName = page
        .getByTestId("toolchains-table-row")
        .first()
        .locator("td")
        .first();
      // Toolchain names should not be equal.
      await expect(nextToolchainName).not.toHaveText(firstToolchainName!);
    });

    test("should show no toolchains when filtering for nonexistent item", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("toolchains-table-row")).toHaveCount(10);
      await page.getByTestId("toolchain-name-filter").click();
      await page.getByPlaceholder("Name regex").fill("faketoolchain");
      await page.getByPlaceholder("Name regex").press("Enter");
      await expect(page.getByTestId("toolchains-table-row")).toHaveCount(0);
    });
  });

  test.describe("files", () => {
    test("should show the corresponding files", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("files-table-row")).toHaveCount(10);
    });

    test("should show different files on different pages", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("files-table-row")).toHaveCount(10);

      // First file name on first page.
      const firstFileName = await page
        .getByTestId("files-table-row")
        .first()
        .locator("td")
        .first()
        .textContent();

      const filesCard = page.getByTestId("files-card");
      await filesCard.getByRole("button", { name: "Next page" }).click();

      // First file name on second page.
      const nextFileName = page
        .getByTestId("files-table-row")
        .first()
        .locator("td")
        .first();
      // File names should not be equal.
      await expect(nextFileName).not.toHaveText(firstFileName!);
    });

    test("should show no files when filtering for nonexistent item", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/image/ubuntu2204");
      await expect(page.getByTestId("files-table-row")).toHaveCount(10);
      await page.getByTestId("file-name-filter").click();
      await page.getByPlaceholder("Name regex").fill("notarealfile");
      await page.getByPlaceholder("Name regex").press("Enter");
      await expect(page.getByTestId("files-table-row")).toHaveCount(0);
    });
  });
});

test.describe("Side nav", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/image/ubuntu2204/build-information");
    await expect(
      page.getByRole("heading", { name: "ubuntu2204" }),
    ).toBeVisible();
    await expect(page.getByTestId("table-loader-loading-row")).toHaveCount(0);
  });

  test("highlights different sections as the user scrolls", async ({
    authenticatedPage: page,
  }) => {
    await page
      .getByTestId("general-card")
      .evaluate((element) => element.scrollIntoView({ block: "start" }));
    await expect(page.getByTestId("navitem-general")).toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(page.getByTestId("navitem-distros")).toHaveAttribute(
      "data-active",
      "false",
    );

    await page
      .getByTestId("distros-card")
      .evaluate((element) => element.scrollIntoView({ block: "start" }));
    await expect(page.getByTestId("navitem-general")).toHaveAttribute(
      "data-active",
      "false",
    );
    await expect(page.getByTestId("navitem-distros")).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  test("can click to navigate to different sections", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("navitem-packages")).toHaveAttribute(
      "data-active",
      "false",
    );
    await expect(page.getByTestId("packages-card")).not.toBeInViewport();
    await page.getByTestId("navitem-packages").click();
    await expect(page.getByTestId("navitem-packages")).toHaveAttribute(
      "data-active",
      "true",
    );
    await expect(page.getByTestId("packages-card")).toBeInViewport();
  });
});
