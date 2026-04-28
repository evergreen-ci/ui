import { test, expect } from "../../fixtures";

const hostsRoute = "/hosts";

const sortByTests = [
  {
    sorterName: "ID",
    sortBy: "ID",
    expectedIds: [
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
    ],
  },
  {
    sorterName: "distro",
    sortBy: "DISTRO",
    expectedIds: [
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
    ],
  },
  {
    sorterName: "current task",
    sortBy: "CURRENT_TASK",
    expectedIds: [
      "i-04ade558e1e26b0ad",
      "i-07669e7a3cd2c238c",
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
    ],
  },
  {
    sorterName: "status",
    sortBy: "STATUS",
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
  {
    sorterName: "elapsed",
    sortBy: "ELAPSED",
    expectedIds: [
      "i-04ade558e1e26b0ad",
      "i-07669e7a3cd2c238c",
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
    ],
  },
  {
    sorterName: "uptime",
    sortBy: "UPTIME",
    expectedIds: [
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
      "ubuntu1604-ppc-1.pic.build.10gen.cc",
      "i-092593689871a50dc",
      "rhel71-ppc-1.pic.build.10gen.c",
      "rhel71-ppc-1.pic.build.10gen.cc",
      "16326bd716fd4ad5845710c479c79e86c66b61bcef8ebbe7fc38dfc36fab512e",
      "1694cfe1eac28b3316339f6276021afcb2a07bcd21a266405835fd039557ea2d",
      "4b332e12790a585a0c7cbaf1650674f408117cf6134679c9e5f2e96cadd07923",
      "6e331e02aaaebba422d1f1d2dbd3e64f01776b84c68c672ea680e4b81b0719bb",
    ],
  },
  {
    sorterName: "idle time",
    sortBy: "IDLE_TIME",
    expectedIds: [
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
    ],
  },
];

const sortDirectionTests = [
  {
    sortDir: "ASC",
    order: "ascending",
    expectedIds: [
      "i-04ade558e1e26b0ad",
      "i-07669e7a3cd2c238c",
      "i-0d0ae8b83366d22",
      "i-0d0ae8b83366d22b",
      "i-0d0ae8b83366d22be",
      "macos-1014-68.macstadium.build.10gen",
      "macos-1014-68.macstadium.build.10gen.c",
      "macos-1014-68.macstadium.build.10gen.cc",
      "ubuntu1604-ppc-1.pic.build.10gen",
      "ubuntu1604-ppc-1.pic.build.10gen.c",
    ],
  },
  {
    sortDir: "DESC",
    order: "descending",
    expectedIds: [
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
    ],
  },
];

test.describe("Hosts page sorting", () => {
  const distroSortControl = "button[aria-label='Sort by Distro']";

  test("Clicking the sort direction filter will set the page query param to 0", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${hostsRoute}?page=5`);
    const hostsTable = page.getByTestId("hosts-table");
    await expect(hostsTable).toBeVisible();
    await expect(hostsTable).toHaveAttribute("data-loading", "false");
    await page.locator(distroSortControl).click();
    await expect(page).toHaveURL("/hosts?page=0&sorts=DISTRO%3AASC");
  });

  test("Clicking a sort direction 3 times clears the sort params and sets page to 0", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(hostsRoute);
    await page.locator(distroSortControl).click();
    await expect(page).toHaveURL("/hosts?page=0&sorts=DISTRO%3AASC");
    await page.locator(distroSortControl).click();
    await expect(page).toHaveURL("/hosts?page=0&sorts=DISTRO%3ADESC");
    await page.locator(distroSortControl).click();
    await expect(page).toHaveURL("/hosts?page=0");
  });

  test("Status sorter is selected by default if no sort params in url", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(hostsRoute);
    await expect(
      page.locator("svg[aria-label='Sort Ascending Icon']"),
    ).toBeVisible();
  });

  test("Status sorter has initial value of sort param from url", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${hostsRoute}?page=0&sorts=DISTRO%3ADESC`);
    await expect(
      page.locator("svg[aria-label='Sort Descending Icon']"),
    ).toBeVisible();
  });

  sortByTests.forEach(({ expectedIds, sortBy, sorterName }) => {
    test(`Sorts by ${sorterName} when sorts = ${sortBy}`, async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`${hostsRoute}?sorts=${sortBy}%3AASC&limit=10`);
      const rows = page.getByTestId("leafygreen-table-row");
      for (let i = 0; i < expectedIds.length; i++) {
        await expect(rows.nth(i)).toContainText(expectedIds[i]);
      }
    });
  });

  sortDirectionTests.forEach(({ expectedIds, order, sortDir }) => {
    test(`Sorts in ${order} order when sorts = CURRENT_TASK:${sortDir}`, async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `${hostsRoute}?page=0&sorts=CURRENT_TASK%3A${sortDir}&limit=10`,
      );
      const rows = page.getByTestId("leafygreen-table-row");
      for (let i = 0; i < expectedIds.length; i++) {
        await expect(rows.nth(i)).toContainText(expectedIds[i]);
      }
    });
  });

  test("Uses default sorts if sorts param is invalid", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${hostsRoute}?sorts=INVALID%3AINVALID&limit=10`);
    const expectedIds = [
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
    const rows = page.getByTestId("leafygreen-table-row");
    for (let i = 0; i < expectedIds.length; i++) {
      await expect(rows.nth(i)).toContainText(expectedIds[i]);
    }
  });
});
