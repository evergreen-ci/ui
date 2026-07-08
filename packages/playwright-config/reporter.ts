import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import fs from "fs";
import path from "path";

/**
 * Renames screenshots and videos with descriptive test names. Playwright generates random strings by default.
 */
class CustomReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    const testPath = test.titlePath();

    // Remove leading elements that are not relevant to the test name (e.g. "chromium" from the project name).
    const relevantPath = testPath.slice(2);
    const testSlug = relevantPath
      .join(">")
      .replace(/\//g, ">")
      .replace(/\s+/g, "_")
      .toLowerCase();

    result.attachments.forEach((attachment, index) => {
      if (!attachment.path) return;

      // Add retry attempt number if this is a retry.
      const retryStr = result.retry > 0 ? `-retry${result.retry}` : "";

      // Add index if there are multiple attachments of the same type.
      const indexStr = index > 0 ? `-${index}` : "";

      const dir = path.dirname(attachment.path);
      const ext = path.extname(attachment.path);
      const newFileName = `${testSlug}${retryStr}${indexStr}${ext}`;
      const newPath = path.join(dir, newFileName);

      try {
        if (fs.existsSync(attachment.path)) {
          fs.renameSync(attachment.path, newPath);
          attachment.path = newPath;
        }
      } catch (error) {
        console.error(`Failed to rename attachment: ${error}`);
      }
    });
  }
}

export default CustomReporter;
