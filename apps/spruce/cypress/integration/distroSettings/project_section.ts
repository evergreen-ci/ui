import { save } from "./utils";

describe("project section", () => {
  beforeEach(() => {
    cy.visit("/distro/localhost/settings/project");
  });

  it("can update fields and those changes will persist", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Update fields.
    cy.contains("button", "Add expansion").should(
      "have.attr",
      "aria-disabled",
      "false",
    );
    cy.contains("button", "Add expansion").click();
    cy.getInputByLabel("Key").type("key-name");
    cy.getInputByLabel("Value").type("my-value");
    cy.contains("button", "Add project").click();
    cy.getInputByLabel("Project ID").type("spruce");

    save();
    cy.validateToast("success", "Updated distro.");

    // Changes should persist.
    cy.reload();
    cy.getInputByLabel("Key").should("have.value", "key-name");
    cy.getInputByLabel("Value").should("have.value", "my-value");
    cy.getInputByLabel("Project ID").should("have.value", "spruce");

    // Undo changes.
    cy.dataCy("delete-item-button").first().click();
    cy.dataCy("delete-item-button").first().click();
    save();
    cy.validateToast("success", "Updated distro.");
  });
});
