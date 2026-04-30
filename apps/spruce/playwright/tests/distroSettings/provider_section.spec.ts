import { test, expect } from "../../fixtures";
import { clickCheckbox, selectOption, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("provider section", () => {
  test.describe("static", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/distro/localhost/settings/provider");
    });

    test("successfully updates static provider fields", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("provider-select")).toContainText(
        "Static IP/VM",
      );
      await expect(page.getByTestId("static-provider-settings")).toBeVisible();

      const userDataInput = page.getByRole("textbox", {
        name: "User Data",
      });
      await userDataInput.fill("my user data");

      const mergeUserDataCheckbox = page.getByLabel(
        "Merge with existing user data",
      );
      await clickCheckbox(mergeUserDataCheckbox);

      await page.getByRole("button", { name: "Add security group" }).click();
      await page.getByLabel("Security Group ID").fill("sg-1234");
      await page.getByRole("button", { name: "Add host" }).click();
      await page.getByLabel("Name").fill("host-1234");
      await save(page);
      await validateToast(page, "success", "Updated distro.", true);

      await userDataInput.clear();
      await clickCheckbox(mergeUserDataCheckbox);
      await page.getByTestId("delete-item-button").first().click();
      await page.getByTestId("delete-item-button").first().click();
      await save(page);
      await validateToast(page, "success", "Updated distro.");
    });
  });

  test.describe("docker", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/distro/ubuntu1604-container-test/settings/provider");
    });

    test("shows pool mapping information based on container pool id", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByLabel("Container Pool ID")).toContainText(
        "test-pool-1",
      );
      await expect(page.getByLabel("Pool Mapping Information")).toHaveAttribute(
        "placeholder",
        /test-pool-1/,
      );
      await selectOption(page, "Container Pool ID", "test-pool-2");
      await expect(page.getByLabel("Pool Mapping Information")).toHaveAttribute(
        "placeholder",
        /test-pool-2/,
      );
    });

    test("successfully updates docker provider fields", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("provider-select")).toContainText("Docker");
      await expect(page.getByTestId("docker-provider-settings")).toBeVisible();

      await selectOption(page, "Image Build Method", "Pull");
      await selectOption(page, "Container Pool ID", "test-pool-2");
      await page.getByLabel("Username for Registries").fill("username");
      await page.getByLabel("Password for Registries").fill("password");

      const userDataInput = page.getByRole("textbox", {
        name: "User Data",
      });
      await userDataInput.fill("my user data");

      const mergeUserDataCheckbox = page.getByLabel(
        "Merge with existing user data",
      );
      await clickCheckbox(mergeUserDataCheckbox);
      await save(page);
      await validateToast(page, "success", "Updated distro.", true);

      await selectOption(page, "Image Build Method", "Import");
      await selectOption(page, "Container Pool ID", "test-pool-1");
      await page.getByLabel("Username for Registries").clear();
      await page.getByLabel("Password for Registries").clear();
      await userDataInput.clear();
      await clickCheckbox(mergeUserDataCheckbox);
      await save(page);
      await validateToast(page, "success", "Updated distro.");
    });
  });

  test.describe("ec2 fleet", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/distro/ubuntu1804-workstation/settings/provider");
      await expect(
        page.getByTestId("ec2-fleet-provider-settings"),
      ).toBeVisible();
      await expect(
        page
          .getByTestId("expandable-card-title")
          .filter({ hasText: "us-east-1" }),
      ).toBeVisible();
    });

    test("shows and hides fields correctly", async ({
      authenticatedPage: page,
    }) => {
      const useVpcCheckbox = page.getByRole("checkbox", {
        name: "Use security groups in an EC2 VPC",
      });
      await expect(useVpcCheckbox).toBeChecked();
      await expect(page.getByText("Default VPC Subnet ID")).toBeVisible();
      await expect(page.getByText("VPC Subnet Prefix")).toBeVisible();

      await clickCheckbox(useVpcCheckbox);
      await expect(useVpcCheckbox).not.toBeChecked();
      await expect(page.getByText("Default VPC Subnet ID")).toHaveCount(0);
      await expect(page.getByText("VPC Subnet Prefix")).toHaveCount(0);
    });

    test("successfully updates ec2 fleet provider fields", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("provider-select")).toContainText(
        "EC2 Fleet",
      );
      await expect(
        page.getByTestId("ec2-fleet-provider-settings"),
      ).toBeVisible();
      await expect(page.getByTestId("region-select")).toContainText(
        "us-east-1",
      );

      await selectOption(page, "Region", "us-west-1");
      await page.getByLabel("SSH Key Name").clear();
      await page.getByLabel("SSH Key Name").fill("my ssh key");
      await page.getByRole("button", { name: "Add mount point" }).click();
      await page.getByLabel("Device Name").fill("device name");
      await page.getByLabel("Size").fill("200");
      await save(page);
      await validateToast(page, "success", "Updated distro.", true);

      await selectOption(page, "Region", "us-east-1");
      await page.getByLabel("SSH Key Name").clear();
      await page.getByLabel("SSH Key Name").fill("mci");
      await page
        .getByTestId("mount-points")
        .getByTestId("delete-item-button")
        .click();
      await save(page);
      await validateToast(page, "success", "Updated distro.");
    });

    test("can add and delete region settings", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page
          .getByTestId("expandable-card-title")
          .filter({ hasText: "us-east-1" }),
      ).toBeVisible();

      const addRegionButton = page.getByRole("button", {
        name: "Add region settings",
      });
      await addRegionButton.click();
      await expect(addRegionButton).toHaveCount(0);

      const newExpandableCard = page.getByTestId("expandable-card").first();
      await expect(
        newExpandableCard
          .getByTestId("expandable-card-title")
          .filter({ hasText: "New AWS Region" }),
      ).toBeVisible();

      await selectOption(newExpandableCard, "Region", "us-west-1");
      await newExpandableCard.getByLabel("EC2 AMI ID").fill("ami-1234");
      await newExpandableCard.getByLabel("Instance Type").fill("m5.xlarge");
      await newExpandableCard
        .getByRole("button", { name: "Add security group" })
        .click();
      await newExpandableCard.getByLabel("Security Group ID").fill("sg-5678");
      await save(page);
      await validateToast(page, "success", "Updated distro.", true);

      await expect(page.getByTestId("save-settings-button")).toBeDisabled();
      await expect(
        page
          .getByTestId("expandable-card-title")
          .filter({ hasText: "us-west-1" }),
      ).toBeVisible();

      await page
        .getByTestId("expandable-card-title")
        .filter({ hasText: "us-west-1" })
        .locator("..")
        .getByTestId("delete-item-button")
        .first()
        .click();
      await expect(page.getByTestId("expandable-card")).toHaveCount(1);
      await expect(
        page
          .getByTestId("expandable-card-title")
          .filter({ hasText: "us-west-1" }),
      ).toHaveCount(0);
      await save(page);
      await validateToast(page, "success", "Updated distro.");
      await expect(addRegionButton).toBeVisible();
    });
  });

  test.describe("ec2 on-demand", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/distro/ubuntu1604-parent/settings/provider");
      await expect(
        page.getByTestId("ec2-on-demand-provider-settings"),
      ).toBeVisible();
    });

    test("shows and hides fields correctly", async ({
      authenticatedPage: page,
    }) => {
      const useVpcCheckbox = page.getByRole("checkbox", {
        name: "Use security groups in an EC2 VPC",
      });
      await expect(useVpcCheckbox).toBeChecked();
      await expect(page.getByText("Default VPC Subnet ID")).toBeVisible();
      await expect(page.getByText("VPC Subnet Prefix")).toBeVisible();

      await clickCheckbox(useVpcCheckbox);
      await expect(page.getByText("Default VPC Subnet ID")).toHaveCount(0);
      await expect(page.getByText("VPC Subnet Prefix")).toHaveCount(0);
    });

    test("successfully updates ec2 on-demand provider fields", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("provider-select")).toContainText(
        "EC2 On-Demand",
      );
      await expect(
        page.getByTestId("ec2-on-demand-provider-settings"),
      ).toBeVisible();
      await expect(page.getByTestId("region-select")).toContainText(
        "us-east-1",
      );

      await selectOption(page, "Region", "us-west-1");
      await page.getByLabel("EC2 AMI ID").clear();
      await page.getByLabel("EC2 AMI ID").fill("ami-1234560");
      await expect(page.getByLabel("SSH Key Name")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
      await page.getByLabel("SSH Key Name").clear();
      await page.getByLabel("SSH Key Name").fill("my ssh key");

      const userDataInput = page.getByRole("textbox", {
        name: "User Data",
      });
      await userDataInput.fill("<powershell></powershell>");

      const mergeUserDataCheckbox = page.getByRole("checkbox", {
        name: "Merge with existing user data",
      });
      await clickCheckbox(mergeUserDataCheckbox);
      await save(page);
      await validateToast(page, "success", "Updated distro.", true);

      await selectOption(page, "Region", "us-east-1");
      await page.getByLabel("EC2 AMI ID").clear();
      await page.getByLabel("EC2 AMI ID").fill("ami-0000");
      await page.getByLabel("SSH Key Name").clear();
      await page.getByLabel("SSH Key Name").fill("mci");
      await userDataInput.clear();
      await clickCheckbox(mergeUserDataCheckbox);
      await save(page);
      await validateToast(page, "success", "Updated distro.");
    });

    test("can add and delete region settings", async ({
      authenticatedPage: page,
    }) => {
      const addRegionButton = page.getByRole("button", {
        name: "Add region settings",
      });
      await addRegionButton.click();
      await expect(addRegionButton).toHaveCount(0);

      const newExpandableCard = page.getByTestId("expandable-card").first();
      await expect(
        newExpandableCard
          .getByTestId("expandable-card-title")
          .filter({ hasText: "New AWS Region" }),
      ).toBeVisible();

      await selectOption(newExpandableCard, "Region", "us-west-1");
      await newExpandableCard.getByLabel("EC2 AMI ID").fill("ami-1234");
      await newExpandableCard.getByLabel("Instance Type").fill("m5.xlarge");
      await newExpandableCard
        .getByRole("button", { name: "Add security group" })
        .click();
      await newExpandableCard.getByLabel("Security Group ID").fill("sg-0000");
      await save(page);
      await validateToast(page, "success", "Updated distro.", true);

      await expect(page.getByTestId("save-settings-button")).toBeDisabled();
      await expect(
        page
          .getByTestId("expandable-card-title")
          .filter({ hasText: "us-west-1" }),
      ).toBeVisible();

      await page
        .getByTestId("expandable-card-title")
        .filter({ hasText: "us-west-1" })
        .locator("..")
        .getByTestId("delete-item-button")
        .first()
        .click();
      await expect(page.getByTestId("expandable-card")).toHaveCount(1);
      await expect(
        page
          .getByTestId("expandable-card-title")
          .filter({ hasText: "us-west-1" }),
      ).toHaveCount(0);
      await save(page);
      await validateToast(page, "success", "Updated distro.");
      await expect(addRegionButton).toBeVisible();
    });
  });
});
