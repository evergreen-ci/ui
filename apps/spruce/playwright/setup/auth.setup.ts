import { test as setup } from "@playwright/test";
import { users } from "@evg-ui/playwright-config/constants";
import {
  SLACK_NOTIFICATION_BANNER,
  SEEN_WATERFALL_ONBOARDING_TUTORIAL,
  SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL,
  SEEN_TASK_REVIEW_TOOLTIP,
  SEEN_TEST_SELECTION_GUIDE_CUE,
  SEEN_GITHUB_NAV_GUIDE_CUE,
} from "constants/cookies";

const bannerCookie = "This is an important notification";

const dismissalCookies = (domain: string) => [
  { name: bannerCookie, value: "true", domain, path: "/" },
  { name: SLACK_NOTIFICATION_BANNER, value: "true", domain, path: "/" },
  {
    name: SEEN_WATERFALL_ONBOARDING_TUTORIAL,
    value: "true",
    domain,
    path: "/",
  },
  {
    name: SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL,
    value: "true",
    domain,
    path: "/",
  },
  { name: SEEN_TASK_REVIEW_TOOLTIP, value: "true", domain, path: "/" },
  { name: SEEN_TEST_SELECTION_GUIDE_CUE, value: "true", domain, path: "/" },
  { name: SEEN_GITHUB_NAV_GUIDE_CUE, value: "true", domain, path: "/" },
];

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-username").fill(users.admin.username);
  await page.getByTestId("login-password").fill(users.admin.password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/user/admin/patches");
  await page.context().addCookies(dismissalCookies("localhost"));
  await page.context().storageState({ path: "playwright/.auth/admin.json" });
});

setup("authenticate as privileged", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-username").fill(users.privileged.username);
  await page.getByTestId("login-password").fill(users.privileged.password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/user/privileged/patches");
  await page.context().addCookies(dismissalCookies("localhost"));
  await page
    .context()
    .storageState({ path: "playwright/.auth/privileged.json" });
});

setup("authenticate as regular", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-username").fill(users.regular.username);
  await page.getByTestId("login-password").fill(users.regular.password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/user/regular/patches");
  await page.context().addCookies(dismissalCookies("localhost"));
  await page.context().storageState({ path: "playwright/.auth/regular.json" });
});
