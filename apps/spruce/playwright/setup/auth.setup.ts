import { test as setup } from "@playwright/test";
import { users } from "@evg-ui/playwright-config/constants";
import {
  SEEN_GITHUB_NAV_GUIDE_CUE,
  SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL,
  SEEN_TASK_REVIEW_TOOLTIP,
  SEEN_TEST_SELECTION_GUIDE_CUE,
  SEEN_WATERFALL_ONBOARDING_TUTORIAL,
  SLACK_NOTIFICATION_BANNER,
} from "constants/cookies";

const bannerCookie = "This is an important notification";

const dismissalCookies = [
  { domain: "localhost", name: bannerCookie, path: "/", value: "true" },
  {
    domain: "localhost",
    name: SLACK_NOTIFICATION_BANNER,
    path: "/",
    value: "true",
  },
  {
    domain: "localhost",
    name: SEEN_WATERFALL_ONBOARDING_TUTORIAL,
    path: "/",
    value: "true",
  },
  {
    domain: "localhost",
    name: SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL,
    path: "/",
    value: "true",
  },
  {
    domain: "localhost",
    name: SEEN_TASK_REVIEW_TOOLTIP,
    path: "/",
    value: "true",
  },
  {
    domain: "localhost",
    name: SEEN_TEST_SELECTION_GUIDE_CUE,
    path: "/",
    value: "true",
  },
  {
    domain: "localhost",
    name: SEEN_GITHUB_NAV_GUIDE_CUE,
    path: "/",
    value: "true",
  },
];

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-username").fill(users.admin.username);
  await page.getByTestId("login-password").fill(users.admin.password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/user/admin/patches");
  await page.context().addCookies(dismissalCookies);
  await page.context().storageState({ path: "playwright/.auth/admin.json" });
});

setup("authenticate as privileged", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-username").fill(users.privileged.username);
  await page.getByTestId("login-password").fill(users.privileged.password);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("/user/privileged/patches");
  await page.context().addCookies(dismissalCookies);
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
  await page.context().addCookies(dismissalCookies);
  await page.context().storageState({ path: "playwright/.auth/regular.json" });
});
