import { test, expect } from "../../fixtures";

const hostsRoute = "/hosts";

const taskId =
  "mongo_tools_ubuntu1604_qa_dump_restore_with_archiving_current_patch_b7227e1b7aeaaa6283d53b32fc03968a46b19c2d_5f15ad3c3627e07772ab2d01_20_07_20_14_42_05";

const defaultHostsFirstPage = [
  "i-06f80fa6e28f93b",
  "i-06f80fa6e28f93b7",
  "i-06f80fa6e28f93b7d",
  "i-0fb9fe0592ea381",
  "i-0fb9fe0592ea3815",
  "i-0fb9fe0592ea38150",
  "macos-1014-68.macstadium.build.10gen",
  "macos-1014-68.macstadium.build.10gen.c",
  "macos-1014-68.macstadium.build.10gen.cc",
  "ubuntu1804-ppc-3.pic.build.10gen",
];

const hostsSecondPageWithLimitOfTen = [
  "ubuntu1804-ppc-3.pic.build.10gen.c",
  "ubuntu1804-ppc-3.pic.build.10gen.cc",
  "16326bd716fd4ad5845710c479c79e86c66b61bcef8ebbe7fc38dfc36fab512e",
  "1694cfe1eac28b3316339f6276021afcb2a07bcd21a266405835fd039557ea2d",
  "4b332e12790a585a0c7cbaf1650674f408117cf6134679c9e5f2e96cadd07923",
  "6e331e02aaaebba422d1f1d2dbd3e64f01776b84c68c672ea680e4b81b0719bb",
  "7f909d47566126bd39a05c1a5bd5d111c2e68de3830a8be414c18c231a47f4fc",
  "a99b50cd37b012c53db7207e4ba8b52989aefab551176c07962cea979abcc479",
  "b700d10f21a5386c827251a029dd931b5ea910377e0bb93f3393b17fb9bdbd08",
  "build10.ny.cbi.10gen",
];

test.describe("Hosts page default", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(`${hostsRoute}?limit=10`);
  });

  test("Renders hosts table with hosts sorted by status by default", async ({
    authenticatedPage: page,
  }) => {
    const rows = page.getByTestId("leafygreen-table-row");
    for (let i = 0; i < defaultHostsFirstPage.length; i++) {
      await expect(rows.nth(i)).toContainText(defaultHostsFirstPage[i]);
    }
  });

  test("ID column value links to host page", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page
        .getByTestId("leafygreen-table-row")
        .first()
        .getByTestId("host-id-link"),
    ).toHaveAttribute("href", "/host/i-06f80fa6e28f93b");
  });

  test("Current Task column value links to task page", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page
        .getByTestId("leafygreen-table-row")
        .first()
        .getByTestId("current-task-link"),
    ).toHaveAttribute("href", `/task/${taskId}`);
  });
});

test.describe("Hosts page pagination", () => {
  test("URL query parameters determine pagination values", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${hostsRoute}?limit=10&page=1`);
    const rows = page.getByTestId("leafygreen-table-row");
    for (let i = 0; i < hostsSecondPageWithLimitOfTen.length; i++) {
      await expect(rows.nth(i)).toContainText(hostsSecondPageWithLimitOfTen[i]);
    }

    await page.goto(`${hostsRoute}?limit=20&page=0`);
    const allHosts = [
      ...defaultHostsFirstPage,
      ...hostsSecondPageWithLimitOfTen,
    ];
    const rows2 = page.getByTestId("leafygreen-table-row");
    for (let i = 0; i < allHosts.length; i++) {
      await expect(rows2.nth(i)).toContainText(allHosts[i]);
    }
  });
});
