import { test, expect } from "../../fixtures";

test.describe("task logs", () => {
  const LOGS_ROUTE =
    "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs";

  const taskLogsButton = "button[id='cy-task-option']";
  const agentLogsButton = "button[id='cy-agent-option']";
  const systemLogsButton = "button[id='cy-system-option']";
  const eventLogsButton = "button[id='cy-event-option']";
  const allLogsButton = "button[id='cy-all-option']";

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(LOGS_ROUTE);
  });

  test("Should default to the task logs page when logtype is not indicated in URL query param", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.locator(taskLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("Should display 'No logs' and disable Parsley, HTML and Raw buttons when no logs are found.", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page.getByTestId("cy-no-logs").getByText("No logs"),
    ).toBeVisible();
    await expect(page.getByTestId("parsley-log-btn")).toBeDisabled();
    await expect(page.getByTestId("html-log-btn")).toBeDisabled();
    await expect(page.getByTestId("raw-log-btn")).toBeDisabled();
  });

  test("Should link to Parsley, HTML and Raw version of logs", async ({
    authenticatedPage: page,
  }) => {
    await page.locator(systemLogsButton).click();
    await expect(page.locator(systemLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );

    const htmlLogBtn = page.getByTestId("html-log-btn");
    await expect(htmlLogBtn).toHaveAttribute("href");
    const htmlHref = await htmlLogBtn.getAttribute("href");
    expect(htmlHref).toContain(
      "task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/html-log?execution=0&origin=system",
    );

    const rawLogBtn = page.getByTestId("raw-log-btn");
    await expect(rawLogBtn).toHaveAttribute("href");
    const rawHref = await rawLogBtn.getAttribute("href");
    expect(rawHref).toContain(
      "/task_log_raw/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/0?type=S&text=true",
    );
  });

  test("Event logs should not have an HTML button, Raw button, or Parsley button", async ({
    authenticatedPage: page,
  }) => {
    await page.locator(eventLogsButton).click();
    await expect(page.locator(eventLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByTestId("html-log-btn")).toBeHidden();
    await expect(page.getByTestId("raw-log-btn")).toBeHidden();
    await expect(page.getByTestId("parsley-log-btn")).toBeHidden();
  });

  test("Should update logtype query param to agent after checking agent radio button", async ({
    authenticatedPage: page,
  }) => {
    await page.locator(agentLogsButton).click();
    await expect(page.locator(agentLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(page.url()).toContain(LOGS_ROUTE);
    expect(page.url()).toContain("logtype=agent");
  });

  test("Should update logtype query param to event after checking event radio button", async ({
    authenticatedPage: page,
  }) => {
    await page.locator(eventLogsButton).click();
    await expect(page.locator(eventLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(page.url()).toContain(LOGS_ROUTE);
    expect(page.url()).toContain("logtype=event");
  });

  test("Should update logtype query param to system after checking system radio button", async ({
    authenticatedPage: page,
  }) => {
    await page.locator(systemLogsButton).click();
    await expect(page.locator(systemLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(page.url()).toContain(LOGS_ROUTE);
    expect(page.url()).toContain("logtype=system");
  });

  test("Should update logtype query param to all after checking all radio button", async ({
    authenticatedPage: page,
  }) => {
    await page.locator(allLogsButton).click();
    await expect(page.locator(allLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(page.url()).toContain(LOGS_ROUTE);
    expect(page.url()).toContain("logtype=all");
  });

  test("Should initially load with task log radio checked when logtype query param is task", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${LOGS_ROUTE}?logtype=task`);
    await expect(page.locator(taskLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("Should initially load with task log radio checked as default when logtype query param is not a valid log type", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${LOGS_ROUTE}?logtype=soeiantsrein`);
    await expect(page.locator(taskLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("Should initially load with agent log radio checked when logtype query param is agent", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${LOGS_ROUTE}?logtype=agent`);
    await expect(page.locator(agentLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("Should initially load with system log radio checked when logtype query param is system", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${LOGS_ROUTE}?logtype=system`);
    await expect(page.locator(systemLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("Should initially load with event log radio checked when logtype query param is event", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${LOGS_ROUTE}?logtype=event`);
    await expect(page.locator(eventLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("Should initially load with all log radio checked when logtype query param is all", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${LOGS_ROUTE}?logtype=all`);
    await expect(page.locator(allLogsButton)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});

test.describe("HTML log viewer", () => {
  const taskPageURL =
    "/task/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/logs";
  const taskLogURL =
    "/task/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/html-log?execution=0&origin=task";

  test("loads a HTML log page on click", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(taskPageURL);
    await expect(page.getByTestId("html-log-btn")).toBeVisible();
    await expect(page.getByTestId("html-log-btn")).toBeEnabled();
    await page.getByTestId("html-log-btn").click();
    await expect(page.getByText("Task logger initialized")).toBeVisible();
    expect(page.url()).toContain(taskLogURL);
  });

  test("scrolls to the selected line when opening an HTML log", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${taskLogURL}#L292`);

    await expect(
      page.getByText(
        "[2022/03/02 17:05:20.558] Putting spruce/build/source_map.html into mciuploads",
      ),
    ).toBeVisible();
  });
});
