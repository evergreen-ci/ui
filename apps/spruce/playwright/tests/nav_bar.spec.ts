import { users } from "@evg-ui/playwright-config/constants";
import { test, expect } from "../fixtures";
import { login, logout } from "../helpers";

const PATCH_ID = "5e4ff3abe3c3317e352062e4";
const USER_ID = "admin";
const SPRUCE_URLS = {
  admin: "/admin-settings/general",
  version: `/version/${PATCH_ID}/tasks`,
  userPatches: `/user/${USER_ID}/patches`,
  cli: `/preferences/cli`,
};

test.describe("Nav Bar", () => {
  const projectCookie = "mci-project-cookie";

  test("Nav Dropdown should link to patches page of most recent project if cookie exists", async ({
    authenticatedPage: page,
  }) => {
    await page.context().addCookies([
      {
        name: projectCookie,
        value: "spruce",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto(SPRUCE_URLS.userPatches);
    await page.getByTestId("auxiliary-dropdown-link").click();
    await page.getByTestId("auxiliary-dropdown-project-patches").click();
    await expect(page).toHaveURL(/\/project\/spruce\/patches/);
  });

  test("Nav Dropdown should link to patches page of default project in SpruceConfig if cookie does not exist", async ({
    authenticatedPage: page,
  }) => {
    await page.context().clearCookies({ name: projectCookie });
    await page.goto(SPRUCE_URLS.userPatches);
    await page.getByTestId("auxiliary-dropdown-link").click();
    await expect(
      page.getByTestId("auxiliary-dropdown-project-patches"),
    ).toHaveAttribute("href", "/project/evergreen/patches");
    await page.getByTestId("auxiliary-dropdown-project-patches").click();
    await expect(page).toHaveURL(/\/project\/evergreen\/patches/);
  });

  test("Should update the links in the nav bar when visiting a specific project patches page", async ({
    authenticatedPage: page,
  }) => {
    await page.context().clearCookies({ name: projectCookie });
    await page.goto("/project/evergreen/patches");
    await expect(page.getByTestId("patch-card")).toHaveCount(6);

    await expect(page.getByTestId("waterfall-link")).toHaveAttribute(
      "href",
      "/project/evergreen/waterfall",
    );
    await page.getByTestId("auxiliary-dropdown-link").click();
    await expect(
      page.getByTestId("auxiliary-dropdown-project-settings"),
    ).toHaveAttribute("href", "/project/evergreen/settings");

    const cookies = await page.context().cookies();
    const cookie = cookies.find((c) => c.name === projectCookie);
    expect(cookie?.value).toBe("evergreen");
  });

  test("Should update the links in the nav bar when visiting a specific project settings page", async ({
    authenticatedPage: page,
  }) => {
    await page.context().clearCookies({ name: projectCookie });
    await page.goto("/project/spruce/settings");
    await expect(page.getByTestId("project-settings-tab-title")).toBeVisible();

    await expect(page.getByTestId("waterfall-link")).toHaveAttribute(
      "href",
      "/project/spruce/waterfall",
    );
    await page.getByTestId("auxiliary-dropdown-link").click();
    await expect(
      page.getByTestId("auxiliary-dropdown-project-patches"),
    ).toHaveAttribute("href", "/project/spruce/patches");

    const cookies = await page.context().cookies();
    const cookie = cookies.find((c) => c.name === projectCookie);
    expect(cookie?.value).toBe("spruce");
  });

  test("Merge Queue link should navigate to project patches page with mergeQueue query param", async ({
    authenticatedPage: page,
  }) => {
    await page.context().addCookies([
      {
        name: projectCookie,
        value: "spruce",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto(SPRUCE_URLS.userPatches);
    await page.getByTestId("auxiliary-dropdown-link").click();
    await expect(
      page.getByTestId("auxiliary-dropdown-merge-queue"),
    ).toHaveAttribute("href", "/project/spruce/patches?mergeQueue=true");
    await page.getByTestId("auxiliary-dropdown-merge-queue").click();
    await expect(page).toHaveURL(/\/project\/spruce\/patches/);
    await expect(page).toHaveURL(/\?mergeQueue=true/);
  });

  test.describe("Admin settings", () => {
    test("Should show Admin button to admins", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(SPRUCE_URLS.version);
      await page.getByTestId("user-dropdown-link").click();
      const adminLink = page.getByTestId("admin-link");
      await expect(adminLink).toBeVisible();
      await expect(adminLink).toHaveAttribute("href", SPRUCE_URLS.admin);
    });

    test("Should not show Admin button to non-admins", async ({
      authenticatedPage: page,
    }) => {
      await logout(page);
      await login(page, users.regular);
      await page.goto(SPRUCE_URLS.version);
      await page.getByTestId("user-dropdown-link").click();
      await expect(page.getByText("UI Settings")).toBeVisible();
      // Admin link should not be visible for non-admins.
      await expect(page.getByTestId("admin-link")).toBeHidden();
    });
  });
});
