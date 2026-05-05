import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

const route = "/preferences/publickeys";

const keyName1 =
  "a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name";
const keyName2 = "bKey";
const keyName3 = "a unique key name";
const keyName4 = "stuff!";

const invalidSSHPublicKeyError = "Value should be a valid SSH public key.";
const duplicateKeyError = "Duplicate key names are not allowed.";
const pubKey =
  "ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSUGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XAt3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/EnmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbxNrRFi9wrf+M7Q== schacon@mylaptop.local";
const pubKey2 =
  "ssh-dss AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSUGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XAt3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/EnmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbxNrRFi9wrf+M7Q== schacon@mylaptop.local";
const pubKey3 =
  "ssh-ed25519 AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSUGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XAt3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/EnmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbxNrRFi9wrf+M7Q== schacon@mylaptop.local";
const pubKey4 =
  "ecdsa-sha2-nistp256 AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSUGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XAt3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/EnmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbxNrRFi9wrf+M7Q== schacon@mylaptop.local";

test.describe("Public Key Management Page", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(route);
  });

  test.describe("Public keys list", () => {
    test("displays the user's public keys", async ({
      authenticatedPage: page,
    }) => {
      const keyNames = page.getByTestId("table-key-name");
      await expect(keyNames.nth(0)).toContainText(keyName1);
      await expect(keyNames.nth(1)).toContainText(keyName2);
    });

    test("removes a public key from the table after deletion", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("delete-btn").first().click();
      await page.getByTestId("popconfirm-confirm-button").click();
      await expect(page.getByTestId("table-key-name")).toHaveCount(1);
      await expect(page.getByTestId("table-key-name")).not.toContainText(
        keyName1,
      );
      await expect(page.getByTestId("table-key-name")).toContainText(keyName2);
    });

    test("displays empty message", async ({ authenticatedPage: page }) => {
      await page.getByTestId("delete-btn").first().click();
      await page.getByTestId("popconfirm-confirm-button").click();
      await expect(page.getByTestId("table-key-name")).toHaveCount(1);
      await page.getByTestId("delete-btn").first().click();
      await page.getByTestId("popconfirm-confirm-button").click();
      await expect(page.getByText("No keys saved.")).toBeVisible();
    });
  });

  test.describe("Add New Key Modal", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await expect(page.getByText(keyName2)).toBeVisible();
      await page.getByTestId("add-key-button").click();
    });

    test("displays errors when the modal opens", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByText(invalidSSHPublicKeyError)).toBeVisible();
    });

    test("error messages go away after typing valid input", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("key-name-input").fill(keyName3);
      await page.getByTestId("key-value-input").fill("ssh-dss someHash");
      await expect(page.getByText(invalidSSHPublicKeyError)).toHaveCount(0);
    });

    test("should include the public key in the list after adding", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("key-name-input").clear();
      await page.getByTestId("key-name-input").fill(keyName3);
      await page.getByTestId("key-value-input").clear();
      await page.getByTestId("key-value-input").fill(pubKey);
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByTestId("table-key-name").nth(1)).toContainText(
        keyName3,
      );
    });

    test("should show an error if the key name already exists", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("key-name-input").clear();
      await page.getByTestId("key-name-input").fill(keyName2);
      await expect(page.getByText(duplicateKeyError)).toBeVisible();
    });

    test("modal has correct title", async ({ authenticatedPage: page }) => {
      await expect(page.getByText("Add Public Key")).toBeVisible();
    });
  });

  test.describe("Edit Key Modal", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(route);
      await page.getByTestId("edit-btn").first().click();
      await expect(page.getByText("Update Public Key")).toBeVisible();
    });

    test("should not have any errors when the modal opens", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("error-message")).toHaveCount(0);
    });

    test("after submitting, the key name and key value are updated", async ({
      authenticatedPage: page,
    }) => {
      const saveButton = page.getByRole("button", { name: "Save" });
      const keyNameInput = page.getByTestId("key-name-input");
      const keyValueInput = page.getByTestId("key-value-input");

      await keyNameInput.clear();
      await keyNameInput.fill(keyName4);
      await keyValueInput.clear();
      await keyValueInput.fill(pubKey2);
      await saveButton.click();
      await validateToast(page, "success", "Updated public key.", true);
      await expect(page.getByTestId("table-key-name").nth(1)).toContainText(
        keyName4,
      );

      await page.getByTestId("edit-btn").nth(1).click();
      await expect(keyNameInput).toHaveValue(keyName4);
      await expect(keyValueInput).toHaveValue(pubKey2);
      await keyValueInput.clear();
      await keyValueInput.fill(pubKey3);
      await saveButton.click();
      await validateToast(page, "success", "Updated public key.", true);
      await expect(page.getByTestId("table-key-name").nth(1)).toContainText(
        keyName4,
      );

      await page.getByTestId("edit-btn").nth(1).click();
      await expect(keyNameInput).toHaveValue(keyName4);
      await expect(keyValueInput).toHaveValue(pubKey3);
      await keyValueInput.clear();
      await keyValueInput.fill(pubKey4);
      await saveButton.click();
      await validateToast(page, "success", "Updated public key.", true);
      await expect(page.getByTestId("table-key-name").nth(1)).toContainText(
        keyName4,
      );

      await page.getByTestId("edit-btn").nth(1).click();
      await expect(keyNameInput).toHaveValue(keyName4);
      await expect(keyValueInput).toHaveValue(pubKey4);
    });
  });

  test.describe("Error State", () => {
    test("should show an error toast after submitting an invalid public key", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("add-key-button").click();
      await page.getByTestId("key-name-input").fill("rsioeantarsn");
      await page.getByTestId("key-value-input").fill("ssh-rsa ");
      const saveButton = page.getByRole("button", { name: "Save" });
      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      await validateToast(
        page,
        "error",
        "There was an error creating the public key",
      );
    });
  });
});
