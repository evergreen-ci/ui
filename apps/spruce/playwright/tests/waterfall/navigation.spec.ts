import { expect, test } from "../../fixtures";

test.describe("navigation", () => {
  test("carries task filters onto the commit page without requester or navigation parameters", async ({
    page,
  }) => {
    await page.goto(
      "/project/evergreen/waterfall?tasks=agent,annotation&buildVariants=ubuntu1604,Lint&statuses=success&taskTags=db,agent&requesters=gitter_request&revision=33016573166a36bd5f46b4111151899d5c4e95b1&page=2&limit=5",
    );

    const commitLink = page
      .getByTestId("version-label-active")
      .getByRole("link", { name: "3301657" });
    await expect(commitLink).toBeVisible();
    const expectedFilters = {
      taskName: "agent|annotation",
      variant: "ubuntu1604|Lint",
      statuses: "success",
      taskTags: "db,agent",
    };
    const href = await commitLink.getAttribute("href");
    expect(href).not.toBeNull();
    expect(
      Object.fromEntries(new URL(href ?? "", page.url()).searchParams),
    ).toEqual(expectedFilters);

    await commitLink.click();
    await expect(page).toHaveURL(/\/version\/[^/]+\/tasks\?/);

    const params = new URL(page.url()).searchParams;
    expect(Object.fromEntries(params)).toMatchObject(expectedFilters);
  });

  test("can view the waterfall page", async ({ page }) => {
    await page.goto("/project/evergreen/waterfall");
    await expect(page.getByTestId("waterfall-page")).toBeVisible();
  });

  test("can visit other projects using project select", async ({ page }) => {
    await page.goto("/project/evergreen/waterfall");
    await expect(page.getByTestId("waterfall-page")).toBeVisible();

    await page.getByTestId("project-select").click();
    await page.getByTestId("project-display-name").getByText("Spruce").click();
    await expect(page).toHaveURL("/project/spruce/waterfall");
    await expect(page.getByTestId("waterfall-page")).toBeVisible();
  });

  test("project select stays open when typing a space", async ({ page }) => {
    await page.goto("/project/evergreen/waterfall");
    await expect(page.getByTestId("waterfall-page")).toBeVisible();

    await page.getByTestId("project-select").click();
    const searchInput = page.getByPlaceholder("Search projects");
    await expect(searchInput).toBeVisible();
    await searchInput.fill(" ");
    await expect(searchInput).toBeVisible();
  });

  test("is redirected to the waterfall page when a user visits a legacy route", async ({
    page,
  }) => {
    await page.goto("/commits/evergreen");
    await expect(page).toHaveURL("/project/evergreen/waterfall");
    await page.goto("/commits/evergreen?taskNames=test");
    await expect(page).toHaveURL("/project/evergreen/waterfall?tasks=test");
    await page.goto("/commits/evergreen?buildVariants=Ubuntu");
    await expect(page).toHaveURL(
      "/project/evergreen/waterfall?buildVariants=Ubuntu",
    );
  });
});
