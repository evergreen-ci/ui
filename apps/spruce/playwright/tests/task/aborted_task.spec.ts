import { test, expect } from "../../fixtures";

test.describe("Task page for an aborted task", () => {
  test("Should link to failing task in task metadata should exist for aborted tasks", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      "task/mongodb_mongo_main_enterprise_rhel_62_64_bit_dbtest_patch_0af9c85d7e2ba60f592f2d7a9a35217e254e59fb_5ee1efb3d1fe073e194e8b5c_20_06_11_08_48_06",
    );
    await expect(
      page.getByTestId("abort-message-failing-task"),
    ).toHaveAttribute(
      "href",
      "/task/mongodb_mongo_main_commit_queue_validate_commit_message_patch_0af9c85d7e2ba60f592f2d7a9a35217e254e59fb_5ee1efb3d1fe073e194e8b5c_20_06_11_08_48_06",
    );
  });

  test("Should not contain an abort message for non-aborted tasks", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      "task/mongodb_mongo_main_commit_queue_validate_commit_message_patch_0af9c85d7e2ba60f592f2d7a9a35217e254e59fb_5ee1efb3d1fe073e194e8b5c_20_06_11_08_48_06",
    );
    await expect(page.getByTestId("abort-message-failing-task")).toBeHidden();
  });
});
