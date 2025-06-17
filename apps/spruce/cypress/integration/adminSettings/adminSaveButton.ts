import { clickSave } from "../../utils";

describe("admin settings page", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("save button disabled on initial load", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // update banner text field
    cy.getInputByLabel("Banner Text").clear();
    cy.getInputByLabel("Banner Text").type("some more banner text");

    // save button should be enabled after making changes
    clickSave();

    // validate that the toast message is displayed
    cy.validateToast("success", "Settings saved successfully");

    // validate changes persisted
    cy.reload();
    cy.getInputByLabel("Banner Text").should(
      "have.value",
      "some more banner text",
    );
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
  });
});
