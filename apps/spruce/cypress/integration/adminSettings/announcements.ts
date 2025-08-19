import { clickSave } from "../../utils";

describe("announcements", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("can save after making changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    cy.getInputByLabel("Banner Text").clear();
    cy.getInputByLabel("Banner Text").type("some more banner text");

    clickSave();
    cy.validateToast("success", "Settings saved successfully");

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
