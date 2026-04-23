import { test, expect } from "../../fixtures";
import { clickCheckboxByLabel } from "../../helpers";

const hostsRoute = "/hosts";

const textFilterTests = [
  {
    testName: "host ID filter",
    filterIconDataCy: "host-id-filter",
    filterValue: "i-0d0ae8b83366d22",
    filterUrlParam: "hostId=i-0d0ae8b83366d22",
    expectedIds: ["i-0d0ae8b83366d22"],
  },
  {
    testName: "host ID (EC2) filter",
    filterIconDataCy: "host-id-filter",
    filterValue: "ec2-34-207-222-84.compute-1.amazonaws.com",
    filterUrlParam: "hostId=ec2-34-207-222-84.compute-1.amazonaws.com",
    expectedIds: ["i-06f80fa6e28f93b7d"],
  },
  {
    testName: "distro ID filter",
    filterIconDataCy: "distro-id-filter",
    filterValue: "macos-1014",
    filterUrlParam: "distroId=macos-1014",
    expectedIds: [
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
    ],
  },
  {
    testName: "current task ID filter",
    filterIconDataCy: "current-task-id-filter",
    filterValue:
      "mongodb_mongo_v3.6_debian92_sharding_auth_bc405c72dce4714da604810cdc90c132bd5fbaa1_20_07_20_17_39_20",
    filterUrlParam:
      "currentTaskId=mongodb_mongo_v3.6_debian92_sharding_auth_bc405c72dce4714da604810cdc90c132bd5fbaa1_20_07_20_17_39_20",
    expectedIds: [
      "i-0fb9fe0592ea381",
      "i-0fb9fe0592ea3815",
      "i-0fb9fe0592ea38150",
    ],
  },
  {
    testName: "owner filter",
    filterIconDataCy: "owner-filter",
    filterValue: "mci",
    filterUrlParam: "startedBy=mci",
    expectedIds: [
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
    ],
  },
];

test.describe("Hosts page filtering from table filters", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(`${hostsRoute}?page=0`);
    const hostsTable = page.getByTestId("hosts-table");
    await expect(hostsTable).toBeVisible();
    await expect(hostsTable).toHaveAttribute("data-loading", "false");
  });

  textFilterTests.forEach(
    ({
      expectedIds,
      filterIconDataCy,
      filterUrlParam,
      filterValue,
      testName,
    }) => {
      test(`Filters hosts using table filter for ${testName}`, async ({
        authenticatedPage: page,
      }) => {
        const filterIcon = page.getByTestId(filterIconDataCy);
        await expect(filterIcon).toBeVisible();
        await filterIcon.click();

        const filterWrapper = page.getByTestId(`${filterIconDataCy}-wrapper`);
        await expect(filterWrapper).toBeVisible();

        const searchInput = page.locator("input[type='search']");
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toBeFocused();
        await searchInput.fill(filterValue);
        await searchInput.press("Enter");

        await expect(filterWrapper).toBeHidden();
        await expect(page).toHaveURL(new RegExp(filterUrlParam));
        await expect(page.getByTestId("hosts-table")).toHaveAttribute(
          "data-loading",
          "false",
        );

        const rows = page.getByTestId("leafygreen-table-row");
        for (let i = 0; i < expectedIds.length; i++) {
          await expect(rows.nth(i)).toContainText(expectedIds[i]);
        }
      });
    },
  );

  test("Filters hosts using table filter for statuses", async ({
    authenticatedPage: page,
  }) => {
    const filterIcon = page.getByTestId("statuses-filter");
    await expect(filterIcon).toBeVisible();
    await filterIcon.click();

    const filterWrapper = page.getByTestId("statuses-filter-wrapper");
    await expect(filterWrapper).toBeVisible();

    await clickCheckboxByLabel(page, "Running");
    await filterIcon.click();

    await expect(page).toHaveURL(/statuses=running/);
    await expect(page.getByTestId("hosts-table")).toHaveAttribute(
      "data-loading",
      "false",
    );

    const expectedIds = [
      "16326bd716fd4ad5845710c479c79e86c66b61bcef8ebbe7fc38dfc36fab512e",
      "1694cfe1eac28b3316339f6276021afcb2a07bcd21a266405835fd039557ea2d",
      "4b332e12790a585a0c7cbaf1650674f408117cf6134679c9e5f2e96cadd07923",
      "6e331e02aaaebba422d1f1d2dbd3e64f01776b84c68c672ea680e4b81b0719bb",
      "7f909d47566126bd39a05c1a5bd5d111c2e68de3830a8be414c18c231a47f4fc",
      "a99b50cd37b012c53db7207e4ba8b52989aefab551176c07962cea979abcc479",
      "b700d10f21a5386c827251a029dd931b5ea910377e0bb93f3393b17fb9bdbd08",
      "build10.ny.cbi.10gen",
      "build10.ny.cbi.10gen.c",
      "build10.ny.cbi.10gen.cc",
    ];
    const rows = page.getByTestId("leafygreen-table-row");
    for (let i = 0; i < expectedIds.length; i++) {
      await expect(rows.nth(i)).toContainText(expectedIds[i]);
    }
  });
});
